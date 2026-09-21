import React, { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/ui"
import {
  ClipboardClock,
  Download,
  RefreshCw,
  ShieldCheck,
  SquareExclamationPointIcon,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react"

const MOCK_CARD_DATA = [
  {
    id: 1,
    title: "NAVBATDA KUTILAYOTGAN",
    value: 3,
    unit: "ta ariza",
    footerLeft: "O'rtacha ko'rib chiqish: ~2 soat",
    footerRight: "Tezkor navbat",
    icon: <ClipboardClock />,
    status: "pending",
  },
  {
    id: 2,
    title: "TASDIQLANGAN",
    value: 18,
    unit: "ta obyekt",
    footerLeft: "bu oy +24%",
    footerRight: "oxirgi 2 soat oldin",
    icon: <ShieldCheck />,
    status: "approved",
  },
  {
    id: 3,
    title: "RAD ETILGAN",
    value: 2,
    unit: "ta ariza",
    footerLeft: "Kamchiliklar aniqlangan",
    footerRight: "Qayta ko'rib chiqish",
    icon: <SquareExclamationPointIcon />,
    status: "rejected",
  },
]

const getCardTheme = (card) => {
  const title = (card.title || "").toUpperCase()
  if (card.status === "approved" || title.includes("TASDIQ") || card.id === 2) {
    return {
      iconWrapper: "bg-emerald-50 text-emerald-600 border-emerald-100",
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      accent: "text-emerald-600",
    }
  }
  if (card.status === "rejected" || title.includes("RAD") || card.id === 3) {
    return {
      iconWrapper: "bg-rose-50 text-rose-600 border-rose-100",
      badge: "bg-rose-50 text-rose-700 border-rose-200/60",
      accent: "text-rose-600",
    }
  }
  // Default: Pending / Navbatda kutilayotgan
  return {
    iconWrapper: "bg-amber-50 text-amber-600 border-amber-100",
    badge: "bg-amber-50 text-amber-700 border-amber-200/60",
    accent: "text-amber-600",
  }
}

const TasdiqlashPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  return (
    <section className="space-y-6">
      {/* Header qismi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 capitalize">
            Tasdiqlash so'rovlari
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Yangi suv ishlab chiqaruvchilarni litsenziya va yuridik tekshirish.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <RefreshCw
              className={`size-3.5 text-slate-500 transition-transform ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>Avto-yangilanish: 30s</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-medium border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs cursor-pointer"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>Eksport CSV</span>
          </Button>
        </div>
      </div>

      {/* 3 ta Metrika Cardlar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_CARD_DATA.map((card) => {
          const theme = getCardTheme(card)
          const isUpTrend = card.footerLeft?.includes("+")
          const isDownTrend = card.footerLeft?.includes("-")

          return (
            <Card
              key={card.id}
              className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 rounded-2xl"
            >
              {/* Card Header: Sarlavha va rangli ikonka */}
              <CardHeader className="flex flex-row items-center justify-between p-5 pb-2 space-y-0">
                <CardTitle className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  {card.title}
                </CardTitle>
                <div
                  className="size-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0"
                >
                  {React.isValidElement(card.icon) ? (
                    React.cloneElement(card.icon, {
                      className: `size-5 text-blue-600 ${card.icon.props?.className || ""}`.trim(),
                    })
                  ) : typeof card.icon === "function" ||
                    (typeof card.icon === "object" && card.icon !== null) ? (
                    <card.icon className="size-5 text-blue-600" />
                  ) : null}
                </div>
              </CardHeader>

              {/* Card Content: Katta raqam, birlik va pastki qator */}
              <CardContent className="p-5 pt-1">
                {/* Qiymat va birlik */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-xs font-medium text-slate-500">
                      {card.unit}
                    </span>
                  )}
                </div>

                {/* Ajratuvchi chiziq va Footer */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Chap tomon: O'sish ko'rsatkichi yoki vaqt tavsifi */}
                  <div className="flex items-center">
                    {isUpTrend ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        <TrendingUp className="size-3" strokeWidth={2} />
                        {card.footerLeft}
                      </span>
                    ) : isDownTrend ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        <TrendingDown className="size-3" strokeWidth={2} />
                        {card.footerLeft}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1.5 font-normal">
                        <Clock className="size-3.5 text-slate-400" />
                        {card.footerLeft}
                      </span>
                    )}
                  </div>

                  {/* O'ng tomon: Holat teg / Badge */}
                  {card.footerRight && (
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${theme.badge}`}
                    >
                      {card.footerRight}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}

export default TasdiqlashPage