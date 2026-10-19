import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { superAdminService } from "@/services"

export const useSuperAdminDashboard = () => {
  return useQuery({
    queryKey: ["superadmin-dashboard"],
    queryFn: () => superAdminService.getDashboard(),
  })
}

export const useRegionalStatistics = (params = {}) => {
  return useQuery({
    queryKey: ["regional-statistics", params],
    queryFn: () => superAdminService.getRegionalStatistics(params),
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

export const useSuperAdminProfile = (options = {}) => {
  return useQuery({
    queryKey: ["superadmin-profile"],
    queryFn: () => superAdminService.getProfile(),
    ...options,
  })
}

export const useUpdateSuperAdminProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => superAdminService.updateProfile(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["superadmin-profile"], (old) => {
        if (!data) return old
        if (old?.data && data?.data) return { ...old, data: { ...old.data, ...data.data } }
        return { ...(old || {}), ...data }
      })
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
