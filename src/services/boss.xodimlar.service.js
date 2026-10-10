import { api, handleApiError } from "@/shared";

class BossXodimlarService {
  // 1. GET /api/boss/staff - Fermaning barcha xodimlari ro'yxati
  async getXodim() {
    try {
      const response = await api.get("/boss/staff");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. POST /api/boss/staff - Yangi Manager yoki Dastavkachi yaratish
  async createXodim(payload) {
    try {
      const response = await api.post("/boss/staff", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. PATCH /api/boss/staff/{id}/status - Xodim holatini faol/bloklangan qilish
  async updateStaffStatus(id, status) {
    try {
      const response = await api.patch(`/boss/staff/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 4. GET /api/boss/staff/summary - Xodimlar va dastavkachilar monitoringi statistikasi (kartochkalar uchun)
  async getStaffSummary() {
    try {
      const response = await api.get("/boss/staff/summary");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 5. DELETE /api/boss/staff/{id} - Xodimni o'chirish (Kassa balansi 0 dan katta bo'lsa 409 CASH_BALANCE_NOT_ZERO)
  async deleteStaff(id) {
    try {
      const response = await api.delete(`/boss/staff/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossXodimlarService = new BossXodimlarService();
export default bossXodimlarService;