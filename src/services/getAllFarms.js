import { api } from "@/shared"
class FarmService {
  async getFarms() {
    const response = await api.get("/superadmin/farms")
    return response.data;
  }
}
const farmService = new FarmService()
export { farmService };