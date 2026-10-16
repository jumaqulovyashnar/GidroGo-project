import { api, handleApiError } from "@/shared"

class AuthService {
  // 1. POST /api/auth/login - Yagona kirish API (barcha rollar uchun: SuperAdmin, Boss, Manager, Courier, Client)
  async login(payload) {
    try {
      const response = await api.post("/auth/login", payload)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 2. POST /api/auth/logout - Tizimdan chiqish (sessiyani yakunlash va FCM tokenini o'chirish)
  async logout(payload) {
    try {
      const body = typeof payload === "object" ? payload : payload ? { token: payload } : {}
      const response = await api.post("/auth/logout", body)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 3. POST /api/auth/refresh - Access tokenni yangilash (refresh token yordamida)
  async refreshToken(refreshToken) {
    try {
      const response = await api.post("/auth/refresh", {
        refreshToken,
      })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const authService = new AuthService()
export default authService
