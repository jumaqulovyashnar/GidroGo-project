import { Modal as MantineModal } from "@mantine/core"
import { LogOut, X } from "lucide-react"

export function LogoutConfirmModal({ opened, onClose, onConfirm }) {
  return (
    <MantineModal
      opened={opened}
      onClose={onClose}
      centered
      size="390px"
      withCloseButton={false}
      padding={0}
      radius="xl"
      overlayProps={{
        backgroundOpacity: 0.45,
        blur: 4,
      }}
      styles={{
        content: {
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.18)",
          backgroundColor: "#ffffff",
        },
        body: {
          padding: 0,
        },
      }}
    >
      <div className="relative p-6 sm:p-7 text-center">
        {/* Yuqori o'ng burchakdagi X yopish tugmasi */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="size-4 stroke-[2]" />
        </button>

        {/* Chiroyli qatlamli doiraviy ikonka */}
        <div className="mx-auto size-16 rounded-full bg-blue-50 border-4 border-blue-50/70 ring-1 ring-blue-100 flex items-center justify-center text-blue-600 shadow-xs mb-3.5">
          <LogOut className="size-6 stroke-[2.2] translate-x-0.5" />
        </div>

        {/* Sarlavha va tushuntirish matni */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Tizimdan chiqish
        </h3>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-[280px] mx-auto">
          Haqiqatan ham o'z hisobingizdan chiqmoqchimisiz?
        </p>

        {/* Amallar tugmalari: Qaytish va Chiqish */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-semibold transition-all shadow-xs cursor-pointer flex items-center justify-center"
          >
            Qaytish
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-xs hover:shadow-md hover:shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="size-4 stroke-[2]" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>
    </MantineModal>
  )
}

export default LogoutConfirmModal
