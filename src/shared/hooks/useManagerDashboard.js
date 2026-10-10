import { useQuery } from "@tanstack/react-query";
import managerDashboardService from "@/services/manager.dashboard.service";

// GET /api/manager/dashboard - Manager operatsion boshqaruv ko'rsatkichlari (tushum, xarajat, buyurtmalar, zaxira, kuryerlar)
export const useManagerDashboard = (options = {}) => {
  return useQuery({
    queryKey: ["manager-dashboard"],
    queryFn: () => managerDashboardService.getDashboard(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useManagerDashboard;
