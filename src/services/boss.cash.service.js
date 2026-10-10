import { api, handleApiError } from "@/shared";

class BossCashService {
  // GET /api/boss/cash/summary - Boss uchun kassa tushumi, topshirilgan va dastavkachilarda qolgan summa hisoboti
  async getCashSummary(params = {}) {
    try {
      const response = await api.get("/boss/cash/summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossCashService = new BossCashService();
export default bossCashService;
