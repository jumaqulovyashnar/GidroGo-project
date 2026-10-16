/**
 * Telefon raqamini bo'shliqlardan tozalash va oldiga +998 prefiksini belgilash funksiyalari
 */

/**
 * Telefon inputi uchun qiymatni formatlash:
 * - Oraliq va barcha bo'shliqlarni (spaces) olib tashlaydi (trim / replace(/\s+/g, ''))
 * - Har doim oldiga +998 ni belgilaydi
 * - Maksimal uzunligi 13 ta belgi (+998XXXXXXXXX)
 *
 * @param {string} val
 * @returns {string}
 */
export const formatPhoneInput = (val) => {
  if (val === undefined || val === null || val === "") return "+998"
  
  // 1. Oraliqdagi va barcha bo'shliqlarni olib tashlaymiz
  let clean = String(val).replace(/\s+/g, "").replace(/[^\d+]/g, "")
  if (!clean || clean === "+") return "+998"

  const digits = clean.replace(/\D/g, "")
  if (digits.startsWith("998")) {
    const after = digits.slice(3)
    return `+998${after}`.slice(0, 13)
  }

  return `+998${digits}`.slice(0, 13)
}

/**
 * Backendga yuborish uchun telefon raqamini tozalash
 *
 * @param {string} val
 * @returns {string}
 */
export const cleanPhoneForBackend = (val) => {
  if (!val) return ""
  const clean = String(val).replace(/\s+/g, "").replace(/[^\d+]/g, "")
  const digits = clean.replace(/\D/g, "")
  if (digits.length < 9) return ""
  if (digits.length === 9) {
    return `+998${digits}`
  }
  if (digits.length === 12 && digits.startsWith("998")) {
    return `+${digits}`
  }
  return clean
}
