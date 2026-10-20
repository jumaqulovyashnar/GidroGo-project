import { useState, useEffect } from "react"

const DEFAULT_YANDEX_KEY = import.meta.env.VITE_YANDEX_MAPS_KEY

/**
 * useYandexMapsLoader - Custom hook that handles asynchronous loading of the Yandex Maps 2.1 JS SDK.
 * Separates script injection, lifecycle, timeout, and readiness verification from the map rendering component.
 *
 * @param {string} [apiKey] - Yandex Maps API key (defaults to VITE_YANDEX_MAPS_KEY)
 * @returns {{ loadStatus: 'loading' | 'ready' | 'fallback', isReady: boolean, isFallback: boolean, isLoading: boolean }}
 */
export function useYandexMapsLoader(apiKey = DEFAULT_YANDEX_KEY) {
  const [loadStatus, setLoadStatus] = useState(() => {
    if (!apiKey) return "fallback"
    if (typeof window !== "undefined" && window.ymaps?.Map) return "ready"
    return "loading"
  })

  useEffect(() => {
    if (!apiKey) {
      setLoadStatus("fallback")
      return
    }

    if (typeof window !== "undefined" && window.ymaps?.Map) {
      setLoadStatus("ready")
      return
    }

    let isMounted = true
    const scriptId = "yandex-map-script"
    let script = document.getElementById(scriptId)

    if (script && (script.src.includes("coordorder=longlat") || !script.src.includes(apiKey))) {
      script.remove()
      script = null
      if (window.ymaps) {
        try {
          delete window.ymaps
        } catch {
          window.ymaps = undefined
        }
      }
    }

    if (!script) {
      script = document.createElement("script")
      script.id = scriptId
      script.type = "text/javascript"
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=uz_UZ`
      script.async = true
      document.head.appendChild(script)
    }

    const timeoutId = setTimeout(() => {
      if (isMounted && loadStatus === "loading") {
        console.warn("Yandex Maps API load timed out, falling back to vector map.")
        setLoadStatus("fallback")
      }
    }, 5000)

    script.onload = () => {
      clearTimeout(timeoutId)
      if (window.ymaps) {
        window.ymaps.ready(() => {
          if (isMounted) setLoadStatus("ready")
        })
      } else if (isMounted) {
        setLoadStatus("fallback")
      }
    }

    script.onerror = () => {
      clearTimeout(timeoutId)
      if (isMounted) setLoadStatus("fallback")
    }

    return () => {
      isMounted = false
    }
  }, [apiKey, loadStatus])

  return {
    loadStatus,
    isReady: loadStatus === "ready",
    isFallback: loadStatus === "fallback",
    isLoading: loadStatus === "loading",
  }
}

export default useYandexMapsLoader
