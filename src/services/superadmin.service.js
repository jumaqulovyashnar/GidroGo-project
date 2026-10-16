import { api, handleApiError } from "@/shared"

class SuperAdminService {
  // 1. GET /api/superadmin/dashboard - Global operatsion KPI
  async getDashboard() {
    try {
      const response = await api.get("/superadmin/dashboard")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 2. GET /api/superadmin/statistics/regions - Hududlar bo'yicha statistika
  async getRegionalStatistics() {
    try {
      const response = await api.get("/superadmin/statistics/regions")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 3. GET /api/superadmin/statistics/orders-by-status - Holatlar bo'yicha buyurtmalar soni
  async getOrdersByStatusStatistics(params = {}) {
    try {
      const response = await api.get("/superadmin/statistics/orders-by-status", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 4. GET /api/superadmin/statistics/growth - O'sish seriyasi: yangi mijozlar, faol mijozlar, buyurtmalar, yangi fermalar
  async getGrowthStatistics(params = {}) {
    try {
      const response = await api.get("/superadmin/statistics/growth", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 5. GET /api/superadmin/orders/daily-dynamics - Kunma-kun dinamika (completed_at va farmId bilan)
  async getDailyDynamics(params = {}) {
    try {
      const response = await api.get("/superadmin/orders/daily-dynamics", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 6. GET /api/superadmin/farms/{id}/analytics - Ferma analitikasi (tushum, tara, xarajat, foyda va h.k.)
  async getFarmAnalytics(id, params = {}) {
    try {
      const response = await api.get(`/superadmin/farms/${id}/analytics`, { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 7. GET /api/superadmin/audit-log - Audit Log
  async getAuditLogs(params = {}) {
    try {
      const response = await api.get("/superadmin/audit-log", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 8. GET /api/superadmin/profile - SuperAdmin profili
  async getProfile() {
    try {
      const response = await api.get("/superadmin/profile")
      return response.data
    } catch (error) {
      try {
        const fallback = await api.get("/superadmin/settings/profile")
        return fallback.data
      } catch {
        throw new Error(handleApiError(error))
      }
    }
  }

  // 9. PUT /api/superadmin/profile - SuperAdmin profilini yangilash
  // OpenAPI Schema: SuperAdminProfileUpdateRequest { firstName?, lastName?, fullName?, phone?, email?, avatarUrl? }
  async updateProfile(data) {
    const payload = {
      ...(data.firstName ? { firstName: data.firstName.trim() } : {}),
      ...(data.lastName ? { lastName: data.lastName.trim() } : {}),
      ...(data.fullName ? { fullName: data.fullName.trim() } : {}),
      ...(data.phone ? { phone: data.phone.trim() } : {}),
      ...(data.email ? { email: data.email.trim() } : {}),
      ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
    }
    try {
      const response = await api.put("/superadmin/profile", payload)
      return response.data
    } catch (error) {
      try {
        const fallback = await api.put("/superadmin/settings/profile", payload)
        return fallback.data
      } catch {
        throw new Error(handleApiError(error))
      }
    }
  }

  // 10. POST /api/superadmin/change-password - Parolni almashtirish
  // OpenAPI Schema: ChangePasswordRequest { currentPassword, newPassword, confirmPassword }
  async changePassword(data) {
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }
    try {
      const response = await api.post("/superadmin/change-password", payload)
      return response.data
    } catch (error) {
      try {
        const fallback = await api.post("/superadmin/settings/change-password", payload)
        return fallback.data
      } catch {
        throw new Error(handleApiError(error))
      }
    }
  }
}

export const superAdminService = new SuperAdminService()
export default superAdminService
