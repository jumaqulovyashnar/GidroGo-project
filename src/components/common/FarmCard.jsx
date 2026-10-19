import { memo, useMemo } from "react"
import { Building2, MapPin, Phone, User, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { resolveFileUrl } from "@/shared/lib"

/**
 * Ferma kartochkasi komponenti (Senior level clean architecture).
 * Barcha tugmalar va ma'lumotlar markazlashtirilgan, o'lchamlari va ranglari standart UI tizimiga mos.
 *
 * @param {Object} props
 * @param {Object} props.farm - Ferma ma'lumotlari ob'yekti
 * @param {(farm: Object) => void} props.onEdit - Tahrirlash bosilganda
 * @param {(farm: Object) => void} props.onDelete - O'chirish bosilganda
 * @param {(farm: Object) => void} [props.onClick] - Butun kartochka bosilganda (batafsil ko'rish)
 */
export const FarmCard = memo(function FarmCard({
  farm,
  onEdit,
  onDelete,
  onClick,
}) {
  const farmImage = useMemo(
    () =>
      resolveFileUrl(
        farm?.logoUrl ||
          farm?.photoUrl ||
          farm?.bannerUrl ||
          farm?.farmLogoUrl ||
          farm?.logo ||
          ""
      ),
    [farm]
  )

  const handleCardClick = () => {
    if (onClick) onClick(farm)
  }

  const handleEditClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (onEdit) onEdit(farm)
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    if (onDelete) onDelete(farm)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer"
    >
      {/* 1. Ferma Rasmi yoki Placeholder */}
      <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-slate-100 flex items-center justify-center">
        {farmImage ? (
          <img
            src={farmImage}
            alt={farm.name}
            width="400"
            height="208"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.style.display = "none"
              const fallback =
                e.currentTarget.parentElement?.querySelector(".farm-placeholder")
              if (fallback) fallback.style.display = "flex"
            }}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}

        <div
          style={{ display: farmImage ? "none" : "flex" }}
          className="farm-placeholder w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-gradient-to-br from-slate-50 to-slate-100"
        >
          <Building2 className="size-12 stroke-[1.2] text-slate-400" />
          <span className="text-xs font-medium text-slate-400">Rasm mavjud emas</span>
        </div>
      </div>

      {/* 2. Ferma Tafsilotlari */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {farm.name}
          </h3>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-slate-400 shrink-0" />
              <span className="truncate">{farm.address || "Manzil ko'rsatilmagan"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="size-4 text-slate-400 shrink-0" />
              <span>{farm.phone || "Telefon yo'q"}</span>
            </div>

            <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 text-xs sm:text-sm">
              <User className="size-4 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800 truncate">
                {farm.bossFullName || "Rahbar biriktirilmagan"}
              </span>
              {farm.bossPhone && (
                <span className="text-slate-400 truncate">({farm.bossPhone})</span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Amallar (Katta hajmli, toza va standart Button komponentlar) */}
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleEditClick}
            className="flex-1 font-semibold gap-2 shadow-xs"
          >
            <Pencil className="size-4" />
            <span>Tahrirlash</span>
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="md"
            onClick={handleDeleteClick}
            className="flex-1 font-semibold gap-2 shadow-xs"
          >
            <Trash2 className="size-4 text-white" />
            <span>O'chirish</span>
          </Button>
        </div>
      </div>
    </div>
  )
})

export default FarmCard
