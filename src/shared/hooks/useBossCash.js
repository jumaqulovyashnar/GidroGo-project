import { useQuery } from "@tanstack/react-query";
import bossCashService from "@/services/boss.cash.service";

// GET /api/boss/cash/summary - Boss uchun kassa tushumi, topshirilgan va dastavkachilarda qolgan summa hisoboti
export const useBossCashSummary = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-cash-summary", params],
    queryFn: () => bossCashService.getCashSummary(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useBossCashSummary;
