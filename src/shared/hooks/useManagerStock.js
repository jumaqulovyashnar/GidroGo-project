import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import managerStockService from "@/services/manager.stock.service";

// 1. GET /api/manager/stock/warehouse - Fermaning ombordagi zaxirasi
export const useManagerStockWarehouse = (options = {}) => {
  return useQuery({
    queryKey: ["manager-stock-warehouse"],
    queryFn: () => managerStockService.getWarehouseStock(),
    staleTime: 1000 * 60 * 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. PUT /api/manager/stock/warehouse - Ombordagi zaxirani yangilash
export const useManagerUpdateStockWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => managerStockService.updateWarehouseStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-stock-warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

// 3. PUT /api/manager/stock/vehicle - Mashina zaxirasini qo'lda o'zgartirish
export const useManagerUpdateStockVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => managerStockService.updateVehicleStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-stock-warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["manager-couriers"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

export default useManagerStockWarehouse;
