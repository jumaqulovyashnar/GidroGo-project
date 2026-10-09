import { api, handleApiError } from "@/shared";

class ManagerDashboardService {
  // GET /api/manager/dashboard - Manager operatsion boshqaruv ko'rsatkichlari (tushum, xarajat, buyurtmalar, zaxira, kuryerlar)
  async getDashboard() {
    try {
      const response = await api.get("/manager/dashboard");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}
export const managerDashboardService = new ManagerDashboardService();
export default managerDashboardService;
