/**
 * GidroGo Domain Order Statuses - Single Source of Truth
 */

export const ORDER_STATUS = {
  SEARCHING: "SEARCHING",
  PREPARING: "PREPARING",
  ASSIGNED: "ASSIGNED",
  ON_THE_WAY: "ON_THE_WAY",
  NEARBY: "NEARBY",
  DELIVERED: "DELIVERED",
  COMPLETED: "COMPLETED",
  PROBLEM: "PROBLEM",
  RETURNED: "RETURNED",
  CANCELLED: "CANCELLED",
}

export const ORDER_STATUS_CONFIG = {
  SEARCHING: {
    label: "Kuryer qidirilmoqda",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
    tab: "new",
  },
  PREPARING: {
    label: "Tayyorlanmoqda",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
    tab: "processing",
  },
  ASSIGNED: {
    label: "Kuryerga biriktirildi",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    dotClass: "bg-indigo-500",
    tab: "processing",
  },
  ON_THE_WAY: {
    label: "Yetkazilmoqda (yo'lda)",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
    tab: "delivering",
  },
  NEARBY: {
    label: "Manzilga yaqin",
    badgeClass: "bg-cyan-50 text-cyan-700 border-cyan-200",
    dotClass: "bg-cyan-500",
    tab: "delivering",
  },
  DELIVERED: {
    label: "Yetkazildi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    tab: "completed",
  },
  COMPLETED: {
    label: "Yakunlandi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    tab: "completed",
  },
  PROBLEM: {
    label: "Muammoli",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
    tab: "problem",
  },
  RETURNED: {
    label: "Qaytarildi",
    badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    dotClass: "bg-orange-500",
    tab: "problem",
  },
  CANCELLED: {
    label: "Bekor qilingan",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
    tab: "cancelled",
  },
}

/**
 * Normalizes any backend or legacy UI status string to the canonical domain status
 */
export function normalizeOrderStatus(rawStatus) {
  if (!rawStatus) return ORDER_STATUS.SEARCHING
  const statusUpper = String(rawStatus).toUpperCase()

  if (ORDER_STATUS_CONFIG[statusUpper]) {
    return statusUpper
  }

  // Legacy mappings
  if (statusUpper === "NEW" || statusUpper === "CREATED") return ORDER_STATUS.SEARCHING
  if (statusUpper === "PROCESSING") return ORDER_STATUS.PREPARING
  if (statusUpper === "DELIVERING") return ORDER_STATUS.ON_THE_WAY
  if (statusUpper === "DONE") return ORDER_STATUS.COMPLETED

  return statusUpper
}

/**
 * Returns UI metadata for a given status
 */
export function getOrderStatusMeta(rawStatus) {
  const canonical = normalizeOrderStatus(rawStatus)
  return ORDER_STATUS_CONFIG[canonical] || {
    label: String(rawStatus || "Noma'lum"),
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
    dotClass: "bg-slate-400",
    tab: "all",
  }
}
