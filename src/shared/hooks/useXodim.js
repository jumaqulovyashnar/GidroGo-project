import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import bossXodimlarService from "@/services/boss.xodimlar.service";

export const useStaffSummary = (options = {}) => {
  return useQuery({
    queryKey: ["staff-summary"],
    queryFn: () => bossXodimlarService.getStaffSummary(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useStaffDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["staff-detail", id],
    queryFn: () => bossXodimlarService.getStaffById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useUpdateStaffVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) => bossXodimlarService.updateStaffVehicle(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-detail"] });
      toast.success(res?.message || "Transport ma'lumotlari muvaffaqiyatli saqlandi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Transport ma'lumotlarini yangilashda xatolik yuz berdi");
    },
  });
};

export const useStaff = () => {
  const queryClient = useQueryClient();

  const staff = useQuery({
    queryKey: ["staff"],
    queryFn: () => bossXodimlarService.getXodim(),
    refetchOnWindowFocus: false,
  });

  const createStaff = useMutation({
    mutationFn: (payload) => bossXodimlarService.createXodim(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-summary"] });
      toast.success(res?.message || "Yangi xodim muvaffaqiyatli qo'shildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Xodim qo'shishda xatolik yuz berdi");
    },
  });

  const updateStaffStatus = useMutation({
    mutationFn: ({ id, status }) =>
      bossXodimlarService.updateStaffStatus(id, status),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-summary"] });
      toast.success(res?.message || "Xodim holati yangilandi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Xodim holatini o'zgartirishda xatolik yuz berdi");
    },
  });

  const deleteStaff = useMutation({
    mutationFn: (id) => bossXodimlarService.deleteStaff(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff-summary"] });
      toast.success(res?.message || "Xodim tizimdan o'chirildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Xodimni o'chirishda xatolik yuz berdi (Kassa balansini tekshiring)");
    },
  });

  return {
    data: staff.data,
    isLoading: staff.isLoading,
    isError: staff.isError,
    error: staff.error,
    refetch: staff.refetch,
    createStaff: createStaff.mutate,
    createStaffAsync: createStaff.mutateAsync,
    isCreating: createStaff.isPending,
    updateStaffStatus: updateStaffStatus.mutate,
    updateStaffStatusAsync: updateStaffStatus.mutateAsync,
    isUpdatingStatus: updateStaffStatus.isPending,
    deleteStaff: deleteStaff.mutate,
    deleteStaffAsync: deleteStaff.mutateAsync,
    isDeleting: deleteStaff.isPending,
  };
};

export default useStaff;
