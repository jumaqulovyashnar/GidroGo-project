import { useState, useMemo, memo } from "react"
import { resolveFileUrl } from "@/shared/lib"

/**
 * Ferma egasi / Ferma logotipi avatari komponenti
 * Rasm bo'lmasa, ko'k fonda fermaning bosh harfi ko'rsatiladi
 * 
 * @param {Object} props
 * @param {string} [props.image] - Logotip yoki rasm URL
 * @param {string} [props.farmName] - Ferma nomi (bosh harf uchun)
 * @param {string} [props.name] - Qo'shimcha F.I.Sh (fallback)
 */
export const OwnerAvatar = memo(function OwnerAvatar({ image, farmName = "", name = "" }) {
  const [hasError, setHasError] = useState(false)
  const safeImage = useMemo(() => resolveFileUrl(image), [image])

  // Rasm bo'lmasa fermaning nomini bosh harfini olish
  const initial = useMemo(() => {
    // 1. Agar ferma nomi bo'lsa va u standart placeholder bo'lmasa
    const target = (
      farmName && farmName !== "Ferma biriktirilmagan"
        ? farmName
        : name || ""
    ).trim()

    if (!target || target === "—") return "F"

    // Maxsus belgilarni tozalash (masalan: Ko'kdala -> Kokdala, O'zbekiston -> Ozbekiston)
    const clean = target.replace(/['`ʻ’"«»]/g, "").trim()
    return clean.charAt(0).toUpperCase() || "F"
  }, [farmName, name])

  // Rasm mavjud bo'lsa va xatolik bermasa
  if (safeImage && !hasError) {
    return (
      <img
        src={safeImage}
        alt={farmName || name || "Ferma logotipi"}
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="size-10 rounded-full object-cover object-center border border-slate-200 shrink-0 shadow-2xs"
      />
    )
  }

  // Rasm bo'lmasa: To'q ko'k rang (#2563EB), rounded-full va fermaning bosh harfi
  return (
    <div
      aria-label={farmName || name}
      className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm border border-blue-700/20 shrink-0 select-none shadow-xs"
    >
      {initial}
    </div>
  )
})

export default OwnerAvatar
