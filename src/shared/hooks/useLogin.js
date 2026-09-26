import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { authService } from "@/entities/user"

const ROLE_ROUTES = {
    SUPER_ADMIN: "/super-admin",
    MANAGER: "/manager",
    BOSS: "/boss",
}

export const useLogin = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: authService.login,

        onSuccess: (data) => {            
            const role = data?.data?.role
            const route = ROLE_ROUTES[role]

            if (!route) {
                toast.error("Foydalanuvchi roli aniqlanmadi.")
                return 
            }

            navigate(route)

            
        },
        

        onError: (error) => {
            const message = error?.response?.data?.message || "Telefon raqami yoki parol noto'g'ri."
            toast.error(message)
        },
    })
}