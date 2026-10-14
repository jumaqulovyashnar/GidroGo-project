import { memo } from "react"
import { TableRow, TableCell } from "@/shared/ui/table"
import { Switch, Button, OwnerAvatar } from "@/shared/ui"

/**
 * Ferma egasi jadval qatori komponenti
 */
export const BossTableRow = memo(function BossTableRow({
  boss,
  isToggling = false,
  onToggleStatus,
  onEdit,
  onDelete,
}) {
  return (
    <TableRow className="hover:bg-slate-50/60 transition-colors border-b border-slate-100 last:border-b-0 h-16">
      {/* 1. Rasm */}
      <TableCell className="py-3 pl-6 text-left align-middle">
        <OwnerAvatar
          image={boss.farmImage}
          farmName={boss.farmName}
          name={boss.fullName}
        />
      </TableCell>

      {/* 2. Ferma Egasi (Ism + Ferma nomi) */}
      <TableCell className="py-3 px-4 text-left align-middle">
        <div className="min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate">
            {boss.fullName}
          </p>
          <p className="text-xs text-slate-500 truncate mt-0.5">
            {boss.farmName}
          </p>
        </div>
      </TableCell>

      {/* 3. Telefon */}
      <TableCell className="py-3 px-4 text-left text-slate-600 text-sm font-medium whitespace-nowrap align-middle">
        {boss.phone}
      </TableCell>

      {/* 4. Ferma ID */}
      <TableCell className="py-3 px-4 text-left whitespace-nowrap align-middle">
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
          {boss.farmId}
        </span>
      </TableCell>

      {/* 5. Holati (Switch + Matn) */}
      <TableCell className="py-3 px-4 text-left whitespace-nowrap align-middle">
        <div className="flex items-center gap-2.5">
          <Switch
            aria-label={`${boss.fullName} hisobini o'zgartirish`}
            checked={boss.isActive}
            disabled={isToggling}
            onCheckedChange={() => onToggleStatus(boss.id)}
          />
          <span
            className={`w-16 shrink-0 text-xs font-semibold select-none ${
              boss.isActive ? "text-[#2563EB]" : "text-slate-400"
            }`}
          >
            {isToggling ? "O'zgarmoqda..." : boss.isActive ? "Faol" : "Bloklangan"}
          </span>
        </div>
      </TableCell>

      {/* 6. Ro'yxatdan O'tgan Sanasi */}
      <TableCell className="py-3 px-4 text-left text-slate-600 text-sm whitespace-nowrap align-middle">
        {boss.createdAtStr}
      </TableCell>

      {/* 7. Amallar */}
      <TableCell className="py-3 px-4 text-center whitespace-nowrap align-middle">
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            size="xs"
            onClick={() => onEdit(boss.raw)}
            className="h-8 px-3 rounded-lg text-xs font-medium text-white bg-[#2563EB] hover:bg-blue-700 transition-colors shadow-xs cursor-pointer capitalize"
          >
            tahrirlash
          </Button>
          <Button
            type="button"
            size="xs"
            onClick={() => onDelete(boss.raw)}
            className="h-8 px-3 rounded-lg text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer capitalize"
          >
            o'chirish
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
})

export default BossTableRow
