import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import managerCashService from "@/services/manager.cash.service";

// 1. GET /api/manager/couriers/cash-balances - Fermaning barcha dastavkachilari kassa balanslari
export const useCourierCashBalances = (options = {}) => {
  return useQuery({
    queryKey: ["manager-courier-cash-balances"],
    queryFn: () => managerCashService.getCourierCashBalances(),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. GET /api/manager/cash/handovers - Fermadagi kassa topshirishlar tarixi va holati
export const useCashHandovers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-cash-handovers", params],
    queryFn: () => managerCashService.getCashHandovers(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 3. POST /api/manager/couriers/{courierId}/cash/handovers - Menejer tomonidan to'g'ridan-to'g'ri topshirilgan naqd pulni kiritish
export const useDirectCashHandover = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courierId, amount, note }) =>
      managerCashService.directHandover(courierId, { amount, note }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["manager-courier-cash-balances"] });
      queryClient.invalidateQueries({ queryKey: ["manager-cash-handovers"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
      toast.success(res?.message || "Naqd pul muvaffaqiyatli qabul qilindi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Kassani qabul qilishda xatolik yuz berdi");
    },
    ...options,
  });
};

// 4. POST /api/manager/cash/handovers/{id}/confirm - Menejer tomonidan topshirilgan naqd pulni tasdiqlash
export const useConfirmCashHandover = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, confirmedAmount, note }) =>
      managerCashService.confirmHandover(id, { confirmedAmount, note }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["manager-courier-cash-balances"] });
      queryClient.invalidateQueries({ queryKey: ["manager-cash-handovers"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
      toast.success(res?.message || "Kassa topshirish muvaffaqiyatli tasdiqlandi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Tasdiqlashda xatolik yuz berdi");
    },
    ...options,
  });
};

// 5. POST /api/manager/cash/handovers/{id}/reject - Menejer tomonidan kassa topshirish so'rovini rad etish
export const useRejectCashHandover = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) =>
      managerCashService.rejectHandover(id, { reason }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["manager-courier-cash-balances"] });
      queryClient.invalidateQueries({ queryKey: ["manager-cash-handovers"] });
      toast.success(res?.message || "Kassa topshirish so'rovi rad etildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Rad etishda xatolik yuz berdi");
    },
    ...options,
  });
};
