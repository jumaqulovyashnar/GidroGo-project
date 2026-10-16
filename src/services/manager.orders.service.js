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
  // OpenAPI Schema: { newCourierId: number }
  async reassignOrder(id, data) {
    try {
      const newCourierId = Number(data?.newCourierId ?? data?.courierId ?? data);
      const response = await api.post(`/manager/orders/${id}/reassign`, { newCourierId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 5. GET /api/manager/orders/{id} - Bitta buyurtmaning to'liq ma'lumotlari (Detail API)
  async getOrderById(id) {
    try {
      const response = await api.get(`/manager/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 6. POST /api/manager/orders - Menejer tomonidan yangi buyurtma kiritish (Manual Order Create)
  // OpenAPI Schema: { customerName, phone, address, latitude?, longitude?, bottlesCount?, productId?, paymentMethod?, notes?, courierId? }
  async createOrder(data) {
    try {
      const payload = {
        customerName: data.customerName?.trim(),
        phone: data.phone?.trim(),
        address: data.address?.trim(),
        ...(data.latitude !== undefined ? { latitude: Number(data.latitude) } : {}),
        ...(data.longitude !== undefined ? { longitude: Number(data.longitude) } : {}),
        ...(data.bottlesCount !== undefined ? { bottlesCount: Number(data.bottlesCount) } : {}),
        ...(data.productId !== undefined ? { productId: Number(data.productId) } : {}),
        ...(data.paymentMethod ? { paymentMethod: data.paymentMethod } : {}),
        ...(data.notes ? { notes: data.notes.trim() } : {}),
        ...(data.courierId !== undefined ? { courierId: Number(data.courierId) } : {}),
      };
      const response = await api.post("/manager/orders", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 7. POST /api/manager/orders/{id}/retry-dispatch - PREPARING buyurtmani darhol qayta taqsimlash navbatiga qo'yish
  async retryDispatchOrder(id) {
    try {
      const response = await api.post(`/manager/orders/${id}/retry-dispatch`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 8. POST /api/manager/orders/{id}/assign - Buyurtmaga kuryer biriktirish (Assign Order API)
  // OpenAPI Schema: { courierId: number }
  async assignOrder(id, data) {
    try {
      const courierId = Number(data?.courierId ?? data);
      const response = await api.post(`/manager/orders/${id}/assign`, { courierId });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 9. PATCH /api/manager/orders/{id}/status - Buyurtma holatini o'zgartirish
  // OpenAPI Schema: { status: string }
  async updateOrderStatus(id, data) {
    try {
      const status = typeof data === "string" ? data : data?.status;
      const response = await api.patch(`/manager/orders/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerOrdersService = new ManagerOrdersService();
export default managerOrdersService;
