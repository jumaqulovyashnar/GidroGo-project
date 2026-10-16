import { api, handleApiError } from "@/shared"

class AuthService {
  // 1. POST /api/auth/login - Yagona kirish API (barcha rollar uchun: SuperAdmin, Boss, Manager, Courier, Client)
  // OpenAPI Schema: LoginRequest { password, login?, phone? }
  async login(payload) {
    try {
      const cleanPayload = {
        password: payload.password,
        ...(payload.login ? { login: payload.login.trim() } : {}),
        ...(payload.phone ? { phone: payload.phone.trim() } : {}),
      };
      const response = await api.post("/auth/login", cleanPayload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. POST /api/auth/logout - Tizimdan chiqish (sessiyani yakunlash va FCM tokenini o'chirish)
  // OpenAPI Schema: LogoutRequest { refreshToken?, fcmToken? }
  async logout(payload) {
    try {
      const body =
        typeof payload === "object"
          ? {
              ...(payload?.refreshToken ? { refreshToken: payload.refreshToken } : {}),
              ...(payload?.fcmToken ? { fcmToken: payload.fcmToken } : {}),
            }
          : payload
          ? { refreshToken: payload }
          : {};
      const response = await api.post("/auth/logout", body);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
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
