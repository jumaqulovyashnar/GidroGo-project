import { api } from "@/shared/api"

export const userService = {
  getMe: async () => {
    const response = await api.get("/users/me")

    return response.data
  },

  getAdminById: async (userId) => {
    const response = await api.get(`/users/${userId}`)

    return response.data
  },
}