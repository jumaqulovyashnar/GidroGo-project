import { useQuery, useMutation } from "@tanstack/react-query"
import { clientService } from "@/services"

// 1. GET /api/client/banners - Faol promo aksiyalar va slayder bannerlari
export const useClientBanners = () => {
  return useQuery({
    queryKey: ["client-banners"],
    queryFn: () => clientService.getBanners(),
    staleTime: 1000 * 60 * 10, // 10 daqiqa
  })
}

// 2. POST /api/client/cart/quote - Savatdagi mahsulotlar va tara to'lovini hisoblash
export const useCartQuote = () => {
  return useMutation({
    mutationFn: (data) => clientService.calculateCartQuote(data),
  })
}

// 3. GET /api/client/bottles - Mijozning fermalar bo'yicha idish balanslari ro'yxati
export const useClientBottles = () => {
  return useQuery({
    queryKey: ["client-bottles"],
    queryFn: () => clientService.getBottles(),
    staleTime: 1000 * 60 * 5,
  })
}
