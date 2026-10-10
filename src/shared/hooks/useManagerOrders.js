import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import managerOrdersService from "@/services/manager.orders.service";

// 1. GET /api/manager/orders - Fermaning buyurtmalari ro'yxati (default: FAQAT BUGUNGI buyurtmalar)
export const useManagerOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-orders", params],
    queryFn: () => managerOrdersService.getOrders(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. GET /api/manager/orders/today - Faqat bugungi buyurtmalar ro'yxati
export const useManagerTodayOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-orders-today", params],
    queryFn: () => managerOrdersService.getTodayOrders(params),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 3. GET /api/manager/orders/all - Barcha buyurtmalar ro'yxati (tarixiy)
export const useManagerAllOrders = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-orders-all", params],
    queryFn: () => managerOrdersService.getAllOrders(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 4. GET /api/manager/orders/{id} - Bitta buyurtmaning to'liq ma'lumotlari (Detail API)
export const useManagerOrderDetail = (id, options = {}) => {
  return useQuery({
    queryKey: ["manager-order-detail", id],
    queryFn: () => managerOrdersService.getOrderById(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 5. POST /api/manager/orders - Menejer tomonidan yangi buyurtma kiritish (Manual Order Create)
export const useManagerCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => managerOrdersService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-orders"] });
      queryClient.invalidateQueries({ queryKey: ["manager-orders-today"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

// 6. POST /api/manager/orders/{id}/reassign - Buyurtmani boshqa dastavkachiga qayta biriktirish
export const useManagerReassignOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => managerOrdersService.reassignOrder(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["manager-orders"] });
      queryClient.invalidateQueries({ queryKey: ["manager-orders-today"] });
      queryClient.invalidateQueries({ queryKey: ["manager-order-detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

// 7. POST /api/manager/orders/{id}/retry-dispatch - PREPARING buyurtmani darhol qayta taqsimlash navbatiga qo'yish
export const useManagerRetryDispatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => managerOrdersService.retryDispatchOrder(id),
    onSuccess: (_res, id) => {
      queryClient.invalidateQueries({ queryKey: ["manager-orders"] });
      queryClient.invalidateQueries({ queryKey: ["manager-orders-today"] });
      queryClient.invalidateQueries({ queryKey: ["manager-order-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

// 8. POST /api/manager/orders/{id}/assign - Buyurtmaga kuryer biriktirish
export const useManagerAssignOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => managerOrdersService.assignOrder(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["manager-orders"] });
      queryClient.invalidateQueries({ queryKey: ["manager-orders-today"] });
      queryClient.invalidateQueries({ queryKey: ["manager-order-detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

// 9. PATCH /api/manager/orders/{id}/status - Buyurtma holatini o'zgartirish
export const useManagerUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => managerOrdersService.updateOrderStatus(id, data),
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["manager-orders"] });
      queryClient.invalidateQueries({ queryKey: ["manager-orders-today"] });
      queryClient.invalidateQueries({ queryKey: ["manager-order-detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

export default useManagerOrders;
