import { api, handleApiError } from "@/shared"

class FarmService {
  async getFarms(params = {}) {
    try {
      const response = await api.get("/superadmin/farms", { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    } 
  }

  async getFarmById(id) {
    try {
      const response = await api.get(`/superadmin/farms/${id}`)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  async getFarmAnalytics(id, params = {}) {
    try {
      const response = await api.get(`/superadmin/farms/${id}/analytics`, { params })
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 4. POST /api/superadmin/farms - Yangi ferma yaratish
  // OpenAPI Schema: FarmCreateRequest { name, phone, address, latitude, longitude, logoUrl?, city?, district?, bossFullName, bossPhone, bossPassword }
  async createFarm(data) {
    try {
      const payload = {
        name: data.name?.trim(),
        phone: data.phone?.trim(),
        address: data.address?.trim(),
        latitude: Number(data.latitude) || 0,
        longitude: Number(data.longitude) || 0,
        bossFullName: data.bossFullName?.trim(),
        bossPhone: data.bossPhone?.trim(),
        bossPassword: data.bossPassword,
        ...(data.logoUrl ? { logoUrl: data.logoUrl } : {}),
        ...(data.city ? { city: data.city.trim() } : {}),
        ...(data.district ? { district: data.district.trim() } : {}),
      };
      const response = await api.post("/superadmin/farms", payload)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 5. PATCH /api/superadmin/farms/{id}/status - Ferma holati: ACTIVE | BLOCKED | INACTIVE
  // OpenAPI Schema: { status: string, reason?: string }
  async updateFarmStatus(id, data) {
    try {
      const payload = typeof data === "string"
        ? { status: data }
        : { status: data?.status || "INACTIVE", ...(data?.reason ? { reason: data.reason } : {}) }
      const response = await api.patch(`/superadmin/farms/${id}/status`, payload)
      return response.data
    } catch (error) {
      throw new Error(handleApiError(error))
    }
  }

  // 6. Fermani o'chirish / arxivlash (Backendda DELETE /api/superadmin/farms/{id} o'rniga status INACTIVE qilinadi)
  async deleteFarm(id) {
    try {
      return await this.updateFarmStatus(id, { status: "INACTIVE", reason: "O'chirildi" })
    } catch (error) {
      try {
        const fallback = await api.delete(`/superadmin/farms/${id}`)
        return fallback.data
      } catch {
        throw new Error(handleApiError(error))
      }
    }
  }
}

export const farmService = new FarmService()
export default farmService