import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useUserStore } from "@/entities/user"
import { authService } from "@/services"
import { createUser, getAuthTokens, getResponseData } from "@/provider/AuthProvider"

const ROLE_ROUTES = {
    SUPER_ADMIN: "/super-admin",
    ROLE_SUPER_ADMIN: "/super-admin",
    MANAGER: "/manager",
    ROLE_MANAGER: "/manager",
    BOSS: "/boss",
    ROLE_BOSS: "/boss",
    FERMA_RAHBARI: "/boss",
    ROLE_FERMA_RAHBARI: "/boss",
}

export const useLogin = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (response) => {
            const data = getResponseData(response)
            const payload = data?.data || data?.user || data
            const tokens = getAuthTokens(data)
            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken || ""

            const userObj = createUser(payload, accessToken)
            const role = userObj?.role || payload?.role || data?.role

            const route = ROLE_ROUTES[role]
            if (!route) {
                // Reject unsupported roles before establishing a session and clear stale auth state
                useUserStore.getState().actions.clearUserInfoAndToken()

                if (role === "COURIER" || role === "ROLE_COURIER") {
                    toast.error("Ushbu hisob (Kuryer) uchun veb-boshqaruv paneliga kirish ruxsati mavjud emas. Iltimos, mobil ilovadan foydalaning.")
                } else if (role === "CLIENT" || role === "ROLE_CLIENT") {
                    toast.error("Mijoz hisobi uchun veb-boshqaruv paneliga kirish ruxsati mavjud emas.")
                } else {
                    toast.error(`Foydalanuvchi roli (${role || "noma'lum"}) uchun veb-panel mavjud emas.`)
                }
                return
            }

            if (accessToken) {
                useUserStore.getState().actions.setUserInfoAndToken(userObj, {
                    accessToken,
                    refreshToken,
                })
            }

            toast.success("Tizimga muvaffaqiyatli kirildi!")
            navigate(route, { replace: true })
        },

        onError: (error) => {
            const message = error?.response?.data?.message || "Telefon raqami yoki parol noto'g'ri."
            toast.error(message)
        },
    })
}