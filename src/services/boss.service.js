import { api, handleApiError } from "@/shared"

class BossService {
  async getBosses(params) {
    try {
      const response = await api.get("/superadmin/bosses", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async toggleBossStatus(id) {
    try {
      const response = await api.patch(`/superadmin/bosses/${id}/toggle-status`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async updateBoss(id, data) {
    try {
      const response = await api.put(`/superadmin/bosses/${id}`, data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async deleteBoss(id) {
    try {
      const response = await api.delete(`/superadmin/bosses/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const bossService = new BossService()
export default bossService;
