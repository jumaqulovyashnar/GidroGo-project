import { useMutation, useQuery } from "@tanstack/react-query";
import { fileUploadService } from "@/services";

export const useViewFile = (year, month, day, fileName) => {
    return useQuery({
        queryKey: ['file', year, month, day, fileName],
        queryFn: () => {
            return fileUploadService.viewFile(year, month, day, fileName);
        },
        enabled: !!year && !!month && !!day && !!fileName,
    })
}
export const useUploadFile = () => {
    return useMutation({
        mutationKey: ['upload'],
        mutationFn: (upload) => {
            return fileUploadService.uploadFile(upload)
        }
    })
}

export const useUpload = useUploadFile;
export default useUpload;