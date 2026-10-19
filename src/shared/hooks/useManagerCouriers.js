import { useQuery } from "@tanstack/react-query";
import managerCouriersService from "@/services/manager.couriers.service";

// 1. GET /api/manager/couriers - Fermaning barcha dastavkachilari ro'yxati
export const useManagerCouriers = (options = {}) => {
  return useQuery({
    queryKey: ["manager-couriers"],
    queryFn: () => managerCouriersService.getCouriers(),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. GET /api/manager/couriers/live-tracking - Kuryerlarning onlayn GPS lokatsiyasi va joriy holati
export const useManagerCouriersLiveTracking = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-couriers-live-tracking", params],
    queryFn: () => managerCouriersService.getLiveTracking(params),
    staleTime: 1000 * 15,
    refetchInterval: 15000, // 15 soniyada avtomatik GPS lokatsiya yangilanadi (real-time polling)
    refetchOnWindowFocus: false,
    ...options,
  });
};

// 3. GET /api/manager/couriers/daily-summary - Kuryerlarning kunlik suv statistikasi (yuklangan, sotilgan, qolgan balonlar, naqd/online tushum)
export const useManagerCouriersDailySummary = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-couriers-daily-summary", params],
    queryFn: () => managerCouriersService.getDailySummary(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

export default useManagerCouriers;
