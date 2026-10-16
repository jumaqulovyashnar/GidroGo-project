import { api, handleApiError } from "@/shared"

class ClientService {
  // 1. GET /api/client/banners - Faol promo aksiyalar va slayder bannerlarini olish (Ochiq API)
  async getBanners() {
    try {
      const response = await api.get("/client/banners")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 2. POST /api/client/cart/quote - Savatdagi mahsulotlar va tara to'lovini hisoblash (order yaratmasdan)
  async calculateCartQuote(data) {
    try {
      const response = await api.post("/client/cart/quote", data)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 3. GET /api/client/bottles - Mijozning fermalar bo'yicha idish balanslari ro'yxati
  async getBottles() {
    try {
      const response = await api.get("/client/bottles")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const clientService = new ClientService()
export default clientService
