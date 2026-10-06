import { requestService } from "@/services/farms.request.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// 1. Kutilayotgan so'rovlar ro'yxatini olish (GET)
export const useActivationRequests = () => {
    return useQuery({
        queryKey: ["activation-requests"],
        queryFn: () => requestService.getActivationRequests(),
    });
};

// 2. Boss so'rovini tasdiqlash (APPROVED) yoki rad etish (REJECTED) (POST)
export const useDecideActivation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["decideActivation"],
        mutationFn: ({ id, status = "APPROVED", rejectReason = "" }) => {
            return requestService.decideActivation(id, { status, rejectReason });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activation-requests"] });
            queryClient.invalidateQueries({ queryKey: ["farms"] });
        },
    });
};

// Siz yozgan useRequest bilan ham moslik uchun
export const useRequest = useDecideActivation;

export default useDecideActivation;