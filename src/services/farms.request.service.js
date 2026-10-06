import { api, handleApiError } from "@/shared";
class RequestService {
    async getActivationRequests() {
        try {
            const response = await api.get("/superadmin/activation-requests");
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    async decideActivation(id, payload) {
        try {
            const response = await api.post(
                `/superadmin/activation-requests/${id}/decision`,
                payload
            );

            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const requestService = new RequestService();

export default requestService;