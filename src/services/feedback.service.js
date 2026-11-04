import { api, handleApiError } from "@/shared";

class FeedbackService {
  // Manager feedback endpoints
  async getFarmFeedback(params = {}) {
    try {
      const response = await api.get("/manager/feedback", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getFeedbackSummary() {
    try {
      const response = await api.get("/manager/feedback/summary");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getFeedbackById(id) {
    try {
      const response = await api.get(`/manager/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateFeedback(id, data) {
    try {
      const payload = {
        status: data.status,
        ...(data.managerNote?.trim() ? { managerNote: data.managerNote.trim() } : {}),
      };
      const response = await api.patch(`/manager/feedback/${id}`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Client feedback endpoints
  async getClientFeedback(params = {}) {
    try {
      const response = await api.get("/client/feedback", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createClientFeedback(data) {
    try {
      const payload = {
        message: data.message?.trim(),
        ...(data.category ? { category: data.category } : {}),
        ...(data.orderId ? { orderId: Number(data.orderId) } : {}),
      };
      const response = await api.post("/client/feedback", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  // Courier feedback endpoints
  async getCourierFeedback(params = {}) {
    try {
      const response = await api.get("/courier/feedback", { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createCourierFeedback(data) {
    try {
      const payload = {
        message: data.message?.trim(),
        ...(data.category ? { category: data.category } : {}),
        ...(data.orderId ? { orderId: Number(data.orderId) } : {}),
      };
      const response = await api.post("/courier/feedback", payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const feedbackService = new FeedbackService();
export default feedbackService;
