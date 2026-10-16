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

    // POST /api/superadmin/activation-requests/{id}/decision
    // OpenAPI Schema: ActivationDecisionRequest { status, rejectReason? }
    async decideActivation(id, payload) {
        try {
            const body = {
                status: payload?.status,
                ...(payload?.rejectReason ? { rejectReason: payload.rejectReason.trim() } : {})
            };
            const response = await api.post(
                `/superadmin/activation-requests/${id}/decision`,
                body
            );

            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
}

export const requestService = new RequestService();

export default requestService;