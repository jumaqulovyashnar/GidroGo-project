import { api } from "@/shared/api"
import { MOCK_USERS } from "@/mock"


export const authService = {
  login: async ({ phone, password }) => {
    const rawInput = (phone || "").trim().toLowerCase()
    const cleanDigits = (phone || "").replace(/\D/g, "")
    const normalizedDigits = cleanDigits.length === 9 ? "998" + cleanDigits : cleanDigits

    // Mock foydalanuvchilarni tekshirish
    const foundMockUser = MOCK_USERS.find((u) => {
      const mockDigits = u.phone.replace(/\D/g, "")
      const phoneMatches =
        mockDigits === normalizedDigits ||
        mockDigits === cleanDigits ||
        mockDigits.endsWith(cleanDigits) ||
        u.phone.toLowerCase() === rawInput ||
        u.username?.toLowerCase() === rawInput ||
        (rawInput.includes("admin") && u.role === "SUPER_ADMIN") ||
        (rawInput.includes("manager") && u.role === "MANAGER") ||
        (rawInput.includes("boss") && u.role === "BOSS")

      return phoneMatches && u.password === password
    })

    if (foundMockUser) {
      await new Promise((res) => setTimeout(res, 200))

      return {
        success: true,
        accessToken: foundMockUser.accessToken,
        refreshToken: foundMockUser.refreshToken,
        role: foundMockUser.role,
        roleName: foundMockUser.roleName,
        rawRole: foundMockUser.rawRole,
        roleLabel: foundMockUser.roleLabel,
        user: foundMockUser,
      }
    }

    // Backend API
    try {
      const response = await api.post("/auth/login", { phone, password })
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
