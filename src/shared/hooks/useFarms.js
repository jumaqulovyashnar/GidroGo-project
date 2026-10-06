import { farmService } from "@/services"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export const useFarms = (params) => {
  return useQuery({
    queryKey: ["farms", params],
    queryFn: () => farmService.getFarms(params),
  })
}

export const useFarm = (id) => {
  return useQuery({
    queryKey: ["farm", id],
    queryFn: async () => {
      try {
        const res = await farmService.getFarmById(id)
        return res?.data || res
      } catch (err) {
        // Agar alohida ID endpoint ishlamasa yoki ro'yxatda bo'lsa, umumiy ro'yxatdan qidiradi
        const allRes = await farmService.getFarms()
        const list = Array.isArray(allRes?.data) ? allRes.data : Array.isArray(allRes) ? allRes : []
        const found = list.find((f) => String(f.id) === String(id))
        if (found) {
          return found
        }
        throw err
      }
    },
    enabled: Boolean(id),
  })
}

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

export const useDeleteFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id) => farmService.deleteFarm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] })
    },
  })
}

