import { api, handleApiError } from "@/shared";

class ManagerClientsService {
  // 1. GET /api/manager/clients - Fermaning CRM mijozlar bazasi
  async getClients(params = {}) {
    try {
      const response = await api.get("/manager/clients", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/manager/clients/{id} - Tanlangan mijozning to'liq CRM tafsilotlari
  async getClientById(id) {
    try {
      const response = await api.get(`/manager/clients/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. GET /api/manager/clients/{id}/orders - Tanlangan mijozning barcha buyurtmalari
  async getClientOrders(id, params = {}) {
    try {
      const response = await api.get(`/manager/clients/${id}/orders`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 4. POST /api/manager/clients/{clientId}/bottles/adjust - Menejer tomonidan mijoz idish balansini qo'lda tuzatish (eski idishlar)
  async adjustBottleBalance(clientId, data) {
    try {
      const response = await api.post(`/manager/clients/${clientId}/bottles/adjust`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}
export const managerClientsService = new ManagerClientsService();
export default managerClientsService;
