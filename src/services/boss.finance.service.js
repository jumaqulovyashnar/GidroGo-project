import { api, handleApiError } from "@/shared";

class BossFinanceService {
  // GET /api/boss/finance/summary - Ferma moliyaviy ko'rsatkichlari (tushum, xarajat, sof foyda)
  async getFinanceSummary(params = { period: "month" }) {
    try {
      const response = await api.get("/boss/finance/summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossFinanceService = new BossFinanceService();
export default bossFinanceService;
