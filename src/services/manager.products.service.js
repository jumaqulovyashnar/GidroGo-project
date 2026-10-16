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
  // OpenAPI Schema: { name, price, volumeLiters?, depositPrice?, imageUrl?, description? }
  async createProduct(data) {
    try {
      const payload = {
        name: data.name?.trim(),
        price: Number(data.price),
        ...(data.volumeLiters !== undefined ? { volumeLiters: Number(data.volumeLiters) } : {}),
        ...(data.depositPrice !== undefined ? { depositPrice: Number(data.depositPrice) } : {}),
        ...(data.imageUrl ? { imageUrl: data.imageUrl } : {}),
        ...(data.description ? { description: data.description } : {}),
      };
      const response = await api.post("/manager/products", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. PUT /api/manager/products/{id} - Mahsulot narxi yoki parametrlarini o'zgartirish (faqat Manager)
  // OpenAPI Schema: { name?, price?, volumeLiters?, depositPrice?, imageUrl?, description?, active? }
  async updateProduct(id, data) {
    try {
      const payload = {
        ...(data.name ? { name: data.name.trim() } : {}),
        ...(data.price !== undefined ? { price: Number(data.price) } : {}),
        ...(data.volumeLiters !== undefined ? { volumeLiters: Number(data.volumeLiters) } : {}),
        ...(data.depositPrice !== undefined ? { depositPrice: Number(data.depositPrice) } : {}),
        ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.active !== undefined ? { active: Boolean(data.active) } : {}),
      };
      const response = await api.put(`/manager/products/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const managerProductsService = new ManagerProductsService();
export default managerProductsService;
