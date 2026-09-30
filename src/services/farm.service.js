import { api, handleApiError } from "@/shared"

class FarmService {
  // 1. Barcha fermalarni olish
  async getFarms(params) {
    try {
      const response = await api.get("/superadmin/farms", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 2. Bitta fermani ID bo'yicha olish
  async getFarmById(id) {
    try {
      const response = await api.get(`/superadmin/farms/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 3. Yangi ferma qo'shish
  async createFarm(data) {
    try {
      const response = await api.post("/superadmin/farms", data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 4. Fermani tahrirlash (update)
  async updateFarm(id, data) {
    try {
      const response = await api.put(`/superadmin/farms/${id}`, data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 5. Fermani o'chirish (delete)
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
export default farmService;
