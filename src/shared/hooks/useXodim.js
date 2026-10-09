import bossXodimlarService from "@/services/boss.xodimlar.service";
import { useQuery } from "@tanstack/react-query";
export const useStaff = () => {
    return useQuery({
        queryKey: ['staff',payload],
        queryFn: () => {
            return bossXodimlarService.getXodim(payload)
        }
    })
}