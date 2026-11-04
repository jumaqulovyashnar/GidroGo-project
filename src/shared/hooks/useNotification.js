import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notificationService } from "@/services/notification.service";

export const useNotifications = (role, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["notifications", role, params],
    queryFn: () => notificationService.getNotifications(role, params),
    enabled: Boolean(role),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
    refetchOnWindowFocus: true,
    ...options,
  });
};

export const useUnreadNotificationsCount = (role, options = {}) => {
  return useQuery({
    queryKey: ["notifications-unread-count", role],
    queryFn: () => notificationService.getUnreadCount(role),
    enabled: Boolean(role),
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 45,
    ...options,
  });
};

export const useMarkNotificationAsRead = (role) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => notificationService.markAsRead(role, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", role] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count", role] });
    },
    onError: (err) => {
      toast.error(err?.message || "Xatolik yuz berdi");
    },
  });
};

export const useMarkAllNotificationsAsRead = (role) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", role] });
      queryClient.invalidateQueries({ queryKey: ["notifications-unread-count", role] });
      toast.success("Barcha bildirishnomalar o'qilgan deb belgilandi");
    },
    onError: (err) => {
      toast.error(err?.message || "Xatolik yuz berdi");
    },
  });
};
