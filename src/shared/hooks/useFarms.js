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
    queryKey: ["farm", id],
    queryFn: async () => {
      const res = await farmService.getFarms()
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
      const found = list.find((f) => String(f.id) === String(id))
      return found || null
    },
    enabled: Boolean(id),
  })
}

export default useFarms
