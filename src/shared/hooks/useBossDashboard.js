import { useQuery } from "@tanstack/react-query";
import bossDashboardService from "@/services/boss.dashboard.service";

// GET /api/boss/dashboard - Boss boshqaruv ko'rsatkichlari (1 marta so'rov, 5 daqiqa kesh)
export const useBossDashboard = (options = {}) => {
  return useQuery({
    queryKey: ["boss-dashboard"],
    queryFn: () => bossDashboardService.getDashboard(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useBossDashboard;
