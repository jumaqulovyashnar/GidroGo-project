import { describe, it, expect, vi, beforeEach } from "vitest"
import { superAdminService } from "../superadmin.service"
import { api } from "@/shared"

describe("superAdminService - Audit Log API", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  describe("getAuditLogs", () => {
    it("fetches audit logs with query params from /superadmin/audit-logs", async () => {
      const mockData = {
        success: true,
        data: {
          content: [{ id: 1, action: "FARM_CREATED" }],
          totalElements: 1,
          totalPages: 1,
        },
      }

      vi.spyOn(api, "get").mockResolvedValueOnce({ data: mockData })

      const params = { page: 0, size: 10, period: "LAST_30_DAYS" }
      const result = await superAdminService.getAuditLogs(params)

      expect(api.get).toHaveBeenCalledWith("/superadmin/audit-logs", { params })
      expect(result).toEqual(mockData)
    })

    it("handles API error cleanly without duplicate retry calls", async () => {
      vi.spyOn(api, "get").mockRejectedValueOnce(new Error("Network Error"))

      await expect(superAdminService.getAuditLogs({ page: 0 })).rejects.toThrow()
      expect(api.get).toHaveBeenCalledTimes(1)
      expect(api.get).toHaveBeenCalledWith("/superadmin/audit-logs", { params: { page: 0 } })
    })
  })

  describe("getAuditLogStats", () => {
    it("fetches audit stats from /superadmin/audit-logs/stats", async () => {
      const mockStats = {
        success: true,
        data: { totalLogs: 59, farmActions: 6, userActions: 0 },
      }

      vi.spyOn(api, "get").mockResolvedValueOnce({ data: mockStats })

      const result = await superAdminService.getAuditLogStats({ period: "LAST_30_DAYS" })

      expect(api.get).toHaveBeenCalledWith("/superadmin/audit-logs/stats", {
        params: { period: "LAST_30_DAYS" },
      })
      expect(result).toEqual(mockStats)
    })
  })

  describe("getAuditLogFilters", () => {
    it("fetches filter options from /superadmin/audit-logs/filters", async () => {
      const mockFilters = {
        success: true,
        data: {
          actionTypes: [{ code: "FARM_CREATED", label: "Ferma yaratildi" }],
          objectTypes: [{ code: "FARM", label: "Ferma" }],
        },
      }

      vi.spyOn(api, "get").mockResolvedValueOnce({ data: mockFilters })

      const result = await superAdminService.getAuditLogFilters()

      expect(api.get).toHaveBeenCalledWith("/superadmin/audit-logs/filters")
      expect(result).toEqual(mockFilters)
    })
  })

  describe("exportAuditLogs", () => {
    it("calls export endpoint with responseType blob", async () => {
      const mockBlob = new Blob(["csv-content"], { type: "text/csv" })
      const mockResponse = { data: mockBlob, headers: {} }

      vi.spyOn(api, "get").mockResolvedValueOnce(mockResponse)

      const params = { period: "LAST_30_DAYS" }
      const result = await superAdminService.exportAuditLogs(params)

      expect(api.get).toHaveBeenCalledWith("/superadmin/audit-logs/export", {
        params,
        responseType: "blob",
      })
      expect(result.data).toBe(mockBlob)
    })
  })
})
