import { createContext, useContext, useCallback, useMemo, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useUserStore } from "@/entities/user"
import { authService } from "@/services"
import { api } from "@/shared/api"
import { cleanPhoneForBackend } from "@/shared/lib"

import {
  decodeJwt,
  getUserIdFromToken,
  getAuthTokens,
  createUser,
  ROLES,
  getHomePath,
} from "@/entities/user"

export { decodeJwt, getUserIdFromToken, getAuthTokens, createUser, ROLES, getHomePath }

const AuthContext = createContext(null)

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
        const cleanPhone = cleanPhoneForBackend(phoneInput) || (phoneInput || "").trim()
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

        if (!userObj || !userObj.id) {
          return {
            success: false,
            error: "Foydalanuvchi ma'lumotlari aniqlanmadi.",
          }
        }

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

  const isLoggingOutRef = useRef(false)

  // LOGOUT
  const logout = useCallback(async () => {
    // 1. Double-invocation guard (Multiple rapid logout clicks)
    if (isLoggingOutRef.current) {
      return
    }
    isLoggingOutRef.current = true

    // 2. Capture required tokens BEFORE clearing store
    const userToken = useUserStore.getState()?.userToken
    const refreshToken = userToken?.refreshToken

    try {
      // 3. Clear local authenticated state immediately so UI transitions cleanly
      useUserStore.getState()?.actions?.clearUserInfoAndToken()
      try {
        localStorage.removeItem("gidrogo-user-storage")
      } catch {}

      // 4. Remove authorization headers to prevent stale reuse
      delete api.defaults.headers.common["Authorization"]
      delete api.defaults.headers.common.Authorization

      // 5. Cancel active queries and clear React Query cache
      try {
        queryClient.cancelQueries()
        queryClient.clear()
      } catch (cacheError) {
        if (import.meta.env.DEV) {
          console.warn("React Query cache cleanup error during logout:", cacheError)
        }
      }

      // 6. Notify backend via POST /api/auth/logout with canonical payload
      if (refreshToken && typeof authService.logout === "function") {
        try {
          await authService.logout({ refreshToken })
        } catch (backendError) {
          if (import.meta.env.DEV) {
            console.warn("Backend logout notification failed:", backendError)
          }
        }
      }
    } finally {
      isLoggingOutRef.current = false
    }
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