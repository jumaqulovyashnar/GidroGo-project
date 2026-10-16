import { api, handleApiError } from "@/shared";

class ManagerFinanceService {
  // 1. GET /api/manager/finance/summary - Fermaning moliyaviy hisoboti (tushum, xarajat, sof foyda)
  async getSummary(params = {}) {
    try {
      const response = await api.get("/manager/finance/summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/manager/finance/transactions - Fermaning barcha moliya tranzaksiyalari
  async getTransactions(params = {}) {
    try {
      const response = await api.get("/manager/finance/transactions", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. POST /api/manager/finance/expenses - Xarajat kiritish (yoqilg'i, oylik, ta'mirlash va h.k.)
  // OpenAPI Schema: { category: string, amount: number, note?: string, courierId?: number }
  async createExpense(data) {
    try {
      const payload = {
        category: data.category,
        amount: Number(data.amount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
        ...(data.courierId !== undefined ? { courierId: Number(data.courierId) } : {}),
      };
      const response = await api.post("/manager/finance/expenses", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerFinanceService = new ManagerFinanceService();
export default managerFinanceService;
