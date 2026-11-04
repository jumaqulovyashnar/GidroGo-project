import { api, handleApiError } from "@/shared";

class BossCashService {
  async getCashSummary(params = {}) {
    try {
      const response = await api.get("/boss/cash/summary", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getBossHandovers(params = {}) {
    try {
      const response = await api.get("/boss/cash/handovers", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async confirmHandover(id, data) {
    try {
      const payload = {
        confirmedAmount: Number(data.confirmedAmount),
        ...(data.note?.trim() ? { note: data.note.trim() } : {}),
      };
      const response = await api.post(`/boss/cash/handovers/${id}/confirm`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async rejectHandover(id, data) {
    try {
      const payload = {
        reason: data.reason?.trim() || "",
      };
      const response = await api.post(`/boss/cash/handovers/${id}/reject`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossCashService = new BossCashService();
export default bossCashService;
