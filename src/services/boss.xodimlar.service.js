import { api, handleApiError } from "@/shared";

class BossXodimlarService {
    async getXodim() {
        try {
            const response = await api.get('/boss/staff')
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error))
        }
    }
}
export const bossXodimlarService = new BossXodimlarService()
export default bossXodimlarService;