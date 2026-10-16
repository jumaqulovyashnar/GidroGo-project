import { api, handleApiError } from "@/shared"

class SuperAdminCrmService {
  // 1. GET /api/superadmin/clients - Mijozlar ro'yxati (qidiruv, holat, ferma, sahifalash)
  async getClients(params = {}) {
    try {
      const response = await api.get("/superadmin/clients", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 2. GET /api/superadmin/clients/summary - Mijozlar statistikasi (jami, yangi, faol, bloklangan, o'sish %)
  async getClientsSummary() {
    try {
      const response = await api.get("/superadmin/clients/summary")
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 3. GET /api/superadmin/clients/{id} - Mijoz profili (manzillar soni, buyurtmalar, idish balansi)
  async getClientById(id) {
    try {
      const response = await api.get(`/superadmin/clients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 4. PATCH /api/superadmin/clients/{id}/status - Mijozni bloklash/faollashtirish
  // OpenAPI Schema: ClientStatusUpdateRequest { status, reason? }
  async updateClientStatus(id, data) {
    try {
      const payload = typeof data === "string"
        ? { status: data }
        : { status: data?.status, ...(data?.reason ? { reason: data.reason } : {}) }
      const response = await api.patch(`/superadmin/clients/${id}/status`, payload)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 5. DELETE /api/superadmin/clients/{id} - Mijozni o'chirish (soft delete)
  async deleteClient(id) {
    try {
      const response = await api.delete(`/superadmin/clients/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 6. GET /api/superadmin/clients/{id}/payments - Mijoz to'lovlari (PAID / CASH_COLLECTED)
  async getClientPayments(id, params = {}) {
    try {
      const response = await api.get(`/superadmin/clients/${id}/payments`, { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 7. GET /api/superadmin/clients/{id}/orders - Mijoz buyurtmalari
  async getClientOrders(id, params = {}) {
    try {
      const response = await api.get(`/superadmin/clients/${id}/orders`, { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 8. GET /api/superadmin/orders - Buyurtmalar ro'yxati (filtrlar, from/to - createdAt, Asia/Tashkent)
  async getOrders(params = {}) {
    try {
      const response = await api.get("/superadmin/orders", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 9. GET /api/superadmin/orders/{id} - Buyurtma tafsiloti (status tarixi, kuryer, tara, vaqtlar)
  async getOrderById(id) {
    try {
      const response = await api.get(`/superadmin/orders/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const superAdminCrmService = new SuperAdminCrmService()
export default superAdminCrmService
