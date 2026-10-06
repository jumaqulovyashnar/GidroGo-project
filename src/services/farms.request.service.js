import { api, handleApiError } from "@/shared";

class RequestService {
    // 1. Kutilayotgan Boss tasdiqlash so'rovlari ro'yxatini olish (GET)
    async getActivationRequests() {
        try {
            const response = await api.get("/superadmin/activation-requests");
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // 2. Boss so'rovini tasdiqlash (APPROVED) yoki rad etish (REJECTED) (POST)
    async decideActivation(id, payload) {
        try {
            // payload: { status: "APPROVED" | "REJECTED", rejectReason?: string }
            const response = await api.post(`/superadmin/activation-requests/${id}/decision`, payload);
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }

    // Qisqa nom bilan ham chaqirish imkoniyati
    async requests(id, payload = { status: "APPROVED" }) {
        return this.decideActivation(id, payload);
    }
}

export const requestService = new RequestService();
export default requestService;