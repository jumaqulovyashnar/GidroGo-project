import { z } from "zod"
import {
  PHONE_REGEX,
  FULL_NAME_REGEX,
  BUSINESS_NAME_REGEX,
  COORDINATE_REGEX,
  PASSWORD_STRONG_REGEX,
  formatPhoneInput,
} from "@/shared/lib"

// O'zbekiston telefon raqamlari formati: oraliq bo'shliqlar tozalanadi va +998 bilan ta'minlanadi
const uzPhone = z
  .string()
  .trim()
  .transform((val) => formatPhoneInput(val))
  .refine((val) => PHONE_REGEX.test(val), {
    message: "Telefon raqami noto'g'ri (Format: +998901234567)",
  })

// Koordinatalarni tekshirish (Regex + min/max chegaralar)
const coordinate = (min, max, label) =>
  z
    .string()
    .trim()
    .refine((v) => v === "" || COORDINATE_REGEX.test(v), `${label} faqat haqiqiy son bo'lishi kerak`)
    .refine(
      (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max),
      `${label} ${min} dan ${max} gacha bo'lishi kerak`,
    )

export const fermaSchema = z.object({
  logoUrl: z.string().optional().default(""),
  name: z
    .string()
    .trim()
    .min(2, "Ferma nomi kamida 2 ta belgi bo'lishi kerak")
    .max(100, "Juda uzun")
    .regex(BUSINESS_NAME_REGEX, "Ferma nomida ruxsat etilmagan belgilar mavjud"),
  phone: uzPhone,
  address: z.string().trim().min(5, "Manzilni to'liq kiriting"),
  latitude: coordinate(-90, 90, "Latitude"),
  longitude: coordinate(-180, 180, "Longitude"),
  bossFullName: z
    .string()
    .trim()
    .min(3, "F.I.Sh kamida 3 ta belgi bo'lishi kerak")
    .regex(FULL_NAME_REGEX, "Familiya va ismni to'liq kiriting (Faqat harflar)"),
  bossPhone: uzPhone,
  bossPassword: z
    .string()
    .min(8, "Parol kamida 8 ta belgi bo'lishi kerak")
    .regex(PASSWORD_STRONG_REGEX, "Parolda kamida bitta harf va bitta raqam bo'lishi kerak"),
})

export const fermaDefaultValues = {
  logoUrl: "",
  name: "",
  phone: "+998",
  address: "",
  latitude: "",
  longitude: "",
  bossFullName: "",
  bossPhone: "+998",
  bossPassword: "",
}

export default fermaSchema
