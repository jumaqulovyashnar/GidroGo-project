import { useQuery } from "@tanstack/react-query";
import bossAnalyticsService from "@/services/boss.analytics.service";

// GET /api/boss/analytics/growth - Davriy biznes o'sishi va analitika (oylar va choraklar dinamikasi)
export const useBossBusinessGrowth = (params = { period: "quarter" }, options = {}) => {
  return useQuery({
    queryKey: ["boss-business-growth", params],
    queryFn: () => bossAnalyticsService.getBusinessGrowth(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useBossBusinessGrowth;