import axios from "axios"
import { useUserStore } from "@/entities/user/userStore"

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

const handleForceLogout = () => {
  try {
    useUserStore.getState()?.actions?.clearUserInfoAndToken()
  } catch {
    localStorage.removeItem("gidrogo-user-storage")
  }

  const currentPath = window.location.pathname
  if (currentPath !== "/login" && !currentPath.startsWith("/auth/")) {
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

    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("auth/register") ||
      config.url?.includes("/auth/refresh") ||
      config.url?.includes("auth/refresh")

    try {
      const state = useUserStore.getState()
      const token = state?.userToken?.accessToken

      if (typeof token === "string" && token.includes("mock-jwt-token")) {
        handleForceLogout()
      } else if (token && !isAuthRoute) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Fallback: localStorage
      const rawStorage = localStorage.getItem("gidrogo-user-storage")
      if (rawStorage) {
        try {
          const parsed = JSON.parse(rawStorage)
          const token = parsed?.state?.userToken?.accessToken
          if (token && !isAuthRoute) {
            config.headers.Authorization = `Bearer ${token}`
          }
        } catch {}
      }
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

    const isAuthRoute =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh")

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

      const currentStore = useUserStore.getState()
      let refreshToken = currentStore?.userToken?.refreshToken

      if (!refreshToken) {
        try {
          const rawStorage = localStorage.getItem("gidrogo-user-storage")
          if (rawStorage) {
            const parsed = JSON.parse(rawStorage)
            refreshToken = parsed?.state?.userToken?.refreshToken
          }
        } catch {}
      }

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

        // 1. Zustand store va localStorage ni yangilash
        const currentUser = currentStore?.userInfo || null
        if (currentStore?.actions?.setUserInfoAndToken) {
          currentStore.actions.setUserInfoAndToken(currentUser, {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        }

        // 2. Default Authorization headerni yangilash
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`
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