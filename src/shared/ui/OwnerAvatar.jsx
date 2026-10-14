import { useState, useMemo, memo } from "react"
import { resolveFileUrl } from "@/shared/lib"

/**
 * Ferma egasi / Ferma logotipi avatari komponenti
 * Rasm bo'lmasa, Togglening ko'k rangida (#2563EB) rounded-full doirada initsiallar ko'rsatiladi
 * 
 * @param {Object} props
 * @param {string} [props.image] - Logotip yoki rasm URL
 * @param {string} [props.farmName] - Ferma nomi
 * @param {string} [props.name] - F.I.Sh
 */
export const OwnerAvatar = memo(function OwnerAvatar({ image, farmName = "", name = "" }) {
  const [hasError, setHasError] = useState(false)
  const safeImage = useMemo(() => resolveFileUrl(image), [image])

  // Initsiallarni hisoblash: F.I.Sh bo'lsa 2 ta so'zning bosh harflari (masalan: Jonijon Joniyivich -> JJ)
  const initials = useMemo(() => {
    const target = (name && name !== "—" ? name : farmName || "").trim()
    if (!target || target === "—") return "F"

    // Maxsus belgilarni olib tashlash
    const clean = target.replace(/['`ʻ’"«»]/g, "").trim()
    const parts = clean.split(/\s+/).filter(Boolean)

    if (parts.length >= 2) {
      const first = parts[0].charAt(0).toUpperCase()
      const second = parts[1].charAt(0).toUpperCase()
      return `${first}${second}`
    }

    return clean.slice(0, 2).toUpperCase() || "F"
  }, [farmName, name])

  // Rasm mavjud bo'lsa va yuklanishda xato bermasa
  if (safeImage && !hasError) {
    return (
      <img
        src={safeImage}
        alt={name || farmName || "Avatar"}
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        className="w-10 h-10 min-w-10 min-h-10 rounded-full object-cover object-center border border-slate-200 shrink-0 shadow-2xs aspect-square"
      />
    )
  }

  // Rasm bo'lmasa: Foydalanuvchi so'ragan #155DFC ko'k rangi, to'liq doira (rounded-full)
  return (
    <div
      aria-label={name || farmName}
      style={{ backgroundColor: "#155DFC" }}
      className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-[#155DFC] text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-wide shrink-0 select-none shadow-xs aspect-square border border-transparent"
    >
      {initials}
    </div>
  )
})

export default OwnerAvatar
