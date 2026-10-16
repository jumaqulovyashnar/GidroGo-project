import { api, handleApiError } from "@/shared";

class ManagerStockService {
  // 1. GET /api/manager/stock/warehouse - Fermaning ombordagi zaxirasi
  async getWarehouseStock() {
    try {
      const response = await api.get("/manager/stock/warehouse");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. PUT /api/manager/stock/warehouse - Ombordagi zaxirani yangilash
  // OpenAPI Schema: { productId: number, quantity: number }
  async updateWarehouseStock(data) {
    try {
      const payload = {
        productId: Number(data.productId),
        quantity: Number(data.quantity),
      };
      const response = await api.put("/manager/stock/warehouse", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. PUT /api/manager/stock/vehicle - Mashina zaxirasini qo'lda o'zgartirish
  // OpenAPI Parameter: courierId (query), productId (query), quantity (query)
  async updateVehicleStock(params = {}) {
    try {
      const response = await api.put("/manager/stock/vehicle", null, {
        params: {
          courierId: Number(params.courierId),
          productId: Number(params.productId),
          quantity: Number(params.quantity),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 4. GET /api/manager/stock/vehicle/{courierId} - Kuryer mashinasidagi zaxira
  async getCourierVehicleStock(courierId) {
    try {
      const response = await api.get(`/manager/stock/vehicle/${courierId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerStockService = new ManagerStockService();
export default managerStockService;
