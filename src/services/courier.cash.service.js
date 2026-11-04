import { api, handleApiError } from "@/shared";

class CourierCashService {
  async getCourierCash() {
    try {
      const response = await api.get("/courier/cash");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async submitHandover(data) {
    try {
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

  async getCourierHandovers(params = {}) {
    try {
      const response = await api.get("/courier/cash/handovers", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async cashCollected(orderId, data) {
    try {
      const payload = {
        amountCollected: Number(data.amountCollected),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      };
      const response = await api.post(`/courier/orders/${orderId}/cash-collected`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async cancelHandover(id) {
    try {
      const response = await api.delete(`/courier/cash/handovers/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const courierCashService = new CourierCashService();
export default courierCashService;
