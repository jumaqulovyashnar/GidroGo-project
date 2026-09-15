import axios from "axios"
import useUserStore from "@/store/userStore"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.gidrogo.uz/api",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().userToken?.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api
