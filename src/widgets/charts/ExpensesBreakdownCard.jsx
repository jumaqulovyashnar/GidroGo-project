import { Card, CardHeader, CardTitle, CardContent, Button } from "@/shared/ui"
import { Plus } from "lucide-react"

export function ExpensesBreakdownCard() {
  const expenseCategories = [
    {
      id: 1,
      title: "Dastavka xizmati va kuryerlar KPI",
      amount: "41,200,000 so'm",
      percentage: 42,
      barColor: "bg-blue-600",
      dotColor: "bg-blue-600",
    },
    {
      id: 2,
      title: "Suv filtrlash va xomashyo (Qopqoqlar, kapsula, etiketka)",
      amount: "23,500,000 so'm",
      percentage: 24,
      barColor: "bg-teal-500",
      dotColor: "bg-teal-500",
    },
    {
      id: 3,
      title: "Avtopark yoqilg'i/benzin/harakat va texnik xizmat",
      amount: "17,600,000 so'm",
      percentage: 18,
      barColor: "bg-amber-500",
      dotColor: "bg-amber-500",
    },
    {
      id: 4,
      title: "Elektr energiyasi va ferma kommunal xarajatlari",
      amount: "11,500,000 so'm",
      percentage: 12,
      barColor: "bg-purple-500",
      dotColor: "bg-purple-500",
    },
    {
      id: 5,
      title: "Boshqaruv ma'muriy va kantselyariya xarajatlari",
      amount: "4,400,000 so'm",
      percentage: 4,
      barColor: "bg-slate-500",
      dotColor: "bg-slate-500",
    },
  ]

  return (
    <Card className="border border-slate-200/80 bg-white shadow-xs rounded-2xl h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between p-5 pb-3">
        <div>
          <CardTitle className="text-base sm:text-lg font-bold text-slate-900">
            Xarajatlar Strukturasi <span className="text-sm font-normal text-slate-500">(Toifalar kesimida)</span>
          </CardTitle>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Jami 98,200,000 so'm operatsion xarajatning taqsimoti
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl text-xs font-semibold gap-1 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-50 shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Yangi toifa</span>
        </Button>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {expenseCategories.map((item) => (
          <div key={item.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <span className={`size-2 rounded-full ${item.dotColor} shrink-0`}></span>
                <span className="font-medium text-slate-700 truncate" title={item.title}>
                  {item.title}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-bold text-slate-900 text-xs sm:text-sm">
                  {item.amount}
                </span>
                <span className="text-xs font-semibold text-slate-400 w-9 text-right">
                  ({item.percentage}%)
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${item.barColor}`}
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default ExpensesBreakdownCard
