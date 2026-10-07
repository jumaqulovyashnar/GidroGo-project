import { api, handleApiError } from "@/shared"
import { bossService } from "./boss.service"

class UpdateFarmsStatus {
    async farmsStatus(id, data) {
        try {
            const response = await api.patch(`/superadmin/farms/${id}/status`, data)
            return response.data
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }

    // Backward compatibility alias
    async FarmsStatus(id, data) {
        return this.farmsStatus(id, data)
    }

    // Delegate to bossService single source of truth
    async updateFarmsBossStatus(id) {
        return bossService.toggleBossStatus(id)
    }

    // Delegate to bossService single source of truth
    async getBosses(params) {
        return bossService.getBosses(params)
    }
}

export const updateFarmsStatus = new UpdateFarmsStatus()
export default UpdateFarmsStatus