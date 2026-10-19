import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal } from "@mantine/core"
import {
  Receipt,
  Coins,
  FileText,
  AlertCircle,
  Loader2,
  Plus,
  Tag,
} from "lucide-react"
import { Button } from "@/shared/ui"

const MAX_EXPENSE_AMOUNT = 10_000_000_000 // 10 milliard so'm

const addExpenseSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, "Xarajat toifasi yoki nomini kiriting")
    .max(100, "Xarajat toifasi 100 ta belgidan oshmasligi kerak"),
  amount: z
    .string()
    .min(1, "Xarajat summasini kiriting")
    .max(11, "Summa uzunligi 11 ta raqamdan oshmasligi kerak")
    .refine((val) => {
      const num = Number(val.replace(/\s/g, ""))
      return !isNaN(num) && num > 0
    }, "Summa 0 dan katta bo'lishi kerak")
    .refine((val) => {
      const num = Number(val.replace(/\s/g, ""))
      return num <= MAX_EXPENSE_AMOUNT
    }, "Xarajat summasi ko'pi bilan 10 milliard so'm bo'lishi mumkin"),
  note: z.string().max(250, "Izoh 250 ta belgidan oshmasligi kerak").optional(),
})

export function AddExpenseModal({ opened, onClose, onAddExpense, isSubmitting }) {
  const [formattedAmount, setFormattedAmount] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      category: "",
      amount: "",
      note: "",
    },
    mode: "onBlur",
  })

  const handleClose = () => {
    reset({
      category: "",
      amount: "",
      note: "",
    })
    setFormattedAmount("")
    onClose()
  }

  const handleAmountChange = (e) => {
    let rawVal = e.target.value.replace(/\D/g, "")
    // 10 milliard (11 ta raqam: 10 000 000 000) dan oshmasligi uchun uzunlikni cheklash
    if (rawVal.length > 11) {
      rawVal = rawVal.slice(0, 11)
    }
    if (!rawVal) {
      setFormattedAmount("")
      setValue("amount", "", { shouldValidate: true })
      return
    }
    const num = Number(rawVal)
    if (num > MAX_EXPENSE_AMOUNT) {
      rawVal = String(MAX_EXPENSE_AMOUNT)
    }
    const formatted = Number(rawVal).toLocaleString("ru-RU")
    setFormattedAmount(formatted)
    setValue("amount", rawVal, { shouldValidate: true })
  }

  const onSubmit = (data) => {
    const cleanAmount = Number(data.amount.replace(/\s/g, ""))
    const payload = {
      category: data.category.trim(),
      amount: cleanAmount,
      ...(data.note?.trim() ? { note: data.note.trim() } : {}),
    }

    onAddExpense(payload, handleClose)
  }

  return (
    <MantineModal
      opened={opened}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Receipt className="size-5 stroke-2" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Yangi xarajat qo'shish
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fermaning sarf-xarajati va operatsion chiqimlarini kiritish
            </p>
          </div>
        </div>
      }
      size="500px"
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
          padding: "24px",
        },
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5" noValidate>
        {/* 1. Xarajat toifasi yoki nomi (Foydalanuvchi o'zi kiritadi, soxta mock datalarsiz) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Xarajat toifasi yoki nomi
          </label>
          <div className="relative">
            <Tag className="size-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              {...register("category")}
              placeholder="Masalan: Yoqilg'i, Oylik, Ta'mirlash, Kommunal..."
              className={`w-full h-11 pl-10.5 pr-4 rounded-xl border text-sm font-medium text-slate-900 bg-slate-50/50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                errors.category
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
            />
          </div>
          {errors.category && (
            <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.category.message}</span>
            </p>
          )}
        </div>

        {/* 2. Summa */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Xarajat summasi
          </label>
          <div className="relative">
            <Coins className="size-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
              maxLength={15}
              placeholder="Masalan: 250 000"
              value={formattedAmount}
              onChange={handleAmountChange}
              className={`w-full h-11 pl-10.5 pr-14 rounded-xl border text-sm font-semibold text-slate-900 bg-slate-50/50 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                errors.amount
                  ? "border-rose-300 focus:border-rose-500"
                  : "border-slate-200 focus:border-blue-500"
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              so'm
            </span>
          </div>
          {errors.amount && (
            <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.amount.message}</span>
            </p>
          )}
        </div>

        {/* 3. Izoh / Tavsif */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Xarajat tavsifi (Izoh)
          </label>
          <div className="relative">
            <FileText className="size-4.5 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              {...register("note")}
              rows={3}
              placeholder="Masalan: Cobalt avtomobili uchun 40L metan gaz..."
              className="w-full pl-10.5 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
          </div>
          {errors.note && (
            <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.note.message}</span>
            </p>
          )}
        </div>

        {/* Tugmalar */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs gap-1.5"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4 stroke-[2.5]" />
            )}
            <span>Xarajatni kiritish</span>
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}

export default AddExpenseModal
