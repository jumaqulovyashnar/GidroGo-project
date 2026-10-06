import { z } from "zod"

// +998 90 123 45 67 / +998901234567 formatlarini qabul qiladi
const uzPhone = z
  .string()
  .trim()
  .min(1, "Telefon raqamini kiriting")
  .regex(/^\+998\s?\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/, "Format: +998 90 123 45 67")

// type="number" input qiymati string bo'lib keladi, shuning uchun string sifatida tekshiramiz
const coordinate = (min, max, label) =>
  z
    .string()
    .trim()
    .refine(
      (v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= min && Number(v) <= max),
      `${label} ${min} dan ${max} gacha bo'lishi kerak`,
    )

export const fermaSchema = z.object({
  logoUrl: z.string().optional().default(""),
  name: z.string().trim().min(2, "Ferma nomi kamida 2 ta belgi bo'lishi kerak").max(100, "Juda uzun"),
  phone: uzPhone,
  address: z.string().trim().min(5, "Manzilni to'liq kiriting"),
  latitude: coordinate(-90, 90, "Latitude"),
  longitude: coordinate(-180, 180, "Longitude"),
  bossFullName: z
    .string()
    .trim()
    .min(3, "F.I.Sh kamida 3 ta belgi bo'lishi kerak")
    .refine((v) => v.split(/\s+/).length >= 2, "Familiya va ismni kiriting"),
  bossPhone: uzPhone,
  bossPassword: z
    .string()
    .min(8, "Parol kamida 8 ta belgi bo'lishi kerak")
    .regex(/[A-Za-z]/, "Parolda kamida bitta harf bo'lishi kerak")
    .regex(/\d/, "Parolda kamida bitta raqam bo'lishi kerak"),
})

export const fermaDefaultValues = {
  logoUrl: "",
  name: "",
  phone: "",
  address: "",
  latitude: "",
  longitude: "",
  bossFullName: "",
  bossPhone: "",
  bossPassword: "",
}

export default fermaSchema
