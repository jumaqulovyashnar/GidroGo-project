import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { feedbackService } from "@/services/feedback.service";

// Manager feedback hooks
export const useManagerFeedback = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-feedback", params],
    queryFn: () => feedbackService.getFarmFeedback(params),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useManagerFeedbackSummary = (options = {}) => {
  return useQuery({
    queryKey: ["manager-feedback-summary"],
    queryFn: () => feedbackService.getFeedbackSummary(),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useManagerFeedbackDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["manager-feedback-detail", id],
    queryFn: () => feedbackService.getFeedbackById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    ...options,
  });
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }) => feedbackService.updateFeedback(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["manager-feedback"] });
      queryClient.invalidateQueries({ queryKey: ["manager-feedback-summary"] });
      queryClient.invalidateQueries({ queryKey: ["manager-feedback-detail"] });
      toast.success(res?.message || "Fikr-mulohaza holati yangilandi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Holatni yangilashda xatolik yuz berdi");
    },
  });
};

// Client and Courier feedback hooks
export const useClientFeedback = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["client-feedback", params],
    queryFn: () => feedbackService.getClientFeedback(params),
    ...options,
  });
};

export const useCreateClientFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => feedbackService.createClientFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-feedback"] });
      toast.success("Fikringiz muvaffaqiyatli yuborildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Fikr yuborishda xatolik yuz berdi");
    },
  });
};

export const useCourierFeedback = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["courier-feedback", params],
    queryFn: () => feedbackService.getCourierFeedback(params),
    ...options,
  });
};

export const useCreateCourierFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => feedbackService.createCourierFeedback(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courier-feedback"] });
      toast.success("Feedback yuborildi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Xatolik yuz berdi");
    },
  });
};
