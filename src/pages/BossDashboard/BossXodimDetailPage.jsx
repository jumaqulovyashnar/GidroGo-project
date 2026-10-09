import React, { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import {
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Building2,
  Truck,
  Briefcase,
  Hash
} from "lucide-react"
import { toast } from "sonner"
import { Card, Switch, Button } from "@/shared/ui"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/shared/ui/breadcrumb"
import { useStaff } from "@/shared"

export function BossXodimDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError, refetch, updateStaffStatus, isUpdatingStatus } = useStaff()

  // Xodimlar ro'yxati
  const rawList = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }, [data])

  // Joriy xodimni ID bo'yicha topish
  const employee = useMemo(() => {
    return rawList.find((item) => String(item.id) === String(id))
  }, [rawList, id])

  const isBlocked =
    employee?.status === "BLOCKED" ||
    employee?.status === "blocked" ||
    employee?.status === "INACTIVE"

  const isActive = !isBlocked

  // Holatni Switch orqali o'zgartirish
  const handleStatusChange = (val) => {
    if (!employee) return
    const nextStatus = val ? "ACTIVE" : "BLOCKED"

    updateStaffStatus(
      { id: employee.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            val
              ? `${employee.fullName || employee.name} hisobi muvaffaqiyatli faollashtirildi!`
              : `${employee.fullName || employee.name} hisobi bloklandi!`
          )
        },
        onError: (err) => {
          toast.error(err.message || "Holatni o'zgartirishda xatolik yuz berdi!")
        },
      }
    )
  }

  // Sana formatlash (kun.oy.yil, soat:daqiqa)
  const formattedDate = useMemo(() => {
    if (!employee?.createdAt) return "Mavjud emas"
    try {
      const d = new Date(employee.createdAt)
      const day = String(d.getDate()).padStart(2, "0")
      const month = String(d.getMonth() + 1).padStart(2, "0")
      const year = d.getFullYear()
      const hours = String(d.getHours()).padStart(2, "0")
      const minutes = String(d.getMinutes()).padStart(2, "0")
      return `${day}.${month}.${year}, ${hours}:${minutes}`
    } catch {
      return employee.createdAt
    }
  }, [employee])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-20 flex flex-col items-center justify-center gap-4 bg-white border border-slate-200/80 rounded-2xl animate-pulse">
        <div className="size-10 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Xodim ma'lumotlari yuklanmoqda...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center bg-white border border-rose-200 rounded-2xl space-y-4">
        <div className="size-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
          <User className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Xatolik yuz berdi</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Xodim ma'lumotlarini yuklashda xatolik yuz berdi. Iltimos qayta urinib ko'ring.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="cursor-pointer">
          Qayta urinish
        </Button>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-6 text-center bg-white border border-slate-200 rounded-2xl space-y-4">
        <div className="size-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <User className="size-7" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900">Xodim topilmadi</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Ushbu identifikatorga ega xodim tizimda mavjud emas yoki o'chirilgan (ID: #{id}).
          </p>
        </div>
        <Link
          to="/boss/xodimlar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          <span>Xodimlar ro'yxatiga qaytish</span>
        </Link>
      </div>
    )
  }

  const isManager = employee.role === "MANAGER"
  const roleName = isManager ? "Menejer" : "Dastavkachi"

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 0. Breadcrumb Navigatsiyasi */}
      <div>
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="capitalize decoration-blue-500 text-slate-500 hover:text-blue-600 text-xs sm:text-sm"
                render={<Link to="/boss" />}
              >
                Bosh sahifa
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                className="capitalize decoration-blue-500 text-slate-500 hover:text-blue-600 text-xs sm:text-sm"
                render={<Link to="/boss/xodimlar" />}
              >
                Xodimlar
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-blue-600 font-semibold text-xs sm:text-sm">
                {employee.fullName || employee.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* 1. Header Blok: Sarlavha */}
      <div className="pb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {employee.fullName || employee.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Xodimning to'liq profili, tizimdagi faoliyati va shaxsiy ma'lumotlari.
        </p>
      </div>

      {/* 2. Asosiy Profil Kartasi */}
      <Card className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {employee.fullName || employee.name}
              </h2>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                {isManager ? (
                  <Briefcase className="size-3.5 text-blue-600" />
                ) : (
                  <Truck className="size-3.5 text-blue-600" />
                )}
                <span>{roleName}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Tizimga kirish akkaunti:{" "}
              <span className="font-mono font-bold text-slate-800">{employee.phone || "—"}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-mono border border-slate-200/60">
              ID: #{employee.id}
            </span>
          </div>
        </div>

        {/* Pastki qism: Ro'yxatdan o'tgan sana va Switch holat */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 text-xs sm:text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-slate-400" />
            <span>
              Ro'yxatdan o'tgan:{" "}
              <strong className="text-slate-900 font-semibold">{formattedDate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-slate-500">Xodim holati:</span>
            <Switch
              aria-label="Xodim holatini o'zgartirish"
              checked={Boolean(isActive)}
              disabled={isUpdatingStatus}
              onCheckedChange={handleStatusChange}
            />
            <span
              className={`text-xs font-bold select-none ${
                isActive ? "text-blue-600" : "text-rose-500"
              }`}
            >
              {isUpdatingStatus ? "O'zgarmoqda..." : isActive ? "Faol" : "Bloklangan"}
            </span>
          </div>
        </div>
      </Card>

      {/* 3. 4 ta Parametr Kartochkasi (Soxta badge va izohlarsiz, toza qiymatlar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Karta 1: Xodim ID */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Xodim ID (id)
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Hash className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            #{employee.id}
          </div>
        </Card>

        {/* Karta 2: Telefon Raqami */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Telefon Raqami (phone)
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono truncate">
            {employee.phone || "—"}
          </div>
        </Card>

        {/* Karta 3: Tizimdagi Roli */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tizimdagi Roli (role)
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {roleName}
          </div>
        </Card>

        {/* Karta 4: Biriktirilgan Ferma */}
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Biriktirilgan Ferma (farmId)
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            #{employee.farmId || "—"}
          </div>
        </Card>
      </div>
    </div>
  )
}
export default BossXodimDetailPage;
