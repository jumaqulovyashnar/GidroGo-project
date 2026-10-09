import { useQuery } from "@tanstack/react-query";
import bossCouriersService from "@/services/boss.couriers.service";

// 1. Kuryerlarning onlayn GPS lokatsiyasi va joriy holati
export const useBossCouriersTracking = (options = {}) => {
  return useQuery({
    queryKey: ["boss-couriers-tracking"],
    queryFn: () => bossCouriersService.getLiveTracking(),
    staleTime: 1000 * 30, // 30 soniya kesh
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// 2. Kuryerlarning kunlik suv statistikasi (1 marta so'rov, 5 daqiqa kesh)
export const useBossCouriersDailySummary = (date, options = {}) => {
  const params = date ? { date } : {};
  return useQuery({
    queryKey: ["boss-couriers-daily-summary", date],
    queryFn: () => bossCouriersService.getDailySummary(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};
