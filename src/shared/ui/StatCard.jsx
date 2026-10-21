import { Card, CardHeader, CardTitle, CardContent } from "./card"

/**
 * Barcha sahifalar uchun ixcham (compact), chiroyli va standart StatCard komponenti.
 * Hajmi kichraytirilgan, ortiqcha bo'sh joylar yo'qotilgan, barcha iconlar ko'k rangda.
 */
export function StatCard({
  title,
  value,
  subText,
  badge,
  icon: Icon,
  isLoading = false,
  className = "",
}) {
  return (
    <Card
      className={`border border-slate-200/80 bg-white hover:border-slate-300 shadow-xs hover:shadow-sm transition-all duration-200 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-1 space-y-0 p-0">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 line-clamp-1">
          {title}
        </CardTitle>
        <div className="size-9 sm:size-9.5 rounded-full flex items-center justify-center shrink-0 border border-blue-100/80 bg-blue-50 text-blue-600 shadow-2xs">
          {Icon && <Icon className="size-4 sm:size-4.5 text-blue-600" strokeWidth={1.75} />}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-1">
        <div className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
          {isLoading ? "—" : value}
        </div>
        {(subText || badge) && (
          <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-slate-100">
            {subText && (
              <p className="text-[11px] font-normal text-slate-500 truncate" title={subText}>
                {subText}
              </p>
            )}
            {badge && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md text-blue-600 bg-blue-50 border border-blue-100/70 shrink-0">
                {badge}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default StatCard
