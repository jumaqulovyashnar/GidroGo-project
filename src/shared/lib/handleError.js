const handleApiError = (error) => {
    // 1. Agar backenddan aniq xabar kelgan bo'lsa, har doim birinchi navbatda shuni qaytaramiz
    const serverMessage = error?.response?.data?.message
    if (typeof serverMessage === "string" && serverMessage.trim().length > 0) {
        return serverMessage.trim()
    }

    const status = error?.response?.status

    if (status === 400) {
        return "Noto'g'ri so'rov yuborildi"
    }

    if (status === 401) {
        return "Avtorizatsiya muddati tugagan"
    }

    if (status === 403) {
        return "Ruxsat berilmagan"
    }

    if (status === 404) {
        return "Ma'lumot topilmadi"
    }

    if (status === 409) {
        return "Ma'lumot allaqachon mavjud"
    }

    if (status === 422) {
        return "Yuborilgan ma'lumotlar noto‘g‘ri"
    }

    if (status === 429) {
        return "Juda ko‘p so‘rov yuborildi. Birozdan keyin urinib ko‘ring"
    }

    if (status >= 500) {
        return "Serverda xatolik yuz berdi"
    }

    return error?.message || "Noma'lum xatolik yuz berdi"
}

export { handleApiError }
export default handleApiError