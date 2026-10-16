import { api, handleApiError } from "@/shared";

class ManagerRegionsService {
  // 1. GET /api/manager/regions - Fermaning xizmat hududlari ro'yxati
  async getRegions(params = {}) {
    try {
      const response = await api.get("/manager/regions", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. POST /api/manager/regions - Yangi xizmat hududi (poligon) qo'shish
  // OpenAPI Schema: { regionName: string, polygonJson: string }
  async createRegion(data) {
    try {
      const payload = {
        regionName: (data.regionName || data.name || "").trim(),
        polygonJson: typeof data.polygonJson === "string" ? data.polygonJson : JSON.stringify(data.polygonJson || data.coordinates || []),
      };
      const response = await api.post("/manager/regions", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. PATCH /api/manager/regions/{id}/toggle - Xizmat hududini yoqish/o'chirish (faol yoki nofaol qilish)
  async toggleRegion(id) {
    try {
      const response = await api.patch(`/manager/regions/${id}/toggle`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerRegionsService = new ManagerRegionsService();
export default managerRegionsService;
