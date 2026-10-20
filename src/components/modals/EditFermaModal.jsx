import React, { useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { Building2, Pencil } from "lucide-react"
import { Button, Spinner } from "@/shared/ui"

export function EditFermaModal({ opened, onClose, farm, onSave, isPending }) {
  if (!opened || !farm) return null

  return (
    <EditFermaModalContent
      key={farm.id}
      opened={opened}
      onClose={onClose}
      farm={farm}
      onSave={onSave}
      isPending={isPending}
    />
  )
}

function EditFermaModalContent({ opened, onClose, farm, onSave, isPending }) {
  const [status, setStatus] = useState(farm?.status || "ACTIVE")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: farm.id,
      status,
    })
  }

  const farmName = farm.name || "Ferma"
  const farmAddress = farm.address || ""
  const bossName = farm.bossFullName || farm.boss?.fullName || ""

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
            <h3 className="text-base font-bold text-slate-900 leading-tight">Ferma holatini o'zgartirish</h3>
            <p className="text-xs text-slate-500 mt-0.5">Fermaning tizimdagi faollik holatini belgilang</p>
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
            <Building2 className="size-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 truncate">{farmName}</h4>
            <p className="text-xs text-slate-500 truncate">{farmAddress || "Manzil ko'rsatilmagan"}</p>
            {bossName && <p className="text-xs text-blue-600 font-medium truncate mt-0.5">Rahbar: {bossName}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 block">
            Ferma holati <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setStatus("ACTIVE")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                status === "ACTIVE"
                  ? "border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/10"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`size-2.5 rounded-full ${status === "ACTIVE" ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className="text-xs font-bold">Faol</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-4.5">Ferma to'liq ishlaydi</p>
            </button>

            <button
              type="button"
              onClick={() => setStatus("INACTIVE")}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                status === "INACTIVE"
                  ? "border-amber-500 bg-amber-50/50 text-amber-950 ring-2 ring-amber-500/10"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`size-2.5 rounded-full ${status === "INACTIVE" ? "bg-amber-500" : "bg-slate-300"}`} />
                <span className="text-xs font-bold">Nofaol</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 pl-4.5">Vaqtinchalik to'xtatilgan</p>
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

export default EditFermaModal
