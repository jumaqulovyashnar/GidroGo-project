import { createContext, useContext, useCallback, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/entities/user"
import { authService } from "@/services"
import { api } from "@/shared/api"

const AuthContext = createContext(null)

export const decodeJwt = (token) => {
  try {
    const payload = token?.split(".")?.[1]

    if (!payload) {
      return null
    }

    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")

    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map(
            (char) =>
              "%" +
              ("00" + char.charCodeAt(0).toString(16)).slice(-2)
          )
          .join("")
      )
    )
  } catch {
    return null
  }
}

export const getResponseData = (response) => {
  return response?.data ?? response
}

export const getErrorStatus = (error) => {
  return (
    error?.response?.status ||
    error?.status ||
    null
  )
}

export const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    null
  )
}

export const getUserIdFromToken = (token) => {
  const decodedToken = decodeJwt(token)

  return (
    decodedToken?.userId ||
    decodedToken?.sub ||
    null
  )
}

export const getAuthTokens = (data) => {
  return {
    accessToken:
      data?.access?.accessToken ||
      data?.accessToken ||
      data?.token ||
      data?.jwt ||
      null,

    refreshToken:
      data?.access?.refreshToken ||
      data?.refreshToken ||
      null,
  }
}

export const createUser = (userData, token) => {
  const decodedToken = decodeJwt(token)

  const rawRole =
    userData?.roleName ||
    userData?.rawRole ||
    userData?.role ||
    decodedToken?.roleName ||
    decodedToken?.role ||
    "ROLE_ADMIN"

  const userId =
    userData?.id ||
    decodedToken?.userId ||
    decodedToken?.sub ||
    "usr-1"

  const roleMap = {
    ROLE_SUPER_ADMIN: "SUPER_ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",

    ROLE_MANAGER: "MANAGER",
    MANAGER: "MANAGER",

    ROLE_BOSS: "BOSS",
    BOSS: "BOSS",
  }

  const role = roleMap[rawRole] || rawRole || "VILOYAT_ADMIN"

  let roleLabel = userData?.roleLabel
  if (role === "BOSS") {
    roleLabel = "Ferma rahbari"
  } else if (!roleLabel) {
    if (role === "SUPER_ADMIN") roleLabel = "Super Admin"
    else if (role === "MANAGER") roleLabel = "Menejer"
    else roleLabel = "Viloyat Admin"
  }

  const firstName = userData?.firstName || ""
  const lastName = userData?.lastName || ""

  let fullName =
    userData?.name ||
    [firstName, lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    userData?.fullname ||
    roleLabel

  if (fullName === "Ferma boshlig'i" || fullName === "Ferma boshlig‘i") {
    fullName = "Ferma rahbari"
  }

  return {
    id: String(userId),

    username:
      userData?.phone ||
      userData?.username ||
      decodedToken?.sub ||
      "",

    phone: userData?.phone,

    name: fullName,

    firstName:
      firstName || undefined,

    lastName:
      lastName || undefined,

    role,

    rawRole,

    roleLabel,

    email:
      userData?.email || `${userData?.phone || "admin"}@gidrogo.uz`,

    region:
      userData?.regionName ||
      userData?.region ||
      undefined,

    regionId:
      userData?.regionId,

    attachmentPath:
      userData?.attachmentPath ||
      userData?.avatar,

    permissions:
      userData?.permissions || [],
  }
}

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient()
  const user = useUserStore((state) => state.userInfo)
  const userToken = useUserStore((state) => state.userToken)
  const token = userToken?.accessToken || null
  const isAuthenticated = Boolean(token && user)
  const isInitializing = false

  // LOGIN
  const login = useCallback(
    async (phoneInput, passwordInput) => {
      try {
        const cleanPhone = (phoneInput || "").trim()
        const cleanPassword = (passwordInput || "").trim()

        if (!cleanPhone || !cleanPassword) {
          return {
            success: false,
            error: "Telefon raqami va parolni kiriting!",
          }
        }

        const response = await authService.login({
          phone: cleanPhone,
          password: cleanPassword,
        })

        const data = getResponseData(response)
        const tokens = getAuthTokens(data)
        const accessToken = tokens.accessToken
        const refreshToken = tokens.refreshToken || ""

        if (!accessToken) {
          return {
            success: false,
            error: data?.message || "Login yoki parol noto'g'ri.",
          }
        }

        const userObj = createUser(data?.user || data, accessToken)

        useUserStore.getState().actions.setUserInfoAndToken(userObj, {
          accessToken,
          refreshToken,
        })

        return {
          success: true,
          user: userObj,
        }
      } catch (error) {
        const status = getErrorStatus(error)
        const message = getErrorMessage(error)

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
    []
  )

  // LOGOUT
  const logout = useCallback(() => {
    const currentToken = useUserStore.getState().userToken?.accessToken
    if (currentToken) {
      if (typeof authService.logout === "function") {
        authService.logout(currentToken).catch(() => {})
      } else if (typeof authService.logOut === "function") {
        authService.logOut(currentToken).catch(() => {})
      }
    }
    useUserStore.getState().actions.clearUserInfoAndToken()
    try {
      queryClient.cancelQueries()
      queryClient.clear()
    } catch {
      // ignore
    }
    delete api.defaults.headers.common["Authorization"]
  }, [queryClient])

  // User ma'lumotlarini qayta yangilash (agar kerak bo'lsa)
  const refetchUser = useCallback(async () => {
    // Backendda /users/me mavjud bo'lmagani uchun hech narsa qilinmaydi
  }, [])

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