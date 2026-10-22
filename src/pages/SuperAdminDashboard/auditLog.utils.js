import { parseSafeDate, formatDate, formatTime } from "@/shared/lib"

/**
 * Builds dynamic dropdown options for Period filter from API
 * @param {Array} periods
 * @returns {Array<{value: string, label: string}>}
 */
export const buildPeriodOptions = (periods = []) => {
  if (!Array.isArray(periods)) return []
  return periods
    .filter(Boolean)
    .map((p) => ({
      value: String(p.code ?? p.value ?? ""),
      label: String(p.label ?? p.name ?? p.code ?? ""),
    }))
    .filter((opt) => opt.value && opt.label)
}

/**
 * Builds dynamic dropdown options for Action filter from API
 * @param {Array} actionTypes
 * @returns {Array<{value: string, label: string}>}
 */
export const buildActionOptions = (actionTypes = []) => {
  if (!Array.isArray(actionTypes)) {
    return [{ value: "all", label: "Amal turi: Barchasi" }]
  }

  const hasAll = actionTypes.some((a) => String(a?.code ?? a?.value).toLowerCase() === "all")
  const dynamic = actionTypes
    .filter(Boolean)
    .map((a) => ({
      value: String(a.code ?? a.value ?? ""),
      label: String(a.label ?? a.name ?? a.code ?? ""),
    }))
    .filter((opt) => opt.value && opt.label)

  return hasAll ? dynamic : [{ value: "all", label: "Amal turi: Barchasi" }, ...dynamic]
}

/**
 * Builds dynamic dropdown options for Object/Entity filter from API
 * @param {Array} objectTypes
 * @returns {Array<{value: string, label: string}>}
 */
export const buildObjectOptions = (objectTypes = []) => {
  if (!Array.isArray(objectTypes)) {
    return [{ value: "all", label: "Obyekt: Barchasi" }]
  }

  const hasAll = objectTypes.some((o) => String(o?.code ?? o?.value).toLowerCase() === "all")
  const dynamic = objectTypes
    .filter(Boolean)
    .map((o) => ({
      value: String(o.code ?? o.value ?? ""),
      label: String(o.label ?? o.name ?? o.code ?? ""),
    }))
    .filter((opt) => opt.value && opt.label)

  return hasAll ? dynamic : [{ value: "all", label: "Obyekt: Barchasi" }, ...dynamic]
}

/**
 * Builds dynamic dropdown options for SuperAdmin filter from API
 * @param {Array} superAdmins
 * @returns {Array<{value: string, label: string}>}
 */
export const buildAdminOptions = (superAdmins = []) => {
  if (!Array.isArray(superAdmins)) {
    return [{ value: "all", label: "SuperAdmin: Barchasi" }]
  }

  const hasAll = superAdmins.some((a) => String(a?.id ?? a?.value).toLowerCase() === "all")
  const dynamic = superAdmins
    .filter(Boolean)
    .map((adm) => {
      const id = String(adm.id ?? adm.value ?? "")
      const label = adm.fullName
        ? `${adm.fullName}${adm.role ? ` (${adm.role})` : ""}`
        : adm.phone || (id ? `SuperAdmin #${id}` : "")
      return { value: id, label }
    })
    .filter((opt) => opt.value && opt.label)

  return hasAll ? dynamic : [{ value: "all", label: "SuperAdmin: Barchasi" }, ...dynamic]
}

/**
 * Safely parses JSON string or returns null
 * @param {any} val
 * @returns {any}
 */
export const safeJsonParse = (val) => {
  if (typeof val !== "string") return val
  const trimmed = val.trim()
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed)
    } catch {
      return null
    }
  }
  return null
}

/**
 * Formats a raw phone string into cleanly readable format (+998 XX XXX XX XX)
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export const formatDisplayPhone = (raw) => {
  if (!raw || typeof raw !== "string") return "—"
  const clean = raw.trim()
  if (!clean || clean === "—") return "—"

  const digits = clean.replace(/\D/g, "")
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`
  }
  if (digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
  }
  return clean
}

/**
 * Cleans admin name so that raw email addresses are never displayed as names
 * @param {string|null|undefined} rawName
 * @param {string} [actorRole]
 * @param {number|string} [actorId]
 * @returns {string}
 */
export const cleanAdminName = (rawName, actorRole = "", actorId = null) => {
  if (!rawName || typeof rawName !== "string") {
    return actorId ? `SuperAdmin #${actorId}` : "SuperAdmin"
  }
  const trimmed = rawName.trim()
  if (trimmed.includes("@")) {
    return "SuperAdmin"
  }
  return trimmed || (actorId ? `SuperAdmin #${actorId}` : "SuperAdmin")
}

/**
 * Extracts Boss full name from audit log item or metadata
 * @param {object} log
 * @returns {string}
 */
export const extractBossName = (log = {}) => {
  const metadata = typeof log.metadata === "string" ? safeJsonParse(log.metadata) : log.metadata || {}

  const candidates = [
    log.bossName,
    log.bossFullName,
    log.boss?.fullName,
    log.boss?.name,
    metadata?.bossName,
    metadata?.bossFullName,
    metadata?.ownerName,
    metadata?.farmOwner,
    metadata?.fullName,
    log.entityType === "BOSS" ? log.targetName || log.entityName : null,
  ]

  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim()) {
      const val = c.trim()
      if (!val.includes("@") && !val.match(/^BOSS\s*#\d+$/i)) {
        return val
      }
    }
  }

  if (metadata?.name && typeof metadata.name === "string" && !metadata.name.includes("@")) {
    return metadata.name.trim()
  }

  if (log.entityType === "BOSS" && log.targetName && !log.targetName.includes("@")) {
    return log.targetName
  }

  return "—"
}

/**
 * Extracts and formats phone number from audit log item or metadata
 * @param {object} log
 * @returns {string}
 */
export const extractAuditPhone = (log = {}) => {
  const metadata = typeof log.metadata === "string" ? safeJsonParse(log.metadata) : log.metadata || {}

  const candidates = [
    log.phone,
    log.phoneNumber,
    log.bossPhone,
    log.boss?.phone,
    log.targetPhone,
    log.actorPhone,
    metadata?.phone,
    metadata?.phoneNumber,
    metadata?.bossPhone,
    metadata?.tel,
    metadata?.telephone,
    metadata?.mobile,
  ]

  for (const c of candidates) {
    if (c && typeof c === "string" && c.trim()) {
      const formatted = formatDisplayPhone(c.trim())
      if (formatted !== "—") return formatted
    }
  }

  return "—"
}

/**
 * Separates description (tavsif) and reason (sabab) from audit log item,
 * removing emails and redundant technical clutter
 * @param {object} log
 * @returns {{description: string, reason: string}}
 */
export const extractAuditDetails = (log = {}) => {
  let metadata = log.metadata
  let reason = log.reason || ""

  if (typeof metadata === "string") {
    const trimmed = metadata.trim()
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        metadata = JSON.parse(trimmed)
      } catch {
        // keep as string
      }
    }
  }

  let description = ""

  if (metadata && typeof metadata === "object") {
    if (!reason && (metadata.reason || metadata.sabab)) {
      reason = String(metadata.reason || metadata.sabab)
    }

    if (metadata.message) {
      description = String(metadata.message)
    } else if (metadata.description) {
      description = String(metadata.description)
    } else if (metadata.details) {
      description = String(metadata.details)
    } else if (
      log.action === "PROFILE_UPDATE" ||
      log.action === "SUPERADMIN_PROFILE_UPDATE" ||
      (metadata.old && !metadata.farmName)
    ) {
      description = "SuperAdmin profil ma'lumotlari yangilandi"
    } else {
      const parts = Object.entries(metadata)
        .filter(([k, v]) => {
          const lk = k.toLowerCase()
          if (lk === "reason" || lk === "sabab") return false
          if (lk === "email" || lk.includes("email") || lk === "mail") return false
          if (lk === "old" || lk === "new") return false
          return v !== undefined && v !== null && v !== ""
        })
        .map(([k, v]) => `${k}: ${typeof v === "object" ? JSON.stringify(v) : v}`)

      description = parts.join(", ")
    }
  } else if (typeof metadata === "string" && metadata.trim()) {
    const trimmed = metadata.trim()
    if (!trimmed.includes("@")) {
      description = trimmed
    }
  }

  // Remove any stray email addresses from description
  if (description && description.includes("@")) {
    description = description
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "")
      .replace(/,\s*,/g, ",")
      .replace(/^,\s*/, "")
      .replace(/,\s*$/, "")
      .trim()
  }

  if (!description) {
    description = log.action ? log.action.replaceAll("_", " ") : "—"
  }

  return {
    description,
    reason: reason || "—",
  }
}

/**
 * Parses and formats audit log metadata into human-readable text dynamically from API
 * @param {string|object|null|undefined} metadata
 * @param {string} [action]
 * @returns {string}
 */
export const formatAuditMetadata = (metadata, action = "") => {
  const { description, reason } = extractAuditDetails({ metadata, action })
  if (description && description !== "—") return description
  if (reason && reason !== "—") return `Sabab: ${reason}`
  return "—"
}

/**
 * Transforms a raw audit log item from API into a normalized view model
 * @param {object} log
 * @param {number} index
 * @returns {object}
 */
export const mapAuditLogItem = (log = {}, index = 0) => {
  const dateObj = parseSafeDate(log.createdAt)
  const formattedDate = dateObj ? formatDate(dateObj) : "—"
  const formattedTime = dateObj ? formatTime(dateObj, true) : "—"

  const entityType = log.entityType || log.object || log.targetType || ""
  const entityId = log.entityId ?? log.id ?? ""

  const targetName =
    log.targetName ||
    log.entityName ||
    (entityType && entityId ? `${entityType} #${entityId}` : entityType || "—")

  const adminName = cleanAdminName(
    log.actorName || log.adminName || log.superAdminName,
    log.actorRole || log.role,
    log.actorId
  )

  const words = adminName.split(/\s+/).filter(Boolean)
  const avatarText =
    words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : (adminName.slice(0, 2) || "SA").toUpperCase()

  const { description, reason } = extractAuditDetails(log)
  const bossName = extractBossName(log)
  const phone = extractAuditPhone(log)

  return {
    id: log.id || `log-${index}`,
    date: formattedDate,
    time: formattedTime,
    admin: {
      name: adminName,
      role: log.actorRole || log.role || "",
      avatarText,
    },
    boss: {
      name: bossName,
      phone,
    },
    phone,
    target: {
      name: targetName,
      type: entityType || "—",
    },
    description,
    reason,
  }
}

/**
 * Directly maps KPI metrics from backend stats API response
 * @param {object|null} statsData
 * @param {Array} rawLogs
 * @param {number|null} totalElements
 * @returns {object}
 */
export const calculateAuditStats = (statsData, rawLogs = [], totalElements = null) => {
  return {
    totalLogs: Number(statsData?.totalLogs ?? totalElements ?? rawLogs.length ?? 0),
    farmActions: Number(statsData?.farmActions ?? 0),
    userActions: Number(statsData?.userActions ?? 0),
    systemActions: Number(statsData?.systemActions ?? 0),
  }
}

/**
 * Resolves total pages from server pagination metadata or local logs count
 * @param {number|null|undefined} serverPages
 * @param {number|null|undefined} totalElements
 * @param {number} fallbackCount
 * @param {number} pageSize
 * @returns {number}
 */
export const resolveTotalPages = (serverPages, totalElements, fallbackCount, pageSize = 10) => {
  if (serverPages !== undefined && serverPages !== null && !isNaN(Number(serverPages))) {
    return Math.max(1, Number(serverPages))
  }
  if (totalElements !== undefined && totalElements !== null && !isNaN(Number(totalElements))) {
    return Math.max(1, Math.ceil(Number(totalElements) / pageSize))
  }
  return Math.max(1, Math.ceil((fallbackCount || 0) / pageSize))
}
