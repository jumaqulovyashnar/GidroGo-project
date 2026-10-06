import { api, handleApiError } from "@/shared";

class UpdateFarmsStatus {
    async FarmsStatus(id) {
        try {
            const response = await api.patch(`/superadmin/farms/${id}/status`)
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }
    async updateFarmsBossStatus(id) {
        try {
            const response = await api.patch(`/superadmin/bosses/${id}/toggle-status`)
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }
}
export const updateFarmsStatus = new UpdateFarmsStatus()
export default UpdateFarmsStatus;