import { api, handleApiError } from "@/shared";

class BossXodimlarService {
  async getXodim() {
    try {
      const response = await api.get("/boss/staff");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createXodim(payload) {
    try {
      const cleanPayload = {
        fullName: payload.fullName?.trim(),
        phone: payload.phone?.trim(),
        password: payload.password?.trim(),
        role: payload.role,
        ...(payload.shiftType ? { shiftType: payload.shiftType } : {}),
        ...(payload.vehicleModel?.trim() ? { vehicleModel: payload.vehicleModel.trim() } : {}),
        ...(payload.vehiclePlateNumber?.trim() ? { vehiclePlateNumber: payload.vehiclePlateNumber.trim() } : {}),
        ...(payload.maxCapacity !== undefined && payload.maxCapacity !== ""
          ? { maxCapacity: Number(payload.maxCapacity) }
          : {}),
      };
      const response = await api.post("/boss/staff", cleanPayload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateStaffStatus(id, status) {
    try {
      const payload = typeof status === "object" ? { status: status.status } : { status };
      const response = await api.patch(`/boss/staff/${id}/status`, payload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getStaffSummary() {
    try {
      const response = await api.get("/boss/staff/summary");
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async deleteStaff(id) {
    try {
      const response = await api.delete(`/boss/staff/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getStaffById(id) {
    try {
      const response = await api.get(`/boss/staff/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateStaffVehicle(id, payload) {
    try {
      const cleanPayload = {
        ...(payload.vehicleModel?.trim() ? { vehicleModel: payload.vehicleModel.trim() } : {}),
        ...(payload.vehiclePlateNumber?.trim() ? { vehiclePlateNumber: payload.vehiclePlateNumber.trim() } : {}),
        ...(payload.maxCapacity !== undefined && payload.maxCapacity !== ""
          ? { maxCapacity: Number(payload.maxCapacity) }
          : {}),
      };
      const response = await api.put(`/boss/staff/${id}/vehicle`, cleanPayload);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export const bossXodimlarService = new BossXodimlarService();
export default bossXodimlarService;
