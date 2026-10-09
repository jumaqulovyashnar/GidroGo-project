import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import bossXodimlarService from "@/services/boss.xodimlar.service";

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
    onSuccess: () => {
      // Faqat 1 marta yangi ma'lumotni olish
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
    },
  });

  // 3. PATCH /api/boss/staff/{id}/status
  const updateStaffStatus = useMutation({
    mutationFn: ({ id, status }) =>
      bossXodimlarService.updateStaffStatus(id, status),
    onSuccess: () => {
      // Faqat 1 marta yangi ma'lumotni olish
      queryClient.invalidateQueries({
        queryKey: ["staff"],
      });
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
  };
};

export default useStaff;
