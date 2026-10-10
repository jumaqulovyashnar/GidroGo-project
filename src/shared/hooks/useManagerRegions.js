import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import managerRegionsService from "@/services/manager.regions.service";

// 1. GET /api/manager/regions - Fermaning xizmat hududlari ro'yxati
export const useManagerRegions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-regions", params],
    queryFn: () => managerRegionsService.getRegions(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. POST /api/manager/regions - Yangi xizmat hududi (poligon) qo'shish
export const useManagerCreateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => managerRegionsService.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-regions"] });
    },
  });
};

// 3. PATCH /api/manager/regions/{id}/toggle - Xizmat hududini yoqish/o'chirish
export const useManagerToggleRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => managerRegionsService.toggleRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-regions"] });
    },
  });
};

export default useManagerRegions;
