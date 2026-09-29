import axios from "axios"
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})
api.interceptors.request.use(
  (config) => {
    // Agar login yoki public auth yo'li bo'lsa, Authorization header yubormaymiz
    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("auth/login") ||
      config.url?.includes("/auth/register") ||
      config.url?.includes("auth/register")

    try {
      const rawStorage = localStorage.getItem("gidrogo-user-storage")

      if (rawStorage) {
        const parsed = JSON.parse(rawStorage)
        const token = parsed?.state?.userToken?.accessToken

        // Agar eski mock token qolib ketgan bo'lsa, tozalab yuboramiz
        if (typeof token === "string" && token.includes("mock-jwt-token")) {
          localStorage.removeItem("gidrogo-user-storage")
        } else if (token && !isAuthRoute) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      localStorage.removeItem("gidrogo-user-storage")
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api;