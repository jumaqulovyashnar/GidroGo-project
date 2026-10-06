import { api, handleApiError } from "@/shared";

class UpdateFarmsStatus {
    async FarmsStatus(id, data) {
        try {
            const response = await api.patch(`/superadmin/farms/${id}/status`, data)
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }

    async farmsStatus(id, data) {
        return this.FarmsStatus(id, data);
    }

    async updateFarmsBossStatus(id) {
        try {
            const response = await api.patch(`/superadmin/bosses/${id}/toggle-status`)
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }

    async getBosses(params) {
        try {
            const response = await api.get("/superadmin/bosses", { params })
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }
}

export const updateFarmsStatus = new UpdateFarmsStatus()
export default UpdateFarmsStatus;