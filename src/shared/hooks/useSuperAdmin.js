import { useQuery } from "@tanstack/react-query"
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
