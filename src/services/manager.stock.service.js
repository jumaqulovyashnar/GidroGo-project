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
  async updateWarehouseStock(data) {
    try {
      const response = await api.put("/manager/stock/warehouse", data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerStockService = new ManagerStockService();
export default managerStockService;
