import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { superAdminService } from "@/services"

export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: ["superadmin-dashboard"],
    queryFn: () => superAdminService.getDashboard(),
  })
}

export const useRegionalStatistics = () => {
  return useQuery({
    queryKey: ["regional-statistics"],
    queryFn: () => superAdminService.getRegionalStatistics(),
  })
}

// Holatlar bo'yicha buyurtmalar soni
export const useOrdersByStatusStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["orders-by-status-statistics", params],
    queryFn: () => superAdminService.getOrdersByStatusStatistics(params),
  })
}

// O'sish seriyasi: yangi mijozlar, faol mijozlar, buyurtmalar, yangi fermalar
export const useGrowthStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["growth-statistics", params],
    queryFn: () => superAdminService.getGrowthStatistics(params),
  })
}

export const useAuditLogs = (params = {}) => {
  return useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => superAdminService.getAuditLogs(params),
  })
}

export const useSuperAdminProfile = () => {
  return useQuery({
    queryKey: ["superadmin-profile"],
    queryFn: () => superAdminService.getProfile(),
  })
}

export const useUpdateSuperAdminProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => superAdminService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superadmin-profile"] })
    },
  })
}

export const useSuperAdminChangePassword = () => {
  return useMutation({
    mutationFn: (data) => superAdminService.changePassword(data),
  })
}

export const useDailyDynamics = (params = {}) => {
  return useQuery({
    queryKey: ["daily-dynamics", params],
    queryFn: () => superAdminService.getDailyDynamics(params),
  })
}

// Ferma analitikasi: tushum, tara, xarajat, foyda va h.k.
export const useFarmAnalytics = (id, params = {}) => {
  return useQuery({
    queryKey: ["farm-analytics", id, params],
    queryFn: () => superAdminService.getFarmAnalytics(id, params),
    enabled: Boolean(id),
  })
}
