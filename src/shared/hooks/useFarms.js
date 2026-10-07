import { farmService } from "@/services"
import { useQuery } from "@tanstack/react-query"

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

export default useFarms
