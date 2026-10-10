import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import courierCashService from "@/services/courier.cash.service";

// 1. GET /api/courier/cash - Kuryerning kassa balansi, bugun yig'ilgan summa va oxirgi tranzaksiyalar
export const useCourierCashSummary = (options = {}) => {
  return useQuery({
    queryKey: ["courier-cash-summary"],
    queryFn: () => courierCashService.getCourierCash(),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. POST /api/courier/cash/handovers - Kuryer tomonidan kassani topshirish so'rovini yuborish
export const useSubmitCashHandover = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ declaredAmount, note }) =>
      courierCashService.submitHandover({ declaredAmount, note }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["courier-cash-summary"] });
      toast.success(res?.message || "Kassa topshirish so'rovi muvaffaqiyatli yuborildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Kassa topshirish so'rovini yuborishda xatolik yuz berdi");
    },
    ...options,
  });
};
