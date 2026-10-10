import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import managerClientsService from "@/services/manager.clients.service";

// 1. Fermaning CRM mijozlar bazasi ro'yxati (keshlangan)
export const useManagerClients = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-clients", params],
    queryFn: () => managerClientsService.getClients(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. Tanlangan mijozning to'liq CRM tafsilotlari (keshlangan)
export const useManagerClientDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["manager-client-detail", id],
    queryFn: () => managerClientsService.getClientById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 3. Tanlangan mijozning ushbu fermadagi barcha buyurtmalari (keshlangan)
export const useManagerClientOrders = (id, params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-client-orders", id, params],
    queryFn: () => managerClientsService.getClientOrders(id, params),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 4. POST /api/manager/clients/{clientId}/bottles/adjust - Mijoz idish balansini qo'lda tuzatish mutatsiyasi
export const useAdjustBottleBalance = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, ...data }) =>
      managerClientsService.adjustBottleBalance(clientId, data),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["manager-clients"] });
      if (variables?.clientId) {
        queryClient.invalidateQueries({
          queryKey: ["manager-client-detail", variables.clientId],
        });
      }
      toast.success(res?.message || "Mijoz idish balansi muvaffaqiyatli yangilandi!");
    },
    onError: (err) => {
      toast.error(err?.message || "Idish balansini yangilashda xatolik yuz berdi");
    },
    ...options,
  });
};
