import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { farmService } from "@/services"

// 1. Barcha fermalarni olish
export const useFarms = (params) => {
  return useQuery({
    queryKey: ["farms", params],
    queryFn: () => farmService.getFarms(params),
  })
}

// 2. Bitta fermani ID orqali olish
export const useFarm = (id) => {
  return useQuery({
    queryKey: ["farm", id],
    queryFn: () => farmService.getFarmById(id),
    enabled: Boolean(id),
  })
}

// 3. Fermani tahrirlash
export const useUpdateFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => farmService.updateFarm(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["farms"] })
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["farm", variables.id] })
      }
    },
  })
}

// 4. Fermani o'chirish
export const useDeleteFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => farmService.deleteFarm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] })
    },
  })
}
