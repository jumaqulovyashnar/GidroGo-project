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
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getAuditLogs() {
    try {
      const response = await api.get("/superadmin/audit-log")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const superAdminService = new SuperAdminService()
export default superAdminService
