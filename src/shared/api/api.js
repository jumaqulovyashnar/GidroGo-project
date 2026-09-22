import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.gidrogo.uz/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    try {
      const rawStorage = typeof window !== "undefined" ? localStorage.getItem("gidrogo-user-storage") : null
      if (rawStorage) {
        const parsed = JSON.parse(rawStorage)
        const token = parsed?.state?.userToken?.accessToken
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // Fallback xatolikni e'tiborsiz qoldirish
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
