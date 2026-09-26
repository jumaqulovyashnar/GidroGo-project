import { api } from "@/shared/api"

export const authService = {
  login: async ({ phone, password }) => {
    try {
      const response = await api.post("/auth/login", {
        phone,
        password,
      })

      return response.data
    } catch {
      throw new Error("Telefon raqam yoki parol noto'g'ri!")
    }
  },

  logout: async (token) => {
    try {
      const response = await api.post("/auth/logout", { token })

      return response.data
    } catch {
      return { success: true }
    }
  },
}