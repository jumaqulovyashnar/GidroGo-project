/**
 * Backenddan kelgan rasm va fayl URL-larini to'g'ri formatga o'tkazish.
 * HTTPS (masalan Vercel) muhitda backendning http:// mutlaq manzillarini
 * Mixed Content bo'lib bloklanishining oldini olish uchun /api/files/view/...
 * nisbiy manziliga aylantiradi.
 *
 * @param {string} [url] - Fayl yoki rasm manzili
 * @returns {string} - Tozalangan va xavfsiz URL
 */
export function resolveFileUrl(url) {
  if (!url || typeof url !== "string") return ""

  // Local preview yoki base64 bo'lsa tegilmaydi
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return url
  }

  // Agar backend mutlaq http://.../api/files/view/... qaytarsa
  const apiFilesViewIndex = url.indexOf("/api/files/view/")
  if (apiFilesViewIndex !== -1) {
    return url.slice(apiFilesViewIndex)
  }

  // Agar /files/view/... bo'lsa (/api prefiksi yo'q)
  const filesViewIndex = url.indexOf("/files/view/")
  if (filesViewIndex !== -1) {
    return `/api${url.slice(filesViewIndex)}`
  }

  // Agar backend IP-manzili bilan boshlangan boshqa yo'l bo'lsa
  if (url.startsWith("http://169.58.215.170:8080")) {
    return url.replace("http://169.58.215.170:8080", "")
  }

  return url
}

export default resolveFileUrl
