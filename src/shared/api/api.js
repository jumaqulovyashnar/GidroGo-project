import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    try {
      const rawStorage = localStorage.getItem("gidrogo-user-storage")

      if (rawStorage) {
        const parsed = JSON.parse(rawStorage)
        const token = parsed?.state?.userToken?.accessToken

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch {
      // Storage xatosi bo'lsa request davom etadi
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default api;