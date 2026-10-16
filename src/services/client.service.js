import { api, handleApiError } from "@/shared"

class ClientService {
  // 1. GET /api/client/banners - Faol promo aksiyalar va slayder bannerlarini olish (Ochiq API)
  async getBanners() {
    try {
      const response = await api.get("/client/banners")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 2. POST /api/client/cart/quote - Savatdagi mahsulotlar va tara to'lovini hisoblash (order yaratmasdan)
  // OpenAPI Schema: CartCheckoutRequest { addressId, items: [{ productId, quantity }], paymentMethod, clientComment?, deliverySlot?, emptyBottlesReturned? }
  async calculateCartQuote(data) {
    try {
      const payload = {
        addressId: Number(data.addressId),
        paymentMethod: data.paymentMethod,
        items: Array.isArray(data.items)
          ? data.items.map((item) => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
            }))
          : [],
        ...(data.clientComment ? { clientComment: data.clientComment.trim() } : {}),
        ...(data.deliverySlot ? { deliverySlot: data.deliverySlot } : {}),
        ...(data.emptyBottlesReturned !== undefined
          ? { emptyBottlesReturned: Number(data.emptyBottlesReturned) }
          : {}),
      };
      const response = await api.post("/client/cart/quote", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // 3. GET /api/client/bottles - Mijozning fermalar bo'yicha idish balanslari ro'yxati
  async getBottles() {
    try {
      const response = await api.get("/client/bottles")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const clientService = new ClientService()
export default clientService
