import React, { useState, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  User,
  Phone,
  ShieldCheck,
  Calendar,
  Building2,
  Truck,
  Briefcase,
  Hash,
  Trash2,
  Car,
  Pencil,
  MessageSquare,
} from "lucide-react"
import { toast } from "sonner"
import { Card, Switch, DeleteXodimModal } from "@/shared/ui"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/shared/ui/breadcrumb"
import { useStaff, useStaffDetail, useManagerFeedback } from "@/shared/hooks"
import { EditVehicleModal } from "@/components"

export function BossXodimDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    data,
    isLoading: isListLoading,
    updateStaffStatus,
    isUpdatingStatus,
    deleteStaff,
    isDeleting,
  } = useStaff()

  const { data: staffDetailRes, isLoading: isDetailLoading } = useStaffDetail(id)
  const isLoading = isDetailLoading && isListLoading

  const rawList = useMemo(() => {
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data)) return data
    return []
  }, [data])

  const employee = useMemo(() => {
    if (staffDetailRes?.data) return staffDetailRes.data
    if (staffDetailRes && typeof staffDetailRes === "object" && !Array.isArray(staffDetailRes) && staffDetailRes.id) return staffDetailRes
    return rawList.find((item) => String(item.id) === String(id))
  }, [staffDetailRes, rawList, id])

  const isBlocked =
    employee?.status === "BLOCKED" ||
    employee?.status === "blocked" ||
    employee?.status === "INACTIVE"

  const isActive = !isBlocked

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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false)

  const handleDeleteEmployee = () => {
    if (isDeleting || !employee) return
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!employee || isDeleting) return
    deleteStaff(employee.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false)
        navigate("/boss/xodimlar")
      },
    })
  }

  const { data: feedbackRes } = useManagerFeedback()
  const allFeedback = useMemo(() => {
    const raw = feedbackRes?.data?.content || feedbackRes?.data || (Array.isArray(feedbackRes) ? feedbackRes : [])
    return Array.isArray(raw) ? raw : []
  }, [feedbackRes])

  const courierFeedback = useMemo(() => {
    if (!employee) return []
    const empName = (employee.fullName || employee.name || "").toLowerCase()
    return allFeedback.filter((item) => {
      const msg = (item.message || "").toLowerCase()
      const author = (item.authorName || "").toLowerCase()
      return item.category === "COURIER" || msg.includes(empName) || author.includes(empName)
    })
  }, [allFeedback, employee])

  const formattedDate = useMemo(() => {
    if (!employee?.createdAt) return "Mavjud emas"
    try {
      return new Date(employee.createdAt).toLocaleDateString("uz-UZ", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return String(employee.createdAt)
    }
  }, [employee?.createdAt])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3 text-slate-500">
        <div className="size-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Xodim ma'lumotlari yuklanmoqda...</p>
      </div>
    )
  }

  if (!employee && !isLoading) {
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

      <div className="pb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {employee.fullName || employee.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Xodimning to'liq profili, tizimdagi faoliyati, transporti va mijozlar sharhlari.
        </p>
      </div>

      {/* Profil asosiy kartasi */}
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
              {employee.shiftType && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  <span>Smena: {employee.shiftType}</span>
                </span>
              )}
              {!isManager && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                    employee.online
                      ? "bg-blue-50 text-blue-700 border-blue-200"
                      : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}
                >
                  <span className={`size-2 rounded-full ${employee.online ? "bg-blue-600" : "bg-slate-400"}`} />
                  <span>{employee.online ? "Liniyada (Online)" : "Oflayn"}</span>
                </span>
              )}
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
            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDeleteEmployee}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold border border-rose-200/60 transition-colors cursor-pointer disabled:opacity-50"
              title="Xodimni o'chirish"
            >
              <Trash2 className="size-3.5" />
              <span>{isDeleting ? "O'chirilmoqda..." : "Xodimni o'chirish"}</span>
            </button>
          </div>
        </div>

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
              className={`text-xs font-bold select-none ${isActive ? "text-blue-600" : "text-rose-500"}`}
            >
              {isUpdatingStatus ? "O'zgarmoqda..." : isActive ? "Faol" : "Bloklangan"}
            </span>
          </div>
        </div>
      </Card>

      {/* Parametrlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Xodim ID
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Hash className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            #{employee.id}
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Telefon Raqami
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono truncate">
            {employee.phone || "—"}
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Tizimdagi Roli
            </span>
            <div className="size-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            {roleName}
          </div>
        </Card>

        <Card className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between h-28 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Biriktirilgan Ferma
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

      {/* Transport ma'lumotlari (faqat COURIER uchun) */}
      {!isManager && (
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
            <div className="flex items-center gap-2">
              <Car className="size-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Transport va Avtomobil Ma'lumotlari
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsVehicleModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors cursor-pointer"
            >
              <Pencil className="size-3.5" />
              <span>Tahrirlash</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Transport Rusumi</span>
              <p className="text-sm font-bold text-slate-900 mt-1">
                {employee.vehicleModel || "Biriktirilmagan"}
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Mashina Davlat Raqami</span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-1">
                {employee.vehiclePlateNumber || "—"}
              </p>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Yuk Sig'imi</span>
              <p className="text-sm font-bold text-blue-600 mt-1">
                {employee.maxCapacity ? `${employee.maxCapacity} ta idish` : "50 ta idish"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Sharhlar va Fikrlar */}
      {!isManager && (
        <Card className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">
                Dastavkachiga Berilgan Sharhlar va Fikrlar
              </h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
              {courierFeedback.length} ta fikr
            </span>
          </div>

          {courierFeedback.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              <p className="font-medium text-slate-600">Hozircha sharhlar mavjud emas</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mijozlar buyurtmani qabul qilib olgach qoldirgan izohlari shu yerda ko'rinadi
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {courierFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {fb.authorName || "Mijoz"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString("uz-UZ") : ""}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{fb.message}</p>
                  {fb.managerNote && (
                    <div className="p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-blue-900 mt-1">
                      <strong className="font-semibold">Menejer javobi:</strong> {fb.managerNote}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <DeleteXodimModal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        employee={employee}
        onConfirm={handleConfirmDelete}
        isPending={isDeleting}
      />

      <EditVehicleModal
        opened={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        staffId={employee?.id}
        currentVehicle={{
          vehicleModel: employee?.vehicleModel,
          vehiclePlateNumber: employee?.vehiclePlateNumber,
          maxCapacity: employee?.maxCapacity,
        }}
      />
    </div>
  )
}
export default BossXodimDetailPage;
