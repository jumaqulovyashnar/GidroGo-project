import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import managerProductsService from "@/services/manager.products.service";

// 1. GET /api/manager/products - Fermaning barcha mahsulotlari
export const useManagerProducts = (params = {}, options = {}) => {
  return useQuery({
    queryKey: ["manager-products", params],
    queryFn: () => managerProductsService.getProducts(params),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    ...options,
  });
};

// 2. POST /api/manager/products - Yangi mahsulot qo'shish va narx belgilash
export const useManagerCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => managerProductsService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-products"] });
      queryClient.invalidateQueries({ queryKey: ["manager-stock-warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

// 3. PUT /api/manager/products/{id} - Mahsulot narxi yoki parametrlarini o'zgartirish
export const useManagerUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => managerProductsService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager-products"] });
      queryClient.invalidateQueries({ queryKey: ["manager-stock-warehouse"] });
      queryClient.invalidateQueries({ queryKey: ["manager-dashboard"] });
    },
  });
};

export default useManagerProducts;
