import { api, handleApiError } from "@/shared";

class BossSalesService {
  // 1. GET /api/boss/sales/summary - Savdo va mahsulotlar realizatsiyasi (kunlik/haftalik/oylik dinamika va kartochkalar)
  async getSalesSummary(params = {}) {
    try {
      const response = await api.get("/boss/sales/summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/boss/sales/products-summary - Mahsulotlar toifalari bo'yicha sotuv tahlili
  async getProductsSummary() {
    try {
      const response = await api.get("/boss/sales/products-summary");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossSalesService = new BossSalesService();
export default bossSalesService;
