import { api, handleApiError } from "@/shared";

class BossAnalyticsService {
  // GET /api/boss/analytics/growth - Davriy biznes o'sishi va analitika (oylar va choraklar dinamikasi)
  async getBusinessGrowth(params = { period: "quarter" }) {
    try {
      const response = await api.get("/boss/analytics/growth", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossAnalyticsService = new BossAnalyticsService();
export default bossAnalyticsService;
