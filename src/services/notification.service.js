import { api, handleApiError } from "@/shared";

class NotificationService {
  getRolePrefix(role) {
    if (!role) return "manager";
    const r = String(role).toUpperCase();
    if (r.includes("BOSS") || r.includes("RAHBAR")) return "boss";
    if (r.includes("COURIER") || r.includes("DASTAVKACHI")) return "courier";
    if (r.includes("CLIENT") || r.includes("MIJOZ")) return "client";
    return "manager";
  }

  async getNotifications(role, params = {}) {
    const prefix = this.getRolePrefix(role);
    try {
      const response = await api.get(`/${prefix}/notifications`, { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getUnreadCount(role) {
    const prefix = this.getRolePrefix(role);
    try {
      const response = await api.get(`/${prefix}/notifications/unread-count`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async markAsRead(role, id) {
    const prefix = this.getRolePrefix(role);
    try {
      const response = await api.patch(`/${prefix}/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async markAllAsRead(role) {
    const prefix = this.getRolePrefix(role);
    try {
      const response = await api.post(`/${prefix}/notifications/read-all`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService;
