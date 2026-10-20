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

  // GET /api/boss/finance/chart - Moliyaviy ko'rsatkichlar dinamikasi grafigi (vaqt bo'yicha saralangan)
  async getFinanceChart(params = { period: "week" }) {
    try {
      const response = await api.get("/boss/finance/chart", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // GET /api/boss/finance/expenses - Boss uchun barcha kiritilgan xarajatlar ro'yxati (sana, kategoriya, summa, kim kiritgani)
  async getExpenses(params = {}) {
    try {
      const response = await api.get("/boss/finance/expenses", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // GET /api/boss/finance/transactions - Boss uchun barcha moliya tranzaksiyalari (sana oralig'i, to'lov turi, kuryer va sahifalash bilan)
  async getTransactions(params = {}) {
    try {
      const response = await api.get("/boss/finance/transactions", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // POST /api/manager/finance/expenses - Xarajat kiritish
  async createExpense(data) {
    try {
      const payload = {
        category: data.category,
        amount: Number(data.amount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      };
      const response = await api.post("/manager/finance/expenses", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossFinanceService = new BossFinanceService();
export default bossFinanceService;
