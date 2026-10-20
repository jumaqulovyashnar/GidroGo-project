import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import bossXodimlarService from "@/services/boss.xodimlar.service";

// 4. GET /api/boss/staff/summary - Xodimlar monitoringi statistikasi
export const useStaffSummary = (options = {}) => {
  return useQuery({
    queryKey: ["staff-summary"],
    queryFn: () => bossXodimlarService.getStaffSummary(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    ...options,
  });
};

// 6. GET /api/boss/staff/{id} - Xodim ma'lumotini to'g'ridan-to'g'ri ID orqali olish
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

export const useStaff = () => {
  const queryClient = useQueryClient();

  // 1. GET /api/boss/staff (Faqat 1 marta va kerak bo'lganda ishlaydi)
  const staff = useQuery({
    queryKey: ["staff"],
    queryFn: () => bossXodimlarService.getXodim(),
    refetchOnWindowFocus: false, // Oyna aktiv bo'lganda ortiqcha qayta so'rov yubormaslik
  });

  // 2. POST /api/boss/staff
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

  // 3. PATCH /api/boss/staff/{id}/status
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

  // 5. DELETE /api/boss/staff/{id}
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
    // Yaratish
    createStaff: createStaff.mutate,
    createStaffAsync: createStaff.mutateAsync,
    isCreating: createStaff.isPending,
    // Statusni yangilash
    updateStaffStatus: updateStaffStatus.mutate,
    updateStaffStatusAsync: updateStaffStatus.mutateAsync,
    isUpdatingStatus: updateStaffStatus.isPending,
    // O'chirish
    deleteStaff: deleteStaff.mutate,
    deleteStaffAsync: deleteStaff.mutateAsync,
    isDeleting: deleteStaff.isPending,
  };
};

export default useStaff;

