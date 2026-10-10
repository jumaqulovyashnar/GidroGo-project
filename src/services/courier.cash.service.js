import { api, handleApiError } from "@/shared";

class CourierCashService {
  // 1. GET /api/courier/cash - Kuryerning kassa balansi, bugun yig'ilgan summa va oxirgi tranzaksiyalar
  async getCourierCash() {
    try {
      const response = await api.get("/courier/cash");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. POST /api/courier/cash/handovers - Kuryer tomonidan kassani topshirish so'rovini yuborish
  // Swagger Schema: { declaredAmount: number, note?: string }
  async submitHandover(data) {
    try {
      // Faqat Swagger talab qilgan fildlar (ortiqcha fild yuborilmaydi)
      const payload = {
        declaredAmount: Number(data.declaredAmount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      };
      const response = await api.post("/courier/cash/handovers", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const courierCashService = new CourierCashService();
export default courierCashService;
