import { api, handleApiError } from "@/shared";

class BossCouriersService {
  // 1. GET /api/boss/couriers/live-tracking - Kuryerlarning onlayn GPS lokatsiyasi va joriy holati
  async getLiveTracking() {
    try {
      const response = await api.get("/boss/couriers/live-tracking");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/boss/couriers/daily-summary - Kuryerlarning kunlik suv statistikasi (yuklangan, sotilgan, qolgan balonlar, tushum)
  async getDailySummary(params = {}) {
    try {
      const response = await api.get("/boss/couriers/daily-summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossCouriersService = new BossCouriersService();
export default bossCouriersService;
