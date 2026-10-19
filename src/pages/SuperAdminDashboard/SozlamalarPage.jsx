import { useState, useRef, useEffect, useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button, Input, Label, Spinner } from "@/shared/ui"
import { UserRound, Contact, KeyRound, Eye, EyeOff, Upload, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import {
    useSuperAdminProfile,
    useUpdateSuperAdminProfile,
    useSuperAdminChangePassword,
    useUploadFile,
} from "@/shared/hooks"
import { useUserStore } from "@/store"
import { cn, NAME_REGEX, PHONE_REGEX, EMAIL_REGEX, PASSWORD_STRONG_REGEX, resolveFileUrl, formatPhoneInput, cleanPhoneForBackend } from "@/shared/lib"

const settingsSchema = z
    .object({
        firstName: z
            .string()
            .trim()
            .min(1, "Ismni kiriting")
            .regex(NAME_REGEX, "Ism faqat harflardan iborat bo'lishi kerak"),
        lastName: z
            .string()
            .trim()
            .min(1, "Familiyani kiriting")
            .regex(NAME_REGEX, "Familiya faqat harflardan iborat bo'lishi kerak"),
        phone: z
            .string()
            .trim()
            .transform((val) => formatPhoneInput(val))
            .refine((val) => PHONE_REGEX.test(val), {
                message: "Telefon raqamini to'g'ri formatda kiriting (Masalan: +998901234567)",
            }),
        email: z
            .string()
            .trim()
            .refine(
                (val) => !val || EMAIL_REGEX.test(val),
                { message: "E-mail manzilini to'g'ri kiriting (Masalan: info@gidrogo.uz)" }
            ),
        role: z.string().optional().default("Bosh Platforma Administratori"),
        currentPassword: z.string().optional().default(""),
        newPassword: z.string().optional().default(""),
        confirmPassword: z.string().optional().default(""),
    })
    .superRefine((data, ctx) => {
        const hasPasswordInput = Boolean(
            data.currentPassword || data.newPassword || data.confirmPassword
        )
        if (hasPasswordInput) {
            if (!data.currentPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["currentPassword"],
                    message: "Joriy parolingizni kiriting",
                })
            }
            if (!data.newPassword || !PASSWORD_STRONG_REGEX.test(data.newPassword)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["newPassword"],
                    message: "Yangi parol kamida 8 ta belgi, harf va raqamlardan iborat bo'lishi kerak",
                })
            }
            if (data.newPassword !== data.confirmPassword) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["confirmPassword"],
                    message: "Yangi parollar bir-biriga mos kelmadi",
                })
            }
        }
    })

const SozlamalarPage = () => {
    const queryClient = useQueryClient()
    const { data: rawProfile, isLoading: isProfileLoading, isError, error, refetch } = useSuperAdminProfile()
    const updateProfileMutation = useUpdateSuperAdminProfile()
    const changePasswordMutation = useSuperAdminChangePassword()
    const uploadMutation = useUploadFile()
    const currentUser = useUserStore((state) => state.userInfo)

    const profile = rawProfile?.data || rawProfile

    const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatarUrl || null)
    const [savedAvatarUrl, setSavedAvatarUrl] = useState(currentUser?.avatarUrl || "")
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [isProfileSaving, setIsProfileSaving] = useState(false)
    const [isPasswordSaving, setIsPasswordSaving] = useState(false)
    const fileInputRef = useRef(null)

    // Parol ko'rsatish/yashirish holatlari
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        newPass: false,
        confirmPass: false,
    })

    const initialFormValues = useMemo(() => {
        const nameParts = (currentUser?.name || "").trim().split(/\s+/)
        return {
            firstName: currentUser?.firstName || nameParts[0] || "",
            lastName: currentUser?.lastName || nameParts.slice(1).join(" ") || "",
            phone: formatPhoneInput(currentUser?.phone || "+998"),
            email: currentUser?.email || "",
            role: currentUser?.roleLabel || currentUser?.role || "Bosh Platforma Administratori",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        }
    }, [currentUser])

    const {
        register,
        handleSubmit,
        reset,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialFormValues,
        mode: "onBlur",
    })

    const watchedRole = watch("role")
    const watchedFirstName = watch("firstName")
    const watchedLastName = watch("lastName")
    const [hasImageError, setHasImageError] = useState(false)

    const userInitials = useMemo(() => {
        const first = (watchedFirstName || "").trim().charAt(0).toUpperCase()
        const last = (watchedLastName || "").trim().charAt(0).toUpperCase()
        if (first && last) return `${first}${last}`
        if (first) return first
        return "SA"
    }, [watchedFirstName, watchedLastName])

    // Serverdan profil kelganda formani to'ldirish
    useEffect(() => {
        if (profile) {
            const fullNameParts = (profile.fullName || "").trim().split(/\s+/)
            const fName = profile.firstName || fullNameParts[0] || currentUser?.firstName || ""
            const lName = profile.lastName || fullNameParts.slice(1).join(" ") || currentUser?.lastName || ""
            const phone = formatPhoneInput(profile.phone || currentUser?.phone || "+998")
            const email = profile.email || currentUser?.email || ""
            const role = profile.roleTitle || profile.role || currentUser?.roleLabel || "Bosh Platforma Administratori"

            reset({
                firstName: fName,
                lastName: lName,
                phone: phone,
                email: email,
                role: role,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            const avatar = profile.avatarUrl || currentUser?.avatarUrl || null
            if (avatar) {
                setAvatarPreview(avatar)
                setSavedAvatarUrl(avatar)
                setHasImageError(false)
            }
            if (currentUser && profile?.avatarUrl && currentUser.avatarUrl !== profile.avatarUrl) {
                useUserStore.getState().actions.setUserInfo({
                    ...currentUser,
                    avatarUrl: profile.avatarUrl,
                })
            }
        }
    }, [profile, currentUser, reset])

    const isSaving =
        updateProfileMutation.isPending ||
        changePasswordMutation.isPending ||
        uploadMutation.isPending ||
        isUploadingAvatar ||
        isProfileSaving ||
        isPasswordSaving

    // 1. Rasmni tanlash bilanoq avtomatik serverga yuklash va profilni yangilash (Senior UX)
    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Rasm hajmi 5 MB dan oshmasligi kerak!")
            return
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Faqat rasm fayllari (PNG, JPG, WEBP) qabul qilinadi!")
            return
        }

        setIsUploadingAvatar(true)
        const localPreview = URL.createObjectURL(file)
        setAvatarPreview(localPreview)
        setHasImageError(false)

        try {
            // A) Rasmni backendga yuklash (POST /api/files/upload)
            const res = await uploadMutation.mutateAsync(file)
            const uploadedUrl =
                res?.data?.url ||
                res?.data?.path ||
                res?.url ||
                res?.path ||
                (typeof res?.data === "string" ? res.data : "")

            if (!uploadedUrl) {
                throw new Error("Serverdan rasm manzili qaytmadi")
            }

            // B) Profilga yangi rasm manzilini biriktirish (PUT /api/superadmin/profile)
            const currentProfile = profile || {}
            const fName = (watch("firstName") || currentProfile.firstName || currentUser?.firstName || "").trim()
            const lName = (watch("lastName") || currentProfile.lastName || currentUser?.lastName || "").trim()
            const phone = cleanPhoneForBackend(watch("phone")) || currentProfile.phone || currentUser?.phone || ""
            const email = (watch("email") || currentProfile.email || currentUser?.email || "").trim()

            const profilePayload = {
                firstName: fName,
                lastName: lName,
                fullName: `${fName} ${lName}`.trim(),
                phone: phone,
                email: email,
                avatarUrl: uploadedUrl,
            }

            const updated = await updateProfileMutation.mutateAsync(profilePayload)
            const updatedData = updated?.data || updated || profilePayload

            // C) Zustand store va Header'ni zudlik bilan sinxronlash
            const curUser = useUserStore.getState().userInfo
            if (curUser) {
                useUserStore.getState().actions.setUserInfo({
                    ...curUser,
                    avatarUrl: uploadedUrl,
                })
            }

            // D) React Query keshini yangilash (Header komponentidagi rasm shu zahoti o'zgaradi)
            queryClient.setQueryData(["superadmin-profile"], (old) => {
                if (!old) return { data: updatedData }
                if (old.data) return { ...old, data: { ...old.data, ...updatedData } }
                return { ...old, ...updatedData }
            })
            queryClient.invalidateQueries({ queryKey: ["superadmin-profile"] })

            setSavedAvatarUrl(uploadedUrl)
            setAvatarPreview(uploadedUrl)
            toast.success("Profil rasmi muvaffaqiyatli yangilandi!")
        } catch (err) {
            setAvatarPreview(savedAvatarUrl || profile?.avatarUrl || currentUser?.avatarUrl || null)
            toast.error("Rasmni yuklashda xatolik: " + (err?.message || "Serverga yuklanmadi"))
        } finally {
            setIsUploadingAvatar(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    // 2. Shaxsiy ma'lumotlarni saqlash (Ism, Familiya, Telefon, Email)
    const handleSaveProfile = async () => {
        const isValid = await trigger(["firstName", "lastName", "phone", "email"])
        if (!isValid) return

        setIsProfileSaving(true)
        try {
            const values = watch()
            const fName = (values.firstName || "").trim()
            const lName = (values.lastName || "").trim()
            const phone = cleanPhoneForBackend(values.phone) || formatPhoneInput(values.phone)
            const email = (values.email || "").trim()

            const profilePayload = {
                firstName: fName,
                lastName: lName,
                fullName: `${fName} ${lName}`.trim(),
                phone: phone,
                email: email,
                avatarUrl: savedAvatarUrl || "",
            }

            const updated = await updateProfileMutation.mutateAsync(profilePayload)
            const updatedData = updated?.data || updated || profilePayload

            const curUser = useUserStore.getState().userInfo
            if (curUser) {
                useUserStore.getState().actions.setUserInfo({
                    ...curUser,
                    firstName: updatedData.firstName || profilePayload.firstName,
                    lastName: updatedData.lastName || profilePayload.lastName,
                    fullName: updatedData.fullName || profilePayload.fullName,
                    phone: updatedData.phone || profilePayload.phone,
                    email: updatedData.email || profilePayload.email,
                    avatarUrl: updatedData.avatarUrl || profilePayload.avatarUrl,
                })
            }

            queryClient.setQueryData(["superadmin-profile"], (old) => {
                if (!old) return { data: updatedData }
                if (old.data) return { ...old, data: { ...old.data, ...updatedData } }
                return { ...old, ...updatedData }
            })
            queryClient.invalidateQueries({ queryKey: ["superadmin-profile"] })

            toast.success("Profil ma'lumotlari muvaffaqiyatli saqlandi!")
        } catch (error) {
            toast.error(error?.message || "Profilni saqlashda xatolik yuz berdi")
        } finally {
            setIsProfileSaving(false)
        }
    }

    // 4. Parolni yangilash
    const handleSavePassword = async () => {
        const currentPassword = watch("currentPassword")
        const newPassword = watch("newPassword")
        const confirmPassword = watch("confirmPassword")

        if (!currentPassword) {
            toast.error("Joriy parolingizni kiriting")
            return
        }
        if (!newPassword) {
            toast.error("Yangi parolni kiriting")
            return
        }
        if (!PASSWORD_STRONG_REGEX.test(newPassword)) {
            toast.error("Yangi parol kamida 8 ta belgi, harf va raqamdan iborat bo'lishi kerak")
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("Yangi parollar bir-biriga mos kelmadi")
            return
        }

        setIsPasswordSaving(true)
        try {
            await changePasswordMutation.mutateAsync({
                currentPassword,
                newPassword,
                confirmPassword,
            })
            reset({
                ...watch(),
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            toast.success("Parol muvaffaqiyatli yangilandi!")
        } catch (error) {
            toast.error(error?.message || "Parolni yangilashda xatolik yuz berdi")
        } finally {
            setIsPasswordSaving(false)
        }
    }

    const handleResetPasswordFields = () => {
        reset({
            ...watch(),
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })
        toast.info("Parol maydonlari tozalandi")
    }

    const onSubmit = async () => {
        await handleSaveProfile()
        const hasPasswordInput = Boolean(
            watch("currentPassword") || watch("newPassword") || watch("confirmPassword")
        )
        if (hasPasswordInput) {
            await handleSavePassword()
        }
    }


    if (isProfileLoading && !profile) {
        return (
            <div className="pb-16 max-w-5xl">
                {/* Page Header: Sarlavha va tavsif */}
                <div className="pb-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        Tizim Sozlamalari
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        SuperAdmin shaxsiy profili, tizim identifikatorlari va hisob xavfsizligini boshqarish.
                    </p>
                </div>

                {/* Skeleton Loading Card */}
                <div className="mt-6 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
                    <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse" />
                        <div className="space-y-1.5">
                            <div className="w-48 h-4 bg-slate-200 rounded-md animate-pulse" />
                            <div className="w-72 h-3 bg-slate-100 rounded-md animate-pulse" />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 sm:gap-8 pt-8">
                        {/* Avatar Skeleton / Pending */}
                        <div className="w-full sm:w-48 shrink-0 flex flex-col items-center text-center sm:pr-6 sm:border-r sm:border-slate-100 sm:justify-center">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center relative aspect-square shadow-xs">
                                <UserRound className="w-14 h-14 text-slate-300 stroke-[1.5]" />
                                <div className="absolute inset-0 flex items-center justify-center bg-white/40 rounded-full">
                                    <Spinner size="sm" />
                                </div>
                            </div>
                            <div className="mt-3.5 w-28 h-9 bg-slate-100 rounded-xl animate-pulse" />
                        </div>

                        {/* Form Skeletons */}
                        <div className="flex-1 w-full space-y-4 sm:space-y-4.5 sm:pl-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-2">
                                    <div className="w-16 h-3 bg-slate-200 rounded-sm animate-pulse" />
                                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-20 h-3 bg-slate-200 rounded-sm animate-pulse" />
                                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-2">
                                    <div className="w-18 h-3 bg-slate-200 rounded-sm animate-pulse" />
                                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                                </div>
                                <div className="space-y-2">
                                    <div className="w-14 h-3 bg-slate-200 rounded-sm animate-pulse" />
                                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-2">
                                    <div className="w-16 h-3 bg-slate-200 rounded-sm animate-pulse" />
                                    <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs">
                        <Spinner size="xs" />
                        <span>Profil ma'lumotlari yuklanmoqda...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (isError && !profile) {
        return (
            <div className="pb-16 max-w-5xl">
                {/* Page Header: Sarlavha va tavsif */}
                <div className="pb-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        Tizim Sozlamalari
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        SuperAdmin shaxsiy profili, tizim identifikatorlari va hisob xavfsizligini boshqarish.
                    </p>
                </div>

                <div className="mt-6 bg-white rounded-2xl border border-rose-200 shadow-xs p-10 flex flex-col items-center justify-center text-center gap-3">
                    <div className="size-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100">
                        <AlertCircle className="size-6" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">Ma'lumotlarni yuklab bo'lmadi</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                        {error?.response?.data?.message || error?.message || "Serverdan profil ma'lumotlarini olishda xatolik yuz berdi."}
                    </p>
                    <Button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-2 h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-2"
                    >
                        <RefreshCw className="size-3.5" />
                        <span>Qayta urinish</span>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="pb-16 max-w-5xl">
            {/* Page Header: Sarlavha va tavsif */}
            <div className="pb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Tizim Sozlamalari
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    SuperAdmin shaxsiy profili, tizim identifikatorlari va hisob xavfsizligini boshqarish.
                </p>
            </div>

            {/* Content Cards */}
            <div className="mt-6 space-y-6">
                {/* 1. SUPERADMIN PROFIL MA'LUMOTLARI CARD */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
                            <Contact className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                                SuperAdmin Profil Ma'lumotlari
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Shaxsiy identifikatsiya, huquq va tizim boshqaruv ma'lumotlari.
                            </p>
                        </div>
                    </div>

                    {/* Layout: Avatar (Left) + Form (Right) */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-stretch gap-6 sm:gap-8 pt-6">
                        {/* LEFT: Avatar Area */}
                        <div className="w-full sm:w-48 shrink-0 flex flex-col items-center text-center sm:pr-6 sm:border-r sm:border-slate-100 sm:justify-center">
                            <div
                                onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center shadow-xs shrink-0 relative group cursor-pointer hover:border-blue-400 transition-colors aspect-square"
                            >
                                {isUploadingAvatar && (
                                    <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center text-blue-600 gap-1 rounded-full z-10">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="text-[10px] font-semibold text-slate-700">Yuklanmoqda...</span>
                                    </div>
                                )}

                                {avatarPreview && !hasImageError ? (
                                    <>
                                        <img
                                            src={resolveFileUrl(avatarPreview)}
                                            alt=""
                                            onError={() => setHasImageError(true)}
                                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 rounded-full">
                                            <Upload className="w-5 h-5 drop-shadow-xs" />
                                            <span className="text-[11px] font-medium drop-shadow-xs">Almashtirish</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-blue-50 text-blue-600 font-bold text-xl sm:text-2xl flex items-center justify-center select-none rounded-full aspect-square border border-blue-100">
                                        {userInitials}
                                    </div>
                                )}
                            </div>

                            {/* Button: Rasm yuklash */}
                            <div className="mt-3.5 flex justify-center w-full">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSaving || isProfileLoading || isUploadingAvatar}
                                    className="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                                >
                                    {isUploadingAvatar ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                    ) : (
                                        <Upload className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    )}
                                    <span className="whitespace-nowrap">
                                        {isUploadingAvatar ? "Yuklanmoqda..." : "Rasm yuklash"}
                                    </span>
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/webp"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 mt-1 font-normal text-center whitespace-nowrap">
                                PNG, JPG yoki WEBP • Maks. 5 MB
                            </p>
                        </div>

                        {/* RIGHT: Profile Form Fields */}
                        <div className="flex-1 w-full space-y-4 sm:space-y-4.5 sm:pl-2">
                            {/* Row 1: Ism & Familiya */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700">
                                        Ism *
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="Ism"
                                        disabled={isProfileLoading || isSaving}
                                        {...register("firstName")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white text-slate-900 text-sm font-medium transition-all",
                                            errors.firstName
                                                ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/15"
                                                : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                        )}
                                    />
                                    {errors.firstName && (
                                        <p className="text-xs text-rose-500 font-medium mt-1">
                                            {errors.firstName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700">
                                        Familiya *
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder="Familiya"
                                        disabled={isProfileLoading || isSaving}
                                        {...register("lastName")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white text-slate-900 text-sm font-medium transition-all",
                                            errors.lastName
                                                ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/15"
                                                : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                        )}
                                    />
                                    {errors.lastName && (
                                        <p className="text-xs text-rose-500 font-medium mt-1">
                                            {errors.lastName.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 2: Telefon & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                                        Telefon *
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        placeholder="+998901234567"
                                        disabled={isProfileLoading || isSaving}
                                        {...register("phone")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white text-slate-900 text-sm font-medium transition-all",
                                            errors.phone
                                                ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/15"
                                                : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                        )}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-rose-500 font-medium mt-1">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="username"
                                        placeholder="Email manzili"
                                        disabled={isProfileLoading || isSaving}
                                        {...register("email")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white text-slate-900 text-sm font-medium transition-all",
                                            errors.email
                                                ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/15"
                                                : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                        )}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-rose-500 font-medium mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Row 3: Lavozim (O'zgarmas badge bilan) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-700">
                                        Lavozim
                                    </Label>
                                    <div className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 select-none">
                                        <span className="whitespace-nowrap">
                                            {watchedRole || "Bosh Platforma Administratori"}
                                        </span>
                                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md shrink-0 ml-2">
                                            O'zgarmas
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 1 Footer: Profil ma'lumotlarini saqlash */}
                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-end">
                        <Button
                            type="button"
                            onClick={handleSaveProfile}
                            disabled={isProfileSaving || isSaving || isUploadingAvatar}
                            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-xs transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            {isProfileSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Ma'lumotlarni saqlash</span>
                        </Button>
                    </div>
                </div>

                {/* 2. XAVFSIZLIK VA PAROLNI YANGILASH CARD */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-7">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/60">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
                                Xavfsizlik va Parolni Yangilash
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Hisob xavfsizligini ta'minlash uchun parolingizni yangilang.
                            </p>
                        </div>
                    </div>

                    {/* Password Form */}
                    <div className="pt-6 max-w-xl space-y-4">
                        {/* 1. Joriy parol */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="currentPassword" className="text-xs font-semibold text-slate-700">
                                    Joriy parol
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="currentPassword"
                                        type={showPasswords.current ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Joriy parolingizni kiriting"
                                        disabled={isSaving}
                                        {...register("currentPassword")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white pr-10 text-sm transition-all",
                                            errors.currentPassword
                                                ? "border-rose-400 focus-visible:border-rose-500"
                                                : "border-slate-200 focus-visible:border-blue-500"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-xs text-rose-500 font-medium mt-1">
                                        {errors.currentPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 2. Yangi parol va 3. Yangi parolni tasdiqlash */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-700">
                                    Yangi parol
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPassword"
                                        type={showPasswords.newPass ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Kamida 8 ta belgi"
                                        disabled={isSaving}
                                        {...register("newPassword")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white pr-10 text-sm transition-all",
                                            errors.newPassword
                                                ? "border-rose-400 focus-visible:border-rose-500"
                                                : "border-slate-200 focus-visible:border-blue-500"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(s => ({ ...s, newPass: !s.newPass }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                                    >
                                        {showPasswords.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-xs text-rose-500 font-medium mt-1">
                                        {errors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">
                                    Yangi parolni tasdiqlash
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showPasswords.confirmPass ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Parolni qayta kiriting"
                                        disabled={isSaving}
                                        {...register("confirmPassword")}
                                        className={cn(
                                            "h-10 rounded-xl bg-white pr-10 text-sm transition-all",
                                            errors.confirmPassword
                                                ? "border-rose-400 focus-visible:border-rose-500"
                                                : "border-slate-200 focus-visible:border-blue-500"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(s => ({ ...s, confirmPass: !s.confirmPass }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                                    >
                                        {showPasswords.confirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-rose-500 font-medium mt-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                            Parol kamida 8 ta belgi, bosh harf va raqamlarni o'z ichiga olishi lozim.
                        </p>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResetPasswordFields}
                            disabled={isPasswordSaving}
                            className="h-10 px-4 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium cursor-pointer shadow-2xs transition-colors disabled:opacity-50"
                        >
                            Tozalash
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSavePassword}
                            disabled={isPasswordSaving}
                            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-xs transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                        >
                            {isPasswordSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>Parolni yangilash</span>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default SozlamalarPage;
