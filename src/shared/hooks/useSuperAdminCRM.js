import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { superAdminCrmService } from "@/services"

// 1. GET /api/superadmin/clients - Mijozlar ro'yxati
export const useSuperAdminClients = (params = {}) => {
  return useQuery({
    queryKey: ["superadmin-clients", params],
    queryFn: () => superAdminCrmService.getClients(params),
  })
}

// 2. GET /api/superadmin/clients/summary - Mijozlar statistikasi
export const useSuperAdminClientsSummary = () => {
  return useQuery({
    queryKey: ["superadmin-clients-summary"],
    queryFn: () => superAdminCrmService.getClientsSummary(),
  })
}

// 3. GET /api/superadmin/clients/{id} - Mijoz profili
export const useSuperAdminClientDetail = (id) => {
  return useQuery({
    queryKey: ["superadmin-client-detail", id],
    queryFn: () => superAdminCrmService.getClientById(id),
    enabled: Boolean(id),
  })
}

// 4. PATCH /api/superadmin/clients/{id}/status - Mijozni bloklash/faollashtirish
export const useUpdateSuperAdminClientStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => superAdminCrmService.updateClientStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin-clients"] })
      queryClient.invalidateQueries({ queryKey: ["superadmin-clients-summary"] })
      queryClient.invalidateQueries({ queryKey: ["superadmin-client-detail"] })
    },
  })
}

// 5. DELETE /api/superadmin/clients/{id} - Mijozni o'chirish
export const useDeleteSuperAdminClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => superAdminCrmService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin-clients"] })
      queryClient.invalidateQueries({ queryKey: ["superadmin-clients-summary"] })
    },
  })
}

// 6. GET /api/superadmin/clients/{id}/payments - Mijoz to'lovlari
export const useSuperAdminClientPayments = (id, params = {}) => {
  return useQuery({
    queryKey: ["superadmin-client-payments", id, params],
    queryFn: () => superAdminCrmService.getClientPayments(id, params),
    enabled: Boolean(id),
  })
}

// 7. GET /api/superadmin/clients/{id}/orders - Mijoz buyurtmalari
export const useSuperAdminClientOrders = (id, params = {}) => {
  return useQuery({
    queryKey: ["superadmin-client-orders", id, params],
    queryFn: () => superAdminCrmService.getClientOrders(id, params),
    enabled: Boolean(id),
  })
}

// 8. GET /api/superadmin/orders - Buyurtmalar ro'yxati
export const useSuperAdminOrders = (params = {}) => {
  return useQuery({
    queryKey: ["superadmin-orders", params],
    queryFn: () => superAdminCrmService.getOrders(params),
  })
}

// 9. GET /api/superadmin/orders/{id} - Buyurtma tafsiloti
export const useSuperAdminOrderDetail = (id) => {
  return useQuery({
    queryKey: ["superadmin-order-detail", id],
    queryFn: () => superAdminCrmService.getOrderById(id),
    enabled: Boolean(id),
  })
}
