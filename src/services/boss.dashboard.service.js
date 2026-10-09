import { api, handleApiError } from "@/shared";

class BossDashboardService {
  // GET /api/boss/dashboard - Boss boshqaruv ko'rsatkichlari (tushum, xarajat, buyurtmalar, zaxira, kuryerlar)
  async getDashboard() {
    try {
      const response = await api.get("/boss/dashboard");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossDashboardService = new BossDashboardService();
export default bossDashboardService;
