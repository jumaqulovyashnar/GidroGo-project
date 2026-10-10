import { useQuery } from "@tanstack/react-query";
import bossFarmService from "@/services/boss.farm.service";

// GET /api/boss/farm - Ferma texnik pasporti va laboratoriya tahlillari
export const useBossFarmPassport = (options = {}) => {
  return useQuery({
    queryKey: ["boss-farm-passport"],
    queryFn: () => bossFarmService.getFarmPassport(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useBossFarmPassport;
