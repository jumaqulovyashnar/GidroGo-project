import { api, handleApiError } from "@/shared";

class ManagerProductsService {
  // 1. GET /api/manager/products - Fermaning barcha mahsulotlari
  async getProducts(params = {}) {
    try {
      const response = await api.get("/manager/products", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 2. POST /api/manager/products - Yangi mahsulot qo'shish va narx belgilash (faqat Manager)
  async createProduct(data) {
    try {
      const response = await api.post("/manager/products", data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. PUT /api/manager/products/{id} - Mahsulot narxi yoki parametrlarini o'zgartirish (faqat Manager)
  async updateProduct(id, data) {
    try {
      const response = await api.put(`/manager/products/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerProductsService = new ManagerProductsService();
export default managerProductsService;
