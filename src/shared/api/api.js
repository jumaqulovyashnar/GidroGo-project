import axios from "axios"
import { useUserStore } from "@/store/userStore"

const rawBaseURL = import.meta.env.VITE_API_URL || ""
const cleanBaseURL = rawBaseURL.trim().replace(/;+$/, "")

// Agar sahifa HTTPS orqali ochilgan bo'lsa (masalan, Vercel: https://gidrogo-project.vercel.app),
// lekin API URL http:// bo'lsa, brauzer Mixed Content qoidasi bilan so'rovni BLOKLAYDI.
// Shuning uchun HTTPS muhitda Vercel proxy rewrite (/api) dan foydalanamiz.
export const getBaseURL = () => {
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    cleanBaseURL.startsWith("http://")
  ) {
    return "/api"
  }
  return cleanBaseURL || "/api"
}

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
})

export const isAuthUrl = (url = "") => /\/?auth\/(login|register|refresh|logout)/.test(url)
export const getAccessToken = () => useUserStore.getState()?.userToken?.accessToken || null
export const getRefreshToken = () => useUserStore.getState()?.userToken?.refreshToken || null

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

export const handleForceLogout = () => {
  delete api.defaults.headers.common["Authorization"]
  try {
    useUserStore.getState()?.actions?.clearUserInfoAndToken()
  } catch {
    localStorage.removeItem("gidrogo-user-storage")
  }

  const currentPath = typeof window !== "undefined" ? window.location.pathname : ""
  if (currentPath !== "/login" && !isAuthUrl(currentPath)) {
    window.location.href = "/login"
  }
}

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Agar FormData bo'lsa, brauzer multipart boundary bilan o'zi to'g'ri o'rnatadi
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"]
    }

    // Query parametrlardan undefined, null va bo'sh stringlarni tozalash
    if (config.params && typeof config.params === "object" && !(config.params instanceof URLSearchParams)) {
      const cleanParams = {}
      for (const [key, val] of Object.entries(config.params)) {
        if (val !== undefined && val !== null && val !== "") {
          cleanParams[key] = val
        }
      }
      config.params = cleanParams
    }

    const token = getAccessToken()
    if (token && !isAuthUrl(config.url)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR with Concurrency Queue & Real 401 Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (!originalRequest || !error.response) {
      return Promise.reject(error)
    }

    const isAuthRoute = isAuthUrl(originalRequest.url)

    // Faqat 401, qayta urinilmagan va auth endpoint bo'lmagan so'rovlar uchun ishlaydi
    if (error.response.status === 401 && !originalRequest._retry && !isAuthRoute) {
      originalRequest._retry = true

      // Agar boshqa so'rov allaqachon refresh qilayotgan bo'lsa, navbatga qo'shamiz
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true
      const refreshToken = getRefreshToken()

      // Agar refresh token mavjud bo'lmasa, majburiy logout
      if (!refreshToken) {
        isRefreshing = false
        processQueue(error, null)
        handleForceLogout()
        return Promise.reject(error)
      }

      try {
        // Asosiy api instansiyasidan emas, toza axios orqali chaqiramiz (loop bo'lmasligi uchun)
        const refreshResponse = await axios.post(
          `${getBaseURL()}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        )

        const authData = refreshResponse.data?.data || refreshResponse.data
        const newAccessToken = authData?.accessToken
        const newRefreshToken = authData?.refreshToken || refreshToken

        if (!newAccessToken) {
          throw new Error("Yangi access token olinmadi")
        }

        // 1. Zustand store ni yangilash
        const currentStore = useUserStore.getState()
        const currentUser = currentStore?.userInfo || null
        if (currentStore?.actions?.setUserInfoAndToken) {
          currentStore.actions.setUserInfoAndToken(currentUser, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        }

        // 2. Default Authorization headerni yangilash
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        // 3. Navbatdagi barcha kutib turgan so'rovlarni o'tkazish
        processQueue(null, newAccessToken)
        isRefreshing = false

        // 4. Asl so'rovni yangi token bilan qayta yuborish
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError, null)
        handleForceLogout()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api