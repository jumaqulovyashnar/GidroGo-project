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

export const useAuditLogs = (params) => {
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

export const useDailyDynamics = (params) => {
  return useQuery({
    queryKey: ["daily-dynamics", params],
    queryFn: () => superAdminService.getDailyDynamics(params),
  })
}

