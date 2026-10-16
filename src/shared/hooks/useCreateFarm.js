import { farmService } from "@/services"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cleanPhoneForBackend } from "@/shared/lib"

/**
 * FarmCreateRequest (OpenAPI shartnomasi bo'yicha):
 * - name: string (majburiy)
 * - phone: string (majburiy)
 * - address: string
 * - latitude: double
 * - longitude: double
 * - logoUrl: string
 * - bossFullName: string (majburiy)
 * - bossPhone: string (majburiy)
 * - bossPassword: string (majburiy)
 */
export const useCreateFarm = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["createFarm"],
    mutationFn: async (farmPayload) => {
      const { file: _file, ...cleanPayload } = farmPayload || {}

      return await farmService.createFarm({
        name: cleanPayload.name?.trim() || "",
        phone: cleanPhoneForBackend(cleanPayload.phone) || cleanPayload.phone?.trim() || "",
        address: cleanPayload.address?.trim() || "",
        latitude: Number(cleanPayload.latitude) || 0,
        longitude: Number(cleanPayload.longitude) || 0,
        logoUrl: cleanPayload.logoUrl || "",
        bossFullName: cleanPayload.bossFullName?.trim() || "",
        bossPhone: cleanPhoneForBackend(cleanPayload.bossPhone) || cleanPayload.bossPhone?.trim() || "",
        bossPassword: cleanPayload.bossPassword || "",
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] })
    },
  })
}

export default useCreateFarm