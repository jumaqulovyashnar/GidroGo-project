import { updateFarmsStatus } from "@/services/farms.update.service"
import { bossService } from "@/services/boss.service"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useBosses = (params) => {
    return useQuery({
        queryKey: ["bosses", params],
        queryFn: () => bossService.getBosses(params),
    })
}

export const useUpdateFarmStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["farm-status"],
        mutationFn: ({ id, status }) => updateFarmsStatus.farmsStatus(id, { status }),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["farms"] })
            if (variables?.id) {
                queryClient.invalidateQueries({ queryKey: ["farm", String(variables.id)] })
            }
            toast.success(data?.message || "Ferma statusi yangilandi")
        },
        onError: (err) => {
            toast.error(err?.message || "Ferma statusini o'zgartirishda xatolik")
        },
    })
}

export const useUpdateBossStatus = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["boss-status"],
        mutationFn: (id) => bossService.toggleBossStatus(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bosses"] })
            toast.success(data?.message || "Ferma egasi statusi o'zgartirildi")
        },
        onError: (err) => {
            toast.error(err?.message || "Statusni o'zgartirishda xatolik yuz berdi")
        },
    })
}

export const useUpdateBoss = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["update-boss"],
        mutationFn: ({ id, data }) => bossService.updateBoss(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bosses"] })
            toast.success(data?.message || "Ferma egasi ma'lumotlari muvaffaqiyatli yangilandi")
        },
        onError: (err) => {
            toast.error(err?.message || "Ferma egasini yangilashda xatolik yuz berdi")
        },
    })
}

export const useDeleteBoss = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["delete-boss"],
        mutationFn: (id) => bossService.deleteBoss(id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bosses"] })
            toast.success(data?.message || "Ferma egasi muvaffaqiyatli o'chirildi")
        },
        onError: (err) => {
            toast.error(err?.message || "Ferma egasini o'chirishda xatolik yuz berdi")
        },
    })
}