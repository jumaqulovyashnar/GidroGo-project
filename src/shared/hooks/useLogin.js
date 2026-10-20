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

                toast.error("Kirish ruxsati mavjud emas")
                return
            }

            if (!accessToken) {
                useUserStore.getState().actions.clearUserInfoAndToken()
                toast.error(data?.message || "Avtorizatsiya tokeni olinmadi. Qayta urinib ko'ring.")
                return
            }

            useUserStore.getState().actions.setUserInfoAndToken(userObj, {
                accessToken,
                refreshToken,
            })

            toast.success("Tizimga muvaffaqiyatli kirildi!")
            navigate(route, { replace: true })
        },

        onError: (error) => {
            // Xato yuz berganda avvalgi stale sessiyani tozalash
            useUserStore.getState().actions.clearUserInfoAndToken()
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Telefon raqami yoki parol noto'g'ri."
            toast.error(message)
        },
    })
}