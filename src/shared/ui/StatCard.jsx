import { Card, CardHeader, CardTitle, CardContent } from "./card"

/**
 * Barcha sahifalar uchun YAGONA va STANDART StatCard komponenti.
 * Barcha iconlar avvalgiday bir xil KO'K (w-12 h-12 bg-blue-50 text-blue-600 border-blue-100) holatda.
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
      className={`border border-slate-200/80 bg-white hover:border-slate-300 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-all duration-200 rounded-2xl p-5 sm:p-6 min-h-34 flex flex-col justify-between ${className}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 leading-snug">
          {title}
        </CardTitle>
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-blue-100/80 bg-blue-50 text-blue-600 shadow-2xs">
          {Icon && <Icon className="size-5.5 text-blue-600" strokeWidth={1.75} />}
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-2">
        <div className="text-2xl xl:text-3xl font-bold tracking-tight text-slate-900">
          {isLoading ? "—" : value}
        </div>
        {(subText || badge) && (
          <div className="flex items-center justify-between gap-2 mt-1">
            {subText && (
              <p className="text-[11px] font-normal text-slate-500 truncate" title={subText}>
                {subText}
              </p>
            )}
            {badge && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-blue-700 bg-blue-50 border border-blue-100/80 shrink-0">
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
