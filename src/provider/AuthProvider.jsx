import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react"

import { authService } from "@/services/auth.service"
import { userService } from "@/services/user.service"
import { queryClient } from "@/provider/QueryProvider"
import useUserStore from "@/store/userStore"

const AuthContext = createContext(null)

// JWT ichidan payload olish
const decodeJwt = (token) => {
  try {
    const payload = token?.split(".")?.[1]
    if (!payload) return null

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((char) => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    )
  } catch {
    return null ;
  }
}

// Backend user ma'lumotini frontend formatiga o'tkazish
const createUser = (userData, token) => {
  const decodedToken = decodeJwt(token)

  const roleName =
    userData?.roleName || decodedToken?.roleName || "ROLE_ADMIN"

  const isSuperAdmin =
    roleName === "ROLE_SUPER_ADMIN" || roleName === "SUPER_ADMIN"

  const isManager =
    roleName === "ROLE_MANAGER" || roleName === "MANAGER"

  const isBoss =
    roleName === "ROLE_BOSS" || roleName === "BOSS"

  let role = "VILOYAT_ADMIN"
  let roleLabel = "Viloyat Admin"

  if (isSuperAdmin) {
    role = "SUPER_ADMIN"
    roleLabel = "Super Admin"
  } else if (isBoss) {
    role = "BOSS"
    roleLabel = "Rahbariyat"
  } else if (isManager) {
    role = "MANAGER"
    roleLabel = "Menejer"
  }

  const firstName = userData?.firstName || ""
  const lastName = userData?.lastName || ""

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    userData?.fullname ||
    userData?.name ||
    roleLabel

  return {
    id: String(
      userData?.id || decodedToken?.userId || decodedToken?.sub || "usr-1"
    ),
    username:
      userData?.phone ||
      userData?.username ||
      decodedToken?.sub ||
      "",
    phone: userData?.phone,
    name: fullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    role,
    rawRole: roleName,
    roleLabel,
    email: userData?.email || `${userData?.phone || "admin"}@gidrogo.uz`,
    region: userData?.regionName || userData?.region || undefined,
    regionId: userData?.regionId,
    attachmentPath: userData?.attachmentPath || userData?.avatar,
    permissions: userData?.permissions || [],
  }
}

export const AuthProvider = ({ children }) => {
  const user = useUserStore((state) => state.userInfo)
  const userToken = useUserStore((state) => state.userToken)
  const token = userToken?.accessToken || null

  const isAuthenticated = Boolean(token && user)
  const [isInitializing, setIsInitializing] = useState(true)
  const syncInitiatedRef = useRef(false)

  // Backend'dan user ma'lumotlarini olish
  const fetchUser = useCallback(async (authToken) => {
    try {
      const response = await userService.getMe()
      const userData = response?.data || response

      const formattedUser = createUser(userData, authToken)

      useUserStore.getState().actions.setUserInfo(formattedUser)
      queryClient.setQueryData(["user", "me", authToken], userData)

      return formattedUser
    } catch {
      const decodedToken = decodeJwt(authToken)
      const userId = decodedToken?.userId || decodedToken?.sub

      if (userId) {
        try {
          const response = await userService.getAdminById(userId)
          const userData = response?.data || response

          const formattedUser = createUser(userData, authToken)
          useUserStore.getState().actions.setUserInfo(formattedUser)
          return formattedUser
        } catch {
          // Token asosida davom etadi
        }
      }

      const formattedUser = createUser(null, authToken)
      useUserStore.getState().actions.setUserInfo(formattedUser)
      return formattedUser
    }
  }, [])

  // LOGIN
  const login = useCallback(
    async (username, password) => {
      try {
        const cleanUsername = username.trim().replace(/[\s()-]/g, "")
        const phone = cleanUsername.startsWith("+")
          ? cleanUsername
          : `+${cleanUsername}`
        const cleanPassword = password.trim()

        if (!cleanUsername || !cleanPassword) {
          return {
            success: false,
            error: "Foydalanuvchi nomi va parolni kiriting!",
          }
        }

        const response = await authService.login({
          phone,
          password: cleanPassword,
        })

        const data = response?.data || response

        const accessToken =
          data?.access?.accessToken ||
          data?.accessToken ||
          data?.token ||
          data?.jwt

        const refreshToken =
          data?.access?.refreshToken || data?.refreshToken || ""

        if (!accessToken) {
          return {
            success: false,
            error: data?.message || "Login yoki parol noto'g'ri.",
          }
        }

        const initialUser = createUser(data, accessToken)

        useUserStore.getState().actions.setUserInfoAndToken(initialUser, {
          accessToken,
          refreshToken,
        })

        const fullUser = await fetchUser(accessToken)

        return {
          success: true,
          user: fullUser,
        }
      } catch (error) {
        const status = error?.response?.status || error?.status
        const message = error?.response?.data?.message || error?.message

        if (status === 400 || status === 401 || status === 403 || status === 404) {
          return {
            success: false,
            error: "Foydalanuvchi topilmadi yoki parol noto'g'ri.",
          }
        }

        return {
          success: false,
          error: message || "Serverga ulanishda xatolik yuz berdi.",
        }
      }
    },
    [fetchUser]
  )

  // LOGOUT
  const logout = useCallback(() => {
    const currentToken = useUserStore.getState().userToken?.accessToken
    if (currentToken) {
      authService.logout(currentToken).catch(() => {})
    }
    useUserStore.getState().actions.clearUserInfoAndToken()
  }, [])

  // User ma'lumotlarini qayta yangilash
  const refetchUser = useCallback(async () => {
    const currentToken = useUserStore.getState().userToken?.accessToken
    if (!currentToken) return
    await fetchUser(currentToken)
  }, [fetchUser])

  // Ilova ochilganda mavjud sessiyani tiklash
  useEffect(() => {
    let isMounted = true

    const restoreSession = async () => {
      const currentToken = useUserStore.getState().userToken?.accessToken

      if (!currentToken) {
        if (isMounted) setIsInitializing(false)
        return
      }

      if (syncInitiatedRef.current) {
        if (isMounted) setIsInitializing(false)
        return
      }
      syncInitiatedRef.current = true

      try {
        await fetchUser(currentToken)
      } catch (error) {
        const status = error?.response?.status || error?.status
        if (status === 401 || status === 403) {
          useUserStore.getState().actions.clearUserInfoAndToken()
        }
      } finally {
        if (isMounted) setIsInitializing(false)
      }
    }

    restoreSession()

    return () => {
      isMounted = false
    }
  }, [fetchUser])

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isInitializing,
      login,
      logout,
      refetchUser,
    }),
    [user, token, isAuthenticated, isInitializing, login, logout, refetchUser]
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export default AuthProvider
