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
  if (val === undefined || val === null) return "+998"
  
  // 1. Oraliqdagi va barcha bo'shliqlarni olib tashlaymiz
  let clean = String(val).replace(/\s+/g, "")
  if (!clean) return "+998"

  // 2. Faqat + va raqamlarni qoldiramiz
  clean = clean.replace(/[^\d+]/g, "")

  // 3. Oldiga +998 ni belgilaymiz
  if (clean.startsWith("+998")) {
    const after = clean.slice(4).replace(/\D/g, "")
    clean = `+998${after}`
  } else if (clean.startsWith("998")) {
    clean = `+${clean.replace(/\D/g, "")}`
  } else if (clean.startsWith("+")) {
    const after = clean.slice(1).replace(/\D/g, "")
    clean = `+998${after}`
  } else {
    const digits = clean.replace(/\D/g, "")
    clean = `+998${digits}`
  }

  // 4. Maksimal uzunlik: +998 va 9 ta raqam (+998901234567 = 13 ta belgi)
  if (clean.length > 13) {
    clean = clean.slice(0, 13)
  }

  return clean
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
