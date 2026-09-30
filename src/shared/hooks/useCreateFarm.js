import { farmService, fileUploadService } from "@/services"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useCreateFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["createFarm"],
    mutationFn: async (data) => {
      const { file, ...farmPayload } = data
      let logoUrl = farmPayload.logoUrl || ""

      if (file) {
        const formData = new FormData()
        formData.append("file", file)

        const uploadRes = await fileUploadService.uploadFile(formData)
        logoUrl = uploadRes?.data?.url || uploadRes?.url || ""
      }

      return await farmService.createFarm({
        ...farmPayload,
        logoUrl,
        latitude: Number(farmPayload.latitude) || 0,
        longitude: Number(farmPayload.longitude) || 0,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] })
    },
  })
}