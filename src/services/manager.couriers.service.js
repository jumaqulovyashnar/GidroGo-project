import { api, handleApiError } from "@/shared";

class ManagerCouriersService {
  // 1. GET /api/manager/couriers - Fermaning barcha dastavkachilari ro'yxati
  async getCouriers() {
    try {
      const response = await api.get("/manager/couriers");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/manager/couriers/live-tracking - Kuryerlarning onlayn GPS lokatsiyasi va joriy holati
  async getLiveTracking(params = {}) {
    try {
      const response = await api.get("/manager/couriers/live-tracking", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. GET /api/manager/couriers/daily-summary - Kuryerlarning kunlik suv statistikasi (yuklangan, sotilgan, qolgan balonlar, naqd/online tushum)
  async getDailySummary(params = {}) {
    try {
      const response = await api.get("/manager/couriers/daily-summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerCouriersService = new ManagerCouriersService();
export default managerCouriersService;
