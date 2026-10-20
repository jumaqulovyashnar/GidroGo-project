import React from "react"
import { Modal as MantineModal } from "@mantine/core"
import { Trash2 } from "lucide-react"
import { Button, Spinner } from "@/shared/ui"

export function DeleteBossModal({ opened, onClose, boss, onConfirm, isPending }) {
  if (!boss) return null

  const bossName = boss.fullName || boss.profile?.fullName || "Ferma egasi"

  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Trash2 className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Ferma egasini o'chirish</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ushbu amalni ortga qaytarib bo'lmaydi</p>
          </div>
        </div>
      }
      size="440px"
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
      <div className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">
          Haqiqatan ham <strong className="text-slate-900 font-semibold">{bossName}</strong> hisobini o'chirib tashlamoqchimisiz?
        </p>

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
            type="button"
            onClick={() => onConfirm(boss)}
            disabled={isPending}
            className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs gap-1.5"
          >
            {isPending ? <Spinner size="xs" /> : <Trash2 className="size-4" />}
            <span>O'chirish</span>
          </Button>
        </div>
      </div>
    </MantineModal>
  )
}

export default DeleteBossModal
