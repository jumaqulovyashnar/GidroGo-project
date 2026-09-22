import { api } from "@/shared/api"
import { MOCK_USERS } from "@/mock"
import useUserStore from "./userStore"

export const userService = {
  getMe: async () => {
    const currentToken = useUserStore.getState().userToken?.accessToken

    // Mock token bo'lsa, mos mock userni qaytaramiz
    const foundMockUser = MOCK_USERS.find((u) => u.accessToken === currentToken)
    if (foundMockUser) {
      return { data: foundMockUser }
    }

    const response = await api.get("/users/me")
    return response.data
  },

  getAdminById: async (userId) => {
    const foundMockUser = MOCK_USERS.find((u) => u.id === userId)
    if (foundMockUser) {
      return { data: foundMockUser }
    }

    const response = await api.get(`/users/${userId}`)
    return response.data
  },
}
