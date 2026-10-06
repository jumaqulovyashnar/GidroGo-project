import { requestService } from "@/services/farms.request.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) =>
            requestService.decideActivation(id, payload),

        onSuccess: (data, variables) => {
            const isApproved = variables?.payload?.status === "APPROVED";
            toast.success(
                data?.message ||
                (isApproved
                    ? "Ariza muvaffaqiyatli tasdiqlandi!"
                    : "Ariza rad etildi!")
            );
            queryClient.invalidateQueries({ queryKey: ["activation-requests"] });
            queryClient.invalidateQueries({ queryKey: ["farms"] });
        },

        onError: (error) => {
            toast.error(error?.message || "Amalni bajarishda xatolik yuz berdi!");
        },
    });
};

export default useRequest;