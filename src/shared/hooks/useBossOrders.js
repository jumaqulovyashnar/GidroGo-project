import { useQuery } from "@tanstack/react-query";
import bossOrdersService from "@/services/boss.orders.service";

// 1. Fermaning buyurtmalari (1 marta so'rov, 5 daqiqa kesh)
export const useBossOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-orders", params],
    queryFn: () => bossOrdersService.getOrders(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. Faqat bugungi buyurtmalar (1 marta so'rov, 5 daqiqa kesh)
export const useBossTodayOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-orders-today", params],
    queryFn: () => bossOrdersService.getTodayOrders(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 3. Barcha tarixiy buyurtmalar (1 marta so'rov, 5 daqiqa kesh)
export const useBossAllOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-orders-all", params],
    queryFn: () => bossOrdersService.getAllOrders(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useBossOrders;
