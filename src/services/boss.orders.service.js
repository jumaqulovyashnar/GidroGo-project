import { api, handleApiError } from "@/shared";

class BossOrdersService {
  // 1. GET /api/boss/orders - Fermaning buyurtmalari ro'yxati (default: FAQAT BUGUNGI buyurtmalar)
  async getOrders(params = {}) {
    try {
      const response = await api.get("/boss/orders", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/boss/orders/today - Faqat bugungi buyurtmalar ro'yxati
  async getTodayOrders(params = {}) {
    try {
      const response = await api.get("/boss/orders/today", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. GET /api/boss/orders/all - Barcha buyurtmalar ro'yxati (tarixiy)
  async getAllOrders(params = {}) {
    try {
      const response = await api.get("/boss/orders/all", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossOrdersService = new BossOrdersService();
export default bossOrdersService;
