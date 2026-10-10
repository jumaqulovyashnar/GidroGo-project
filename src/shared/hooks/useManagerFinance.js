import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import managerFinanceService from "@/services/manager.finance.service";

// 1. GET /api/manager/finance/summary - Fermaning moliyaviy hisoboti (tushum, xarajat, sof foyda)
export const useManagerFinanceSummary = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-finance-summary", params],
    queryFn: () => managerFinanceService.getSummary(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. GET /api/manager/finance/transactions - Fermaning barcha moliya tranzaksiyalari
export const useManagerFinanceTransactions = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-finance-transactions", params],
    queryFn: () => managerFinanceService.getTransactions(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 3. POST /api/manager/finance/expenses - Xarajat kiritish
export const useManagerCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => managerFinanceService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-finance-summary"] });
      queryClient.invalidateQueries({ queryKey: ["manager-finance-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

export default useManagerFinanceSummary;
