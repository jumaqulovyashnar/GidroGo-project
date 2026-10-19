import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Modal as MantineModal, Select } from "@mantine/core"
import {
  Receipt,
  Coins,
  FileText,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react"
import { Button } from "@/shared/ui"

const expenseCategories = [
  { value: "Yoqilg'i va transport", label: "Yoqilg'i va transport (benzin, gaz, yo'l)" },
  { value: "Xomashyo va materiallar", label: "Suv filtrlash va xomashyo (qopqoq, filtr, etiketka)" },
  { value: "Oylik va ish haqi", label: "Oylik va ish haqi (xodimlar maoshi, bonuslar)" },
  { value: "Elektr va kommunal", label: "Elektr energiyasi va kommunal to'lovlar" },
  { value: "Ta'mirlash va texnik xizmat", label: "Avtopark va uskunalar ta'miri" },
  { value: "Ijara va boshqaruv", label: "Ijara va ma'muriy kantselyariya" },
  { value: "Boshqa xarajatlar", label: "Boshqa operatsion xarajatlar" },
]

const addExpenseSchema = z.object({
  category: z.string().min(1, "Xarajat toifasini tanlang"),
  amount: z
    .string()
    .min(1, "Xarajat summasini kiriting")
    .refine((val) => {
      const num = Number(val.replace(/\s/g, ""))
      return !isNaN(num) && num > 0
    }, "Summa 0 dan katta bo'lishi kerak"),
  note: z.string().max(250, "Izoh 250 ta belgidan oshmasligi kerak").optional(),
})

export function AddExpenseModal({ opened, onClose, onAddExpense, isSubmitting }) {
  const [formattedAmount, setFormattedAmount] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      category: "Yoqilg'i va transport",
      amount: "",
      note: "",
    },
    mode: "onBlur",
  })

  const currentCategory = watch("category")

  const handleClose = () => {
    reset()
    setFormattedAmount("")
    onClose()
  }

  const handleAmountChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "")
    if (!rawVal) {
      setFormattedAmount("")
      setValue("amount", "", { shouldValidate: true })
      return
    }
    const formatted = Number(rawVal).toLocaleString("ru-RU")
    setFormattedAmount(formatted)
    setValue("amount", rawVal, { shouldValidate: true })
  }

  const onSubmit = (data) => {
    const cleanAmount = Number(data.amount.replace(/\s/g, ""))
    const payload = {
      category: data.category,
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
        {/* 1. Xarajat toifasi */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Xarajat toifasi (Kategoriya)</span>
            <span className="text-rose-500 text-[11px] font-bold">*majburiy</span>
          </label>
          <Select
            data={expenseCategories}
            value={currentCategory}
            onChange={(val) => setValue("category", val || "", { shouldValidate: true })}
            placeholder="Toifani tanlang..."
            classNames={{
              input:
                "h-11 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-medium text-slate-800 focus:border-blue-500 focus:bg-white transition-all",
              dropdown: "rounded-xl border border-slate-200 shadow-lg p-1.5",
              option:
                "!rounded-lg !text-xs !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600 data-[checked=true]:!font-bold",
            }}
          />
          {errors.category && (
            <p className="text-xs font-medium text-rose-500 flex items-center gap-1 mt-1">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errors.category.message}</span>
            </p>
          )}
        </div>

        {/* 2. Summa */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Xarajat summasi</span>
            <span className="text-rose-500 text-[11px] font-bold">*majburiy</span>
          </label>
          <div className="relative">
            <Coins className="size-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              inputMode="numeric"
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
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Xarajat tavsifi (Izoh)</span>
            <span className="text-slate-400 text-[11px]">ixtiyoriy</span>
          </label>
          <div className="relative">
            <FileText className="size-4.5 text-slate-400 absolute left-3.5 top-3" />
            <textarea
              {...register("note")}
              rows={3}
              placeholder="Masalan: Damas 01 A 777 AA avtomobili uchun 40L metan gaz..."
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
