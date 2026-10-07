import { api } from "@/shared"
import handleApiError from "@/shared/lib/handleError"

class FileUploadService {
    async uploadFile(upload) {
        try {
            let body = upload
            if (upload instanceof File || upload instanceof Blob) {
                const formData = new FormData()
                formData.append("file", upload)
                body = formData
            }
            const response = await api.post("/files/upload", body)
            return response.data
        }
        catch (error) {
            throw new Error(handleApiError(error))
        }
    }
    async viewFile(year, month, day, fileName) {
        try {
            const response = await api.get(`/files/view/${year}/${month}/${day}/${fileName}`)
            return response.data
        }
        catch (error) {
            throw new Error(handleApiError(error))
        }
    }
}

export const fileUploadService = new FileUploadService();