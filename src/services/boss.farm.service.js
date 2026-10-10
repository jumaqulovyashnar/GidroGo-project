import { api, handleApiError } from "@/shared";

class BossFarmService {
  // GET /api/boss/farm - Ferma texnik pasporti va laboratoriya tahlillari
  async getFarmPassport() {
    try {
      const response = await api.get("/boss/farm");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossFarmService = new BossFarmService();
export default bossFarmService;
