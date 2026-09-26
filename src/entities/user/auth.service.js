import { api } from "@/shared";

class AuthService {
  async login(payload) {
    const response = await api.post("auth/login", payload)
    return response.data;
  }

  async logout(token) {
    try {
      const response = await api.post("/auth/logout", { token })
      return response.data
    } catch {
      return { success: true }
    }
  }

  async logOut(payload) {
    return this.logout(payload)
  }

  async refreshToken(refreshToken) {
    const response = await api.post("/auth/refresh", { refreshToken })
    return response.data
  }
}

const authService = new AuthService()
export { authService }
export default authService;