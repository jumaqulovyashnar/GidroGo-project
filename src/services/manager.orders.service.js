import { api, handleApiError } from "@/shared";

class ManagerOrdersService {
  // 1. GET /api/manager/orders - Fermaning buyurtmalari ro'yxati (default: FAQAT BUGUNGI buyurtmalar)
  async getOrders(params = {}) {
    try {
      const response = await api.get("/manager/orders", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. GET /api/manager/orders/today - Faqat bugungi buyurtmalar ro'yxati
  async getTodayOrders(params = {}) {
    try {
      const response = await api.get("/manager/orders/today", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. GET /api/manager/orders/all - Barcha buyurtmalar ro'yxati (tarixiy)
  async getAllOrders(params = {}) {
    try {
      const response = await api.get("/manager/orders/all", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 4. POST /api/manager/orders/{id}/reassign - Buyurtmani boshqa dastavkachiga qayta biriktirish
  async reassignOrder(id, data) {
    try {
      const response = await api.post(`/manager/orders/${id}/reassign`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerOrdersService = new ManagerOrdersService();
export default managerOrdersService;
