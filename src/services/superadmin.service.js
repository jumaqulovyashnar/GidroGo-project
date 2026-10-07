import { api, handleApiError } from "@/shared"

class SuperAdminService {
  async getDashboard() {
    try {
      const response = await api.get("/superadmin/dashboard")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getRegionalStatistics() {
    try {
      const response = await api.get("/superadmin/statistics/regions")
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getAuditLogs(params) {
    try {
      const response = await api.get("/superadmin/audit-log", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getProfile() {
    try {
      const response = await api.get("/superadmin/settings/profile")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async updateProfile(data) {
    try {
      const response = await api.put("/superadmin/settings/profile", data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async changePassword(data) {
    try {
      const response = await api.post("/superadmin/settings/change-password", data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getDailyDynamics(params) {
    try {
      const response = await api.get("/superadmin/orders/daily-dynamics", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const superAdminService = new SuperAdminService()
export default superAdminService

