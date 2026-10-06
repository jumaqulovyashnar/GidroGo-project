import { api, handleApiError } from "@/shared"

class FarmService {
  async getFarms() {
    try {
      const response = await api.get("/superadmin/farms")
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
}

export const farmService = new FarmService()
export default farmService;