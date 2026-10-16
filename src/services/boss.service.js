import { api, handleApiError } from "@/shared"

class BossService {
  async getBosses(params) {
    try {
      const response = await api.get("/superadmin/bosses", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async toggleBossStatus(id) {
    try {
      const response = await api.patch(`/superadmin/bosses/${id}/toggle-status`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 3. PUT /api/superadmin/bosses/{id} - Ferma egasi ma'lumotlarini yangilash
  // OpenAPI Schema: BossUpdateRequest { fullName?, phone?, password?, farmId?, status?, avatarUrl? }
  async updateBoss(id, data) {
    try {
      const payload = {
        ...(data.fullName ? { fullName: data.fullName.trim() } : {}),
        ...(data.phone ? { phone: data.phone.trim() } : {}),
        ...(data.password ? { password: data.password.trim() } : {}),
        ...(data.farmId !== undefined ? { farmId: Number(data.farmId) || data.farmId } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(data.avatarUrl ? { avatarUrl: data.avatarUrl } : {}),
      }
      const response = await api.put(`/superadmin/bosses/${id}`, payload)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async deleteBoss(id) {
    try {
      const response = await api.delete(`/superadmin/bosses/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }
}

export const bossService = new BossService()
export default bossService;
