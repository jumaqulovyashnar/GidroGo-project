const handleApiError = (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.message || error?.message || "Noma'lum xatolik yuz berdi"

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

    return message
}

export { handleApiError }
export default handleApiError