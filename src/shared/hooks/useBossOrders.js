import { useQuery } from "@tanstack/react-query";
import bossOrdersService from "@/services/boss.orders.service";

// 1. Fermaning buyurtmalari (default: bugungi)
export const useBossOrders = (params = {}) => {
  return useQuery({
    queryKey: ["boss-orders", params],
    queryFn: () => bossOrdersService.getOrders(params),
  });
};

// 2. Faqat bugungi buyurtmalar
export const useBossTodayOrders = (params = {}) => {
  return useQuery({
    queryKey: ["boss-orders-today", params],
    queryFn: () => bossOrdersService.getTodayOrders(params),
  });
};

// 3. Barcha tarixiy buyurtmalar
export const useBossAllOrders = (params = {}) => {
  return useQuery({
    queryKey: ["boss-orders-all", params],
    queryFn: () => bossOrdersService.getAllOrders(params),
  });
};
