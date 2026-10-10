import { useQuery } from "@tanstack/react-query";
import bossSalesService from "@/services/boss.sales.service";

// 1. GET /api/boss/sales/summary - Savdo va mahsulotlar realizatsiyasi (kunlik/haftalik/oylik dinamika va kartochkalar)
export const useBossSalesSummary = (params = { period: "today" }, options = {}) => {
  return useQuery({
    queryKey: ["boss-sales-summary", params],
    queryFn: () => bossSalesService.getSalesSummary(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// 2. GET /api/boss/sales/products-summary - Mahsulotlar toifalari bo'yicha sotuv tahlili
export const useBossSalesProductsSummary = (options = {}) => {
  return useQuery({
    queryKey: ["boss-sales-products-summary"],
    queryFn: () => bossSalesService.getProductsSummary(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};
