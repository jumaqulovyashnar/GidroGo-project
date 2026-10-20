import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bossFinanceService from "@/services/boss.finance.service";

// 1. GET /api/boss/finance/summary (1 marta so'rov, 5 daqiqa kesh)
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

// 2. GET /api/boss/finance/chart - Moliyaviy ko'rsatkichlar dinamikasi grafigi
export const useBossFinanceChart = (period = "week", options = {}) => {
  return useQuery({
    queryKey: ["boss-finance-chart", period],
    queryFn: () => bossFinanceService.getFinanceChart({ period }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 3. POST /api/manager/finance/expenses - Xarajat kiritish
export const useBossCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => bossFinanceService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boss-finance-summary"] });
      queryClient.invalidateQueries({ queryKey: ["boss-finance-chart"] });
      queryClient.invalidateQueries({ queryKey: ["boss-finance-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["boss-finance-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["boss-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["manager-finance-summary"] });
    },
  });
};

// 4. GET /api/boss/finance/expenses - Boss uchun barcha kiritilgan xarajatlar ro'yxati
export const useBossExpenses = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-finance-expenses", params],
    queryFn: () => bossFinanceService.getExpenses(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// 5. GET /api/boss/finance/transactions - Boss uchun barcha moliya tranzaksiyalari
export const useBossTransactions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-finance-transactions", params],
    queryFn: () => bossFinanceService.getTransactions(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export default useBossFinanceSummary;

