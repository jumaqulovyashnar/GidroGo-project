import { farmService } from "@/services"
import { useQuery } from "@tanstack/react-query"

export const useFarms = () => {
  return useQuery({
    queryKey: ["farms"],
    queryFn: () => farmService.getFarms(),
  })
}
