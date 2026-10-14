import { lazy } from "react"

/**
 * Dinamik import (lazy chunk) yuklanmay qolsa (masalan, yangi versiya deploy qilinganda),
 * foydalanuvchiga xatolik ko'rsatmasdan sahifani bir marta avtomatik yangilaydi.
 */
export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    try {
      return await componentImport()
    } catch (error) {
      const isChunkError =
        error?.message?.includes("Failed to fetch dynamically imported module") ||
        error?.message?.includes("Importing a module script failed") ||
        error?.name === "ChunkLoadError"

      const hasReloaded = typeof window !== "undefined" && window.sessionStorage.getItem("chunk_reload_lock")
      if (isChunkError && !hasReloaded && typeof window !== "undefined") {
        window.sessionStorage.setItem("chunk_reload_lock", "true")
        window.location.reload()
        return new Promise(() => {}) // reload bo'lguncha to'xtatib turadi
      }
      throw error
    }
  })

export default lazyWithRetry
