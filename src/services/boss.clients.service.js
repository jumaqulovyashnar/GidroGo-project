import { api, handleApiError } from "@/shared";

class BossClientsService {
  async getClients(params = {}) {
    try {
      const response = await api.get("/boss/clients", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
  async getClientById(id) {
    try {
      const response = await api.get(`/boss/clients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossClientsService = new BossClientsService();
export default bossClientsService;
