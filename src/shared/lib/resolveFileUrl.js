/**
 * Backenddan kelgan rasm va fayl URL-larini to'g'ri formatga o'tkazish.
 * 
 * - HTTPS (masalan Vercel: https://gidrogo-project.vercel.app) muhitda:
 *   Mixed Content blokirovkasini oldini olish uchun /api/files/view/... nisbiy manzilga aylantiradi
 *   (Vercel proxy/rewrite qoidasi so'rovni backendga xavfsiz yetkazadi).
 * - Localhost yoki HTTP muhitda esa:
 *   Rasmlar to'g'ridan-to'g'ri va xatosiz yuklanishi uchun to'liq backend domeni (http://169.58.215.170:8080)
 *   bilan qaytaradi.
 *
 * @param {string} [url] - Fayl yoki rasm manzili
 * @returns {string} - Tozalangan va to'liq ochiladigan URL
 */
export function resolveFileUrl(url) {
  if (!url || typeof url !== "string") return ""

  const trimmed = url.trim()
  if (!trimmed) return ""

  // Local preview yoki base64 bo'lsa tegilmaydi
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed
  }

  // Fayl yo'lidan /files/view/... qismini aniqlash
  let cleanPath = trimmed

  const filesViewIndex = cleanPath.indexOf("/files/view/")
  if (filesViewIndex !== -1) {
    cleanPath = `/api${cleanPath.slice(filesViewIndex)}`
  } else if (cleanPath.startsWith("http://") || cleanPath.startsWith("https://")) {
    // Tashqi mutlaq URL bo'lsa
    return cleanPath
  } else {
    // Agar faqat nisbiy yo'l yoki fayl nomi bo'lsa
    if (!cleanPath.startsWith("/")) {
      cleanPath = `/${cleanPath}`
    }
    if (!cleanPath.startsWith("/api/")) {
      cleanPath = `/api${cleanPath}`
    }
  }

  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:"

  if (isHttps) {
    // HTTPS muhitda faqat nisbiy /api/... qaytaramiz (Vercel rewrite qiladi)
    return cleanPath
  }

  // Localhost (HTTP) muhitda to'liq backend hostini biriktiramiz
  const backendHost = (import.meta.env.VITE_API_URL || "http://169.58.215.170:8080/api").replace(/\/api\/?$/, "")
  return `${backendHost}${cleanPath}`
}

export default resolveFileUrl
