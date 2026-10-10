import { api, handleApiError } from "@/shared";

class ManagerCashService {
  // 1. GET /api/manager/couriers/cash-balances - Fermaning barcha dastavkachilari kassa balanslari va oxirgi topshirish sanalari
  async getCourierCashBalances() {
    try {
      const response = await api.get("/manager/couriers/cash-balances");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/manager/cash/handovers - Fermadagi kassa topshirishlar tarixi va holati
  async getCashHandovers(params = {}) {
    try {
      const response = await api.get("/manager/cash/handovers", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. POST /api/manager/couriers/{courierId}/cash/handovers - Menejer tomonidan to'g'ridan-to'g'ri topshirilgan naqd pulni kiritish
  // Swagger Schema: { amount: number, note?: string }
  async directHandover(courierId, data) {
    try {
      // Faqat Swagger talab qilgan fildlar (ortiqcha fild yuborilmaydi)
      const payload = {
        amount: Number(data.amount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      };
      const response = await api.post(`/manager/couriers/${courierId}/cash/handovers`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 4. POST /api/manager/cash/handovers/{id}/confirm - Menejer tomonidan topshirilgan naqd pulni tasdiqlash
  // Swagger Schema: { confirmedAmount: number, note?: string }
  async confirmHandover(id, data) {
    try {
      // Faqat Swagger talab qilgan fildlar (ortiqcha fild yuborilmaydi)
      const payload = {
        confirmedAmount: Number(data.confirmedAmount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      };
      const response = await api.post(`/manager/cash/handovers/${id}/confirm`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 5. POST /api/manager/cash/handovers/{id}/reject - Menejer tomonidan kassa topshirish so'rovini rad etish
  // Swagger Schema: { reason: string }
  async rejectHandover(id, data) {
    try {
      // Faqat Swagger talab qilgan fildlar (ortiqcha fild yuborilmaydi)
      const payload = {
        reason: String(data.reason || "").trim(),
      };
      const response = await api.post(`/manager/cash/handovers/${id}/reject`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerCashService = new ManagerCashService();
export default managerCashService;
