import { api, handleApiError } from "@/shared"

class FarmService {
  async getFarms(params = {}) {
    try {
      const response = await api.get("/superadmin/farms", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    } 
  }

  async getFarmById(id) {
    try {
      const response = await api.get(`/superadmin/farms/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getFarmAnalytics(id, params = {}) {
    try {
      const response = await api.get(`/superadmin/farms/${id}/analytics`, { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async createFarm(data) {
    try {
      const response = await api.post("/superadmin/farms", data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async deleteFarm(id) {
    try {
      const response = await api.delete(`/superadmin/farms/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const farmService = new FarmService()
export default farmService