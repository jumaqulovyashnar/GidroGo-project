import { Modal as MantineModal } from "@mantine/core"
import { LogOut } from "lucide-react"

export function LogoutConfirmModal({ opened, onClose, onConfirm }) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      centered
      size="sm"
      withCloseButton={false}
      radius="2xl"
      padding="lg"
      overlayProps={{
        backgroundOpacity: 0.45,
        blur: 3,
      }}
      styles={{
        content: {
          borderRadius: "1.25rem",
          padding: "1.5rem",
          maxWidth: "380px",
        },
      }}
    >
      <div className="text-center space-y-4">
        {/* Doiraviy rounded-full ikonka */}
        <div className="size-14 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-2xs">
          <LogOut className="size-6 stroke-[2.2] translate-x-0.5" />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            Tizimdan chiqish
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
            Haqiqatan ham o'z hisobingizdan chiqmoqchimisiz?
          </p>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Qaytish
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Chiqish
          </button>
        </div>
      </div>
    </MantineModal>
  )
}

export default LogoutConfirmModal
