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
    COURIER: "/manager",
    ROLE_COURIER: "/manager",
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

            if (accessToken) {
                useUserStore.getState().actions.setUserInfoAndToken(userObj, {
                    accessToken,
                    refreshToken,
                })
            }

            const route = ROLE_ROUTES[role]
            if (!route) {
                toast.error(`Foydalanuvchi roli (${role || "noma'lum"}) aniqlanmadi.`)
                return
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