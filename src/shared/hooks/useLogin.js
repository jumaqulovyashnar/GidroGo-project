import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService, useUserStore } from "@/entities/user"
import { createUser, getAuthTokens, getResponseData } from "@/provider/AuthProvider"

const ROLE_ROUTES = {
    SUPER_ADMIN: "/super-admin",
    MANAGER: "/manager",
    BOSS: "/boss",
}

export const useLogin = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (response) => {
            const data = getResponseData(response)
            const tokens = getAuthTokens(data)
            const accessToken = tokens.accessToken
            const refreshToken = tokens.refreshToken || ""

            const userObj = createUser(data?.user || data?.data || data, accessToken)
            const role = userObj?.role || data?.data?.role || data?.role

            if (accessToken) {
                useUserStore.getState().actions.setUserInfoAndToken(userObj, {
                    accessToken,
                    refreshToken,
                })
            }

            const route = ROLE_ROUTES[role]
            if (!route) {
                toast.error("Foydalanuvchi roli aniqlanmadi.")
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