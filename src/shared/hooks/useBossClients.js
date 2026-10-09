import { useQuery } from "@tanstack/react-query";
import bossClientsService from "@/services/boss.clients.service";

// 1. Fermaning barcha mijozlari ro'yxati (1 marta so'rov, 5 daqiqa kesh)
export const useBossClients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-clients", params],
    queryFn: () => bossClientsService.getClients(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. Tanlangan mijozning to'liq CRM tafsilotlari (1 marta so'rov, 5 daqiqa kesh)
export const useBossClientDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["boss-client-detail", id],
    queryFn: () => bossClientsService.getClientById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};
