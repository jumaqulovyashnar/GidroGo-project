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
    queryKey: ["farm", String(id)],
    queryFn: async () => {
      const res = await farmService.getFarmById(id)
      return res?.data || res
    },
    enabled: Boolean(id),
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

export default useFarms
