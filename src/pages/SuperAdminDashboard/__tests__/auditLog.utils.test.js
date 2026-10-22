import { describe, it, expect } from "vitest"
import {
  formatAuditMetadata,
  mapAuditLogItem,
  calculateAuditStats,
  resolveTotalPages,
  buildPeriodOptions,
  buildActionOptions,
  buildObjectOptions,
  buildAdminOptions,
  formatDisplayPhone,
  cleanAdminName,
  extractBossName,
  extractAuditPhone,
  extractAuditDetails,
} from "../auditLog.utils"

describe("auditLog.utils", () => {
  describe("buildPeriodOptions", () => {
    it("transforms backend periods into dropdown options", () => {
      const backendPeriods = [
        { code: "LAST_30_DAYS", label: "So'nggi 30 kun" },
        { code: "TODAY", label: "Bugun" },
      ]
      const options = buildPeriodOptions(backendPeriods)

      expect(options).toEqual([
        { value: "LAST_30_DAYS", label: "So'nggi 30 kun" },
        { value: "TODAY", label: "Bugun" },
      ])
    })

    it("returns empty array when periods is null or not an array", () => {
      expect(buildPeriodOptions(null)).toEqual([])
      expect(buildPeriodOptions(undefined)).toEqual([])
      expect(buildPeriodOptions([])).toEqual([])
    })
  })

  describe("buildActionOptions", () => {
    it("builds actions with base option and dynamic backend actions", () => {
      const backendActions = [
        { code: "FARM_STATUS_UPDATE", label: "Ferma statusi yangilandi" },
      ]
      const options = buildActionOptions(backendActions)

      expect(options).toEqual([
        { value: "all", label: "Amal turi: Barchasi" },
        { value: "FARM_STATUS_UPDATE", label: "Ferma statusi yangilandi" },
      ])
    })

    it("returns only base option when backend actions empty", () => {
      expect(buildActionOptions([])).toEqual([
        { value: "all", label: "Amal turi: Barchasi" },
      ])
    })

    it("does not duplicate 'all' if backend already provided it", () => {
      const backendActions = [
        { code: "ALL", label: "Barchasi" },
        { code: "CREATE", label: "Yaratish" },
      ]
      const options = buildActionOptions(backendActions)
      expect(options.length).toBe(2)
      expect(options[0].value).toBe("ALL")
    })
  })

  describe("buildObjectOptions", () => {
    it("builds objects with base option and backend objectTypes", () => {
      const backendObjects = [
        { code: "FARM", label: "Ferma" },
        { code: "BOSS", label: "Boss" },
      ]
      const options = buildObjectOptions(backendObjects)

      expect(options).toEqual([
        { value: "all", label: "Obyekt: Barchasi" },
        { value: "FARM", label: "Ferma" },
        { value: "BOSS", label: "Boss" },
      ])
    })
  })

  describe("buildAdminOptions", () => {
    it("builds superAdmin options with full names and roles", () => {
      const backendAdmins = [
        { id: 1, fullName: "Yashnarbek Jumaqulov", role: "ROOT" },
        { id: 2, fullName: "Ali Valiyev" },
      ]
      const options = buildAdminOptions(backendAdmins)

      expect(options).toEqual([
        { value: "all", label: "SuperAdmin: Barchasi" },
        { value: "1", label: "Yashnarbek Jumaqulov (ROOT)" },
        { value: "2", label: "Ali Valiyev" },
      ])
    })
  })

  describe("formatAuditMetadata", () => {
    it("returns dash when metadata is empty and no action provided", () => {
      expect(formatAuditMetadata(null)).toBe("—")
      expect(formatAuditMetadata(undefined)).toBe("—")
      expect(formatAuditMetadata("")).toBe("—")
    })

    it("formats action label when metadata is null", () => {
      expect(formatAuditMetadata(null, "FARM_STATUS_UPDATE")).toBe("FARM STATUS UPDATE")
      expect(formatAuditMetadata(undefined, "PROFILE_UPDATE")).toBe("PROFILE UPDATE")
    })

    it("returns message or description property if present", () => {
      expect(formatAuditMetadata({ message: "Profil yangilandi" })).toBe("Profil yangilandi")
      expect(formatAuditMetadata({ description: "Muvaffaqiyatli saqlandi" })).toBe("Muvaffaqiyatli saqlandi")
      expect(formatAuditMetadata({ reason: "Hujjat yetarli emas" })).toBe("Sabab: Hujjat yetarli emas")
    })

    it("formats arbitrary key-value objects dynamically", () => {
      const meta = { farmName: "Bulvar Suv", phone: "+998901234567" }
      expect(formatAuditMetadata(meta)).toBe("farmName: Bulvar Suv, phone: +998901234567")
    })

    it("handles plain text string gracefully", () => {
      expect(formatAuditMetadata("Oddiy xabar")).toBe("Oddiy xabar")
    })
  })

  describe("mapAuditLogItem", () => {
    it("maps a full audit log item properly", () => {
      const raw = {
        id: 101,
        actorId: 1,
        actorName: "Yashnarbek Jumaqulov",
        action: "FARM_STATUS_UPDATE",
        entityType: "FARM",
        entityId: 29,
        metadata: { message: "Faol holatga o'tkazildi" },
        createdAt: "2026-10-19T10:35:08.000Z",
      }

      const mapped = mapAuditLogItem(raw, 0)

      expect(mapped.id).toBe(101)
      expect(mapped.admin.name).toBe("Yashnarbek Jumaqulov")
      expect(mapped.admin.avatarText).toBe("YJ")
      expect(mapped.target.name).toBe("FARM #29")
      expect(mapped.target.type).toBe("FARM")
      expect(mapped.description).toBe("Faol holatga o'tkazildi")
      expect(mapped.reason).toBe("—")
      expect(mapped.date).not.toBe("—")
      expect(mapped.time).not.toBe("—")
    })

    it("extracts reason and description separately when reason is provided", () => {
      const raw = {
        metadata: { newStatus: "BLOCKED", reason: "Litsenziya muddati tugagan" },
      }
      const mapped = mapAuditLogItem(raw, 1)
      expect(mapped.description).toBe("newStatus: BLOCKED")
      expect(mapped.reason).toBe("Litsenziya muddati tugagan")
    })

    it("handles fallback values for incomplete log items", () => {
      const mapped = mapAuditLogItem({}, 5)

      expect(mapped.id).toBe("log-5")
      expect(mapped.admin.name).toBe("SuperAdmin")
      expect(mapped.admin.avatarText).toBe("SU")
      expect(mapped.target.name).toBe("—")
      expect(mapped.description).toBe("—")
      expect(mapped.reason).toBe("—")
      expect(mapped.date).toBe("—")
      expect(mapped.time).toBe("—")
    })
  })

  describe("calculateAuditStats", () => {
    it("uses backend stats data when available", () => {
      const backendStats = {
        totalLogs: 59,
        farmActions: 6,
        userActions: 2,
        systemActions: 1,
      }

      const result = calculateAuditStats(backendStats, [], 59)

      expect(result).toEqual({
        totalLogs: 59,
        farmActions: 6,
        userActions: 2,
        systemActions: 1,
      })
    })

    it("handles completely empty inputs with 0 values", () => {
      const result = calculateAuditStats(null, [], null)

      expect(result).toEqual({
        totalLogs: 0,
        farmActions: 0,
        userActions: 0,
        systemActions: 0,
      })
    })
  })

  describe("resolveTotalPages", () => {
    it("prefers server totalPages when valid", () => {
      expect(resolveTotalPages(5, 50, 10, 10)).toBe(5)
    })

    it("derives total pages from totalElements when serverPages is absent", () => {
      expect(resolveTotalPages(null, 45, 10, 10)).toBe(5)
      expect(resolveTotalPages(undefined, 10, 10, 10)).toBe(1)
    })

    it("derives total pages from fallbackCount if both are absent", () => {
      expect(resolveTotalPages(null, null, 25, 10)).toBe(3)
      expect(resolveTotalPages(null, null, 0, 10)).toBe(1)
    })
  })

  describe("formatDisplayPhone", () => {
    it("formats 12-digit phone numbers with 998 prefix into uzbek standard", () => {
      expect(formatDisplayPhone("+998901234567")).toBe("+998 90 123 45 67")
      expect(formatDisplayPhone("998901234567")).toBe("+998 90 123 45 67")
    })

    it("formats 9-digit local phone numbers with +998", () => {
      expect(formatDisplayPhone("901234567")).toBe("+998 90 123 45 67")
    })

    it("returns dash for empty, null, or invalid phone numbers", () => {
      expect(formatDisplayPhone("")).toBe("—")
      expect(formatDisplayPhone(null)).toBe("—")
      expect(formatDisplayPhone(undefined)).toBe("—")
    })
  })

  describe("cleanAdminName", () => {
    it("hides email address and displays SuperAdmin fallback", () => {
      expect(cleanAdminName("admin@gidrogo.uz")).toBe("SuperAdmin")
      expect(cleanAdminName("jumaqulovyashnar@gmail.com")).toBe("SuperAdmin")
    })

    it("preserves real human names", () => {
      expect(cleanAdminName("Yashnarbek Jumaqulov")).toBe("Yashnarbek Jumaqulov")
      expect(cleanAdminName("Ali Valiyev")).toBe("Ali Valiyev")
    })

    it("provides fallback for empty values", () => {
      expect(cleanAdminName(null, "", 4)).toBe("SuperAdmin #4")
      expect(cleanAdminName(null)).toBe("SuperAdmin")
    })
  })

  describe("extractBossName", () => {
    it("extracts boss name from log properties or metadata", () => {
      expect(extractBossName({ bossName: "Sardor Rahimov" })).toBe("Sardor Rahimov")
      expect(extractBossName({ metadata: { bossFullName: "Botir Zokirov" } })).toBe("Botir Zokirov")
      expect(extractBossName({ metadata: JSON.stringify({ bossName: "Nodir" }) })).toBe("Nodir")
    })

    it("ignores email addresses as boss names", () => {
      expect(extractBossName({ bossName: "boss@gmail.com" })).toBe("—")
    })

    it("returns dash when no boss name is available", () => {
      expect(extractBossName({})).toBe("—")
    })
  })

  describe("extractAuditPhone", () => {
    it("extracts phone number from top-level or metadata fields", () => {
      expect(extractAuditPhone({ phone: "+998901234567" })).toBe("+998 90 123 45 67")
      expect(extractAuditPhone({ metadata: { bossPhone: "901234567" } })).toBe("+998 90 123 45 67")
    })

    it("returns dash when phone is missing", () => {
      expect(extractAuditPhone({})).toBe("—")
    })
  })

  describe("extractAuditDetails with email filter", () => {
    it("removes email fields from metadata and description", () => {
      const details = extractAuditDetails({
        metadata: {
          farmName: "Bulvar Suv",
          email: "superadmin@gidrogo.uz",
        },
      })

      expect(details.description).not.toContain("superadmin@gidrogo.uz")
      expect(details.description).toContain("farmName: Bulvar Suv")
    })
  })
})
