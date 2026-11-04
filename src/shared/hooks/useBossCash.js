import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import bossCashService from "@/services/boss.cash.service";

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

export const useBossCashHandovers = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["boss-cash-handovers", params],
    queryFn: () => bossCashService.getBossHandovers(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useBossConfirmHandover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => bossCashService.confirmHandover(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["boss-cash-handovers"] });
      queryClient.invalidateQueries({ queryKey: ["boss-cash-summary"] });
      toast.success(res?.message || "Naqd pul topshirilishi tasdiqlandi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Tasdiqlashda xatolik yuz berdi");
    },
  });
};

export const useBossRejectHandover = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => bossCashService.rejectHandover(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["boss-cash-handovers"] });
      queryClient.invalidateQueries({ queryKey: ["boss-cash-summary"] });
      toast.success(res?.message || "So'rov rad etildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Rad etishda xatolik yuz berdi");
    },
  });
};

export default useBossCashSummary;
