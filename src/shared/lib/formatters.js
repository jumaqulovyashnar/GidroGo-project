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
