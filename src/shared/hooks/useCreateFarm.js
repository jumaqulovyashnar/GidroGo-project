import { farmService } from "@/services"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["createFarm"],
    mutationFn: async (farmPayload) => {
      const { file: _file, ...cleanPayload } = farmPayload || {}
      return await farmService.createFarm({
        ...cleanPayload,
        latitude: Number(cleanPayload.latitude) || 0,
        longitude: Number(cleanPayload.longitude) || 0,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] })
    },
  })
}

export default useCreateFarm