import { useState, useRef } from "react"
import { Button, Input, Label } from "@/shared/ui"
import {
    UserRound,
    Contact,
    KeyRound,
    Eye,
    EyeOff,
    Upload,
} from "lucide-react"
import { toast } from "sonner"

const INITIAL_PROFILE = {
    firstName: "Yashnarbek",
    lastName: "Jumaqulov",
    phone: "+998 90 123-45-67",
    email: "superadmin@gidrogo.uz",
    role: "Bosh Platforma Administratori",
}

const SozlamalarPage = () => {
    const [formData, setFormData] = useState(INITIAL_PROFILE)
    const [avatar, setAvatar] = useState(null)
    const fileInputRef = useRef(null)

    // Parol maydonlari
    const [passwords, setPasswords] = useState({
        current: "",
        newPass: "",
        confirmPass: "",
    })
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        newPass: false,
        confirmPass: false,
    })

    const handleAvatarChange = (e) => {
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

        const reader = new FileReader()
        reader.onloadend = () => {
            setAvatar(reader.result)
            toast.success("Profil rasmi muvaffaqiyatli yuklandi")
        }
        reader.readAsDataURL(file)
    }

    const handleReset = () => {
        setFormData(INITIAL_PROFILE)
        setAvatar(null)
        setPasswords({ current: "", newPass: "", confirmPass: "" })
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        toast.info("O'zgarishlar bekor qilindi")
    }

    const handleSave = () => {
        if (passwords.current || passwords.newPass || passwords.confirmPass) {
            if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
                toast.error("Parolni yangilash uchun barcha parol maydonlarini to'ldiring!")
                return
            }
            if (passwords.newPass.length < 8) {
                toast.error("Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak!")
                return
            }
            if (passwords.newPass !== passwords.confirmPass) {
                toast.error("Yangi parollar bir-biriga mos kelmadi!")
                return
            }
            setPasswords({ current: "", newPass: "", confirmPass: "" })
        }

        toast.success("Sozlamalar muvaffaqiyatli saqlandi!")
    }

    return (
        <section className="pb-16 max-w-5xl">
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
                        <div className="w-full sm:w-44 shrink-0 flex flex-col items-center text-center sm:pr-6 sm:border-r sm:border-slate-100 sm:justify-center">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-slate-200/90 overflow-hidden bg-slate-50 flex items-center justify-center shadow-xs shrink-0 relative group cursor-pointer hover:border-blue-400 transition-colors"
                            >
                                {avatar ? (
                                    <>
                                        <img
                                            src={avatar}
                                            alt="SuperAdmin Avatar"
                                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1 rounded-full">
                                            <Upload className="w-5 h-5 drop-shadow-xs" />
                                            <span className="text-[11px] font-medium drop-shadow-xs">Yuklash</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-slate-100 transition-colors rounded-full">
                                        <UserRound className="w-14 h-14 stroke-[1.5] text-slate-400 group-hover:text-slate-500 transition-colors" />
                                    </div>
                                )}
                            </div>

                            {/* Button: Faqat "Yuklash" */}
                            <div className="mt-3.5 flex justify-center w-full">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5"
                                >
                                    <Upload className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Yuklash</span>
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            <p className="text-[11px] text-slate-400 mt-2 font-normal text-center whitespace-nowrap">
                                PNG, JPG yoki WEBP • Maks. 5 MB
                            </p>
                        </div>

                        {/* RIGHT: Profile Form Fields (To'g'ri type'lar bilan) */}
                        <div className="flex-1 w-full space-y-4 sm:space-y-4.5 sm:pl-2">
                            {/* Row 1: Ism & Familiya */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="firstName" className="text-xs font-semibold text-slate-700">
                                        Ism
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Yashnarbek"
                                        value={formData.firstName ?? "Yashnarbek"}
                                        onChange={(e) => setFormData(d => ({ ...d, firstName: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 text-slate-900 text-sm font-medium focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="lastName" className="text-xs font-semibold text-slate-700">
                                        Familiya
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Jumaqulov"
                                        value={formData.lastName ?? "Jumaqulov"}
                                        onChange={(e) => setFormData(d => ({ ...d, lastName: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 text-slate-900 text-sm font-medium focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Telefon & Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                                        Telefon
                                    </Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+998 90 123-45-67"
                                        value={formData.phone ?? "+998 90 123-45-67"}
                                        onChange={(e) => setFormData(d => ({ ...d, phone: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 text-slate-900 text-sm font-medium focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="superadmin@gidrogo.uz"
                                        value={formData.email ?? "superadmin@gidrogo.uz"}
                                        onChange={(e) => setFormData(d => ({ ...d, email: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 text-slate-900 text-sm font-medium focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/15"
                                    />
                                </div>
                            </div>

                            {/* Row 3: Lavozim (Boshqa inputlar bilan bir xil 50% kenglikda) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold text-slate-700">
                                        Lavozim
                                    </Label>
                                    <div className="h-10 rounded-xl bg-slate-50 border border-slate-200 px-3.5 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-700 select-none">
                                        <span className="whitespace-nowrap">
                                            {formData.role || "Bosh Platforma Administratori"}
                                        </span>
                                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md shrink-0 ml-2">
                                            O'zgarmas
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. XAVFSIZLIK VA PAROLNI YANGILASH CARD (Ixcham, kaltaroq va to'g'ri joylashuvda) */}
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

                    {/* Password Form: Butun ekranga yoyilib ketmaydigan, ixcham kaltaroq shaklda */}
                    <div className="pt-6 max-w-xl space-y-4">
                        {/* 1. Joriy parol (Yangi parol bilan bir xil 50% kaltaroq kenglikda) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="currentPass" className="text-xs font-semibold text-slate-700">
                                    Joriy parol
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="currentPass"
                                        type={showPasswords.current ? "text" : "password"}
                                        autoComplete="current-password"
                                        placeholder="Joriy parolingizni kiriting"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 pr-10 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(s => ({ ...s, current: !s.current }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* 2. Yangi parol va 3. Yangi parolni tasdiqlash (Yonma-yon, kaltaroq va ixcham) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="newPass" className="text-xs font-semibold text-slate-700">
                                    Yangi parol
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="newPass"
                                        type={showPasswords.newPass ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Kamida 8 ta belgi"
                                        value={passwords.newPass}
                                        onChange={(e) => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 pr-10 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(s => ({ ...s, newPass: !s.newPass }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPasswords.newPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPass" className="text-xs font-semibold text-slate-700">
                                    Yangi parolni tasdiqlash
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPass"
                                        type={showPasswords.confirmPass ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder="Parolni qayta kiriting"
                                        value={passwords.confirmPass}
                                        onChange={(e) => setPasswords(p => ({ ...p, confirmPass: e.target.value }))}
                                        className="h-10 rounded-xl bg-white border-slate-200 pr-10 text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(s => ({ ...s, confirmPass: !s.confirmPass }))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                    >
                                        {showPasswords.confirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-[11px] text-slate-500 pt-1 leading-relaxed">
                            Parol kamida 8 ta belgi, bosh harf va raqamlarni o'z ichiga olishi lozim.
                        </p>
                    </div>

                    {/* Card Footer: O'ng tomon tagida Bekor qilish va Saqlash tugmalari */}
                    <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReset}
                            className="h-10 px-4 rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-medium cursor-pointer shadow-2xs transition-colors"
                        >
                            Bekor qilish
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSave}
                            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-xs transition-colors"
                        >
                            Saqlash
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SozlamalarPage;
