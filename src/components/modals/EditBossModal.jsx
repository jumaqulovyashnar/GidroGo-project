import React, { useState } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import { Pencil, Eye, EyeOff } from "lucide-react"
import { Button, Input, Spinner } from "@/shared/ui"
import { NAME_REGEX, PHONE_REGEX, formatPhoneInput } from "@/shared/lib"

const editBossSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Rahbar to'liq ismini kiriting (kamida 3 ta belgi)")
    .regex(NAME_REGEX, "Faqat harflar kiritilishi mumkin"),
  phone: z
    .string()
    .trim()
    .transform((val) => formatPhoneInput(val))
    .refine((val) => PHONE_REGEX.test(val), {
      message: "Telefon raqamini to'g'ri formatda kiriting (Masalan: +998901234567)",
    }),
  farmId: z.string().optional().default(""),
  password: z
    .string()
    .optional()
    .default("")
    .refine((val) => !val || /^\S{4,50}$/.test(val), {
      message: "Parolda probel bo'lmasligi va kamida 4 ta belgidan iborat bo'lishi kerak",
    }),
  status: z.enum(["ACTIVE", "BLOCKED"]).default("ACTIVE"),
})

export function EditBossModal({ opened, onClose, boss, onSave, isPending }) {
  if (!opened || !boss) return null

  return (
    <EditBossModalContent
      key={boss.id}
      opened={opened}
      onClose={onClose}
      boss={boss}
      onSave={onSave}
      isPending={isPending}
    />
  )
}

function EditBossModalContent({ opened, onClose, boss, onSave, isPending }) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(editBossSchema),
    defaultValues: {
      fullName: boss?.fullName || boss?.profile?.fullName || "",
      phone: formatPhoneInput(boss?.phone || boss?.profile?.phone || "+998"),
      farmId: String(boss?.farmId || boss?.farm?.id || ""),
      status:
        boss?.active || boss?.status === "ACTIVE" || boss?.profile?.status === "active"
          ? "ACTIVE"
          : "BLOCKED",
      password: "",
    },
    mode: "onBlur",
  })

  const currentStatus = useWatch({ control, name: "status" })

  const onSubmit = (values) => {
    onSave({
      id: boss.id,
      fullName: values.fullName.trim(),
      phone: values.phone,
      status: values.status,
      ...(values.password ? { password: values.password } : {}),
      ...(values.farmId ? { farmId: Number(values.farmId) } : {}),
    })
  }

  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Pencil className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Ferma egasini tahrirlash</h3>
            <p className="text-xs text-slate-500 mt-0.5">Xodim ma'lumotlarini va tizim holatini yangilang</p>
          </div>
        </div>
      }
      size="480px"
      centered
      radius="xl"
      overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      styles={{
        content: {
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        },
        header: {
          borderBottom: "1px solid #f1f5f9",
          padding: "18px 24px",
          backgroundColor: "#ffffff",
        },
        body: {
          padding: "20px 24px 24px",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            F.I.Sh <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("fullName")}
            placeholder="Masalan: Abdullayev Sardor"
            className="h-10 text-sm font-medium"
            error={errors.fullName?.message}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Telefon raqami <span className="text-rose-500">*</span>
          </label>
          <Input
            {...register("phone")}
            placeholder="+998 90 123 45 67"
            className="h-10 text-sm font-mono"
            error={errors.phone?.message}
            onChange={(e) => {
              setValue("phone", formatPhoneInput(e.target.value), { shouldValidate: true })
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Yangi parol <span className="text-slate-400 font-normal">(ixtiyoriy)</span>
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
              className="h-10 text-sm font-mono pr-10"
              error={errors.password?.message}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-slate-700 block">
            Hisob holati <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setValue("status", "ACTIVE", { shouldValidate: true })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                currentStatus === "ACTIVE"
                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/10"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`size-2.5 rounded-full ${currentStatus === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="text-xs font-bold">Faol</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-4.5">Tizimga kira oladi</p>
            </button>

            <button
              type="button"
              onClick={() => setValue("status", "BLOCKED", { shouldValidate: true })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                currentStatus === "BLOCKED"
                  ? "border-rose-500 bg-rose-50/50 text-rose-950 ring-2 ring-rose-500/10"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`size-2.5 rounded-full ${currentStatus === "BLOCKED" ? "bg-rose-500" : "bg-slate-300"}`} />
                <span className="text-xs font-bold">Bloklangan</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-4.5">Kirish cheklangan</p>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs gap-1.5"
          >
            {isPending && <Spinner size="xs" />}
            <span>Saqlash</span>
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}

export default EditBossModal
