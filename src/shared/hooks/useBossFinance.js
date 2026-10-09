import { useQuery } from "@tanstack/react-query";
import bossFinanceService from "@/services/boss.finance.service";

// GET /api/boss/finance/summary (1 marta so'rov, 5 daqiqa kesh)
export const useBossFinanceSummary = (period = "month", options = {}) => {
  return useQuery({
    queryKey: ["boss-finance-summary", period],
    queryFn: () => bossFinanceService.getFinanceSummary({ period }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useBossFinanceSummary;
