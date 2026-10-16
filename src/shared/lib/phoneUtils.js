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
  if (val === undefined || val === null) return ""
  
  // 1. Oraliqdagi va barcha bo'shliqlarni olib tashlaymiz
  let clean = String(val).replace(/\s+/g, "")
  if (!clean) return ""

  // 2. Faqat + va raqamlarni qoldiramiz
  clean = clean.replace(/[^\d+]/g, "")
  if (!clean) return ""

  // Agar faqat + bo'lsa, foydalanuvchi endi kiritishni boshlagan
  if (clean === "+") return "+"

  // Agar + bilan boshlansa (masalan +9, +99, +998, +99890...)
  if (clean.startsWith("+")) {
    const digits = clean.slice(1).replace(/\D/g, "")
    return `+${digits}`.slice(0, 13)
  }

  // Agar + siz kiritilgan bo'lsa:
  const digits = clean.replace(/\D/g, "")
  if (!digits) return ""

  // 998 bilan boshlansa (+998...)
  if (digits.startsWith("998")) {
    return `+${digits}`.slice(0, 13)
  }

  // Mahalliy 9 xonali raqam to'liq kiritilsa (masalan: 901234567)
  if (digits.length === 9) {
    return `+998${digits}`
  }

  // Boshqa holatlarda + bilan formatlab boramiz
  return `+${digits}`.slice(0, 13)
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
