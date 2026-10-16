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

  // 3. PUT /api/manager/stock/vehicle - Mashina zaxirasini qo'lda o'zgartirish (band qilinganidan kamaytirish taqiqlangan)
  async updateVehicleStock(data) {
    try {
      const response = await api.put("/manager/stock/vehicle", data);
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
