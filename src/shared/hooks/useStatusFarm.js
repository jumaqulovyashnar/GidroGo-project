import { updateFarmsStatus } from "@/services/farms.update.service"
import { useMutation } from "@tanstack/react-query"

export const useUpdateFarmStatus = () => {
    return useMutation({
        mutationKey: ["farm-status"],
        mutationFn: (id) => updateFarmsStatus.farmsStatus(id),
    })
}

export const useUpdateBossStatus = () => {
    return useMutation({
        mutationKey: ["boss-status"],
        mutationFn: (id) => updateFarmsStatus.updateFarmsBossStatus(id),
    })
}