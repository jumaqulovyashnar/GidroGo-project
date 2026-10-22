/**
 * Centralized formatting utilities for currency, dates, times and numbers
 * Ensures consistency across the application and avoids duplicate logic
 */

/**
 * Formats a monetary amount into Uzbek formatted string (e.g. "12 500 so'm")
 * @param {number|string|null|undefined} amount
 * @param {string} [currency="so'm"]
 * @returns {string}
 */
export function formatCurrency(amount, currency = "so'm") {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return `0 ${currency}`.trim()
  }
  const formatted = Math.round(Number(amount))
    .toLocaleString("uz-UZ")
    .replace(/,/g, " ")
  return currency ? `${formatted} ${currency}` : formatted
}

/**
 * Formats a number with thousand separators
 * @param {number|string|null|undefined} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(Number(num))) {
    return "0"
  }
  return Number(num).toLocaleString("uz-UZ").replace(/,/g, " ")
}

/**
 * Safely parses any date string, timestamp or Date instance into a valid Date object or null
 * @param {string|number|Date|null|undefined} dateInput
 * @returns {Date|null}
 */
export function parseSafeDate(dateInput) {
  if (!dateInput) return null
  try {
    const d = new Date(dateInput)
    return isNaN(d.getTime()) ? null : d
  } catch {
    return null
  }
}

/**
 * Formats a date into "DD.MM.YYYY" format
 * @param {string|number|Date|null|undefined} dateInput
 * @param {string} [fallback="—"]
 * @returns {string}
 */
export function formatDate(dateInput, fallback = "—") {
  const date = parseSafeDate(dateInput)
  if (!date) return fallback
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

/**
 * Formats a date's time component into "HH:mm" or "HH:mm:ss"
 * @param {string|number|Date|null|undefined} dateInput
 * @param {boolean} [includeSeconds=false]
 * @param {string} [fallback="—"]
 * @returns {string}
 */
export function formatTime(dateInput, includeSeconds = false, fallback = "—") {
  const date = parseSafeDate(dateInput)
  if (!date) return fallback
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  if (includeSeconds) {
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }
  return `${hours}:${minutes}`
}

/**
 * Formats a date and time together (e.g. "25.10.2026, 14:30")
 * @param {string|number|Date|null|undefined} dateInput
 * @param {string} [fallback="—"]
 * @returns {string}
 */
export function formatDateTime(dateInput, fallback = "—") {
  const date = parseSafeDate(dateInput)
  if (!date) return fallback
  return `${formatDate(date, fallback)}, ${formatTime(date, false, fallback)}`
}

/**
 * Translates backend order statuses into clear Uzbek labels
 * @param {string|null|undefined} status
 * @returns {string}
 */
export function formatOrderStatusUz(status = "") {
  if (!status) return "Yangi"
  const upper = String(status).toUpperCase()
  switch (upper) {
    case "COMPLETED":
    case "DELIVERED":
    case "YETKAZILDI":
      return "Yetkazildi"
    case "DELIVERING":
    case "ON_WAY":
    case "ON_THE_WAY":
    case "YETKAZILMOQDA":
      return "Yetkazilmoqda"
    case "NEARBY":
    case "YAQINLASHMOQDA":
      return "Yaqinlashmoqda"
    case "PROCESSING":
    case "PREPARING":
    case "IN_PROGRESS":
    case "JARAYONDA":
    case "TAYYORLANMOQDA":
      return "Tayyorlanmoqda"
    case "ASSIGNED":
    case "BIRIKTIRILGAN":
    case "BIRIKTIRILDI":
      return "Biriktirilgan"
    case "SEARCHING":
    case "QIDIRILMOQDA":
      return "Qidirilmoqda"
    case "CONFIRMED":
    case "TASDIQLANDI":
    case "TASDIQLANGAN":
      return "Tasdiqlangan"
    case "ACCEPTED":
    case "QABUL_QILINDI":
      return "Qabul qilindi"
    case "PROBLEM":
    case "MUAMMOLI":
      return "Muammoli"
    case "RETURNED":
    case "QAYTARILDI":
      return "Qaytarildi"
    case "REJECTED":
    case "RAD_ETILDI":
      return "Rad etilgan"
    case "NEW":
    case "CREATED":
    case "PENDING":
    case "YANGI":
      return "Yangi"
    case "CANCELLED":
    case "CANCELED":
    case "BEKOR":
    case "BEKOR_QILINDI":
      return "Bekor qilingan"
    default:
      return status
  }
}

/**
 * Returns Tailwind CSS badge classes for an order status
 * @param {string|null|undefined} status
 * @returns {string}
 */
export function getOrderStatusBadgeClass(status = "") {
  const upper = String(status).toUpperCase()
  if (upper === "COMPLETED" || upper === "DELIVERED" || upper === "YETKAZILDI") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200"
  }
  if (
    upper === "DELIVERING" ||
    upper === "ON_WAY" ||
    upper === "ON_THE_WAY" ||
    upper === "YETKAZILMOQDA" ||
    upper === "NEARBY"
  ) {
    return "bg-blue-50 text-blue-700 border border-blue-200"
  }
  if (upper === "ASSIGNED" || upper === "CONFIRMED" || upper === "ACCEPTED" || upper === "BIRIKTIRILGAN") {
    return "bg-indigo-50 text-indigo-700 border border-indigo-200"
  }
  if (
    upper === "PROCESSING" ||
    upper === "PREPARING" ||
    upper === "IN_PROGRESS" ||
    upper === "TAYYORLANMOQDA" ||
    upper === "JARAYONDA" ||
    upper === "SEARCHING" ||
    upper === "QIDIRILMOQDA" ||
    upper === "NEW" ||
    upper === "CREATED" ||
    upper === "PENDING"
  ) {
    return "bg-amber-50 text-amber-800 border border-amber-200"
  }
  if (upper === "CANCELLED" || upper === "CANCELED" || upper === "BEKOR_QILINDI" || upper === "REJECTED") {
    return "bg-rose-50 text-rose-700 border border-rose-200"
  }
  if (upper === "PROBLEM" || upper === "RETURNED" || upper === "MUAMMOLI") {
    return "bg-orange-50 text-orange-700 border border-orange-200"
  }
  return "bg-slate-50 text-slate-700 border border-slate-200"
}

/**
 * Formats a phone number into readable Uzbek format (+998 XX XXX XX XX)
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function formatDisplayPhone(raw) {
  if (!raw || raw === "—" || raw === "-") return "—"
  const cleaned = String(raw).replace(/\D/g, "")
  if (cleaned.length === 12 && cleaned.startsWith("998")) {
    return `+998 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`
  }
  if (cleaned.length === 9) {
    return `+998 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`
  }
  return String(raw)
}


