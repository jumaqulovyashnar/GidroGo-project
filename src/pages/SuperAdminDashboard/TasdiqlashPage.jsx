import React, { useState, useMemo } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, TablePagination, Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/shared/ui"
import { ClipboardClock, Download, RefreshCw, ShieldCheck, SquareExclamationPointIcon, TrendingUp, TrendingDown, Clock, MapPin, CheckCheck, X, FolderArchive, Milk, Activity, Archive, Share2, } from "lucide-react"
// 3 ta Metrika kartochkasi uchun mock ma'lumotlar
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

// Jadvaldagi arizalar uchun mock ma'lumotlar (Barcha arizalar)
const MOCK_APPLICATIONS = [
  {
    id: "req-9021",
    reqNumber: "#REQ-9021",
    time: "Bugun 11:20",
    farm: {
      name: '"Zilol Suv Manbai" MCHJ',
      stir: "309 481 294",
    },
    type: {
      title: "Filtrlash zavodi",
      iconType: "bottle",
    },
    location: {
      region: "Toshkent viloyati",
      address: "Bo'stonliq t., Chimyon yo'li",
    },
    boss: {
      name: "Javohir Qodirov",
      phone: "+998 90 912-34-56",
      isOneIdVerified: true,
    },
    documents: [
      { id: "ses", name: "SES Sertifikati" },
      { id: "stir", name: "Davlat Reestri STIR" },
      { id: "lease", name: "Bino ijarasi" },
    ],
    status: "Kutilmoqda",
  },
  {
    id: "req-9018",
    reqNumber: "#REQ-9018",
    time: "Bugun 09:15",
    farm: {
      name: '"Samarqand Pure Aqua" XK',
      stir: "412 882 109",
    },
    type: {
      title: "Artezian fermasi",
      iconType: "artesian",
    },
    location: {
      region: "Samarqand viloyati",
      address: "Samarqand sh., Registon mavzesi",
    },
    boss: {
      name: "Rustam Ergashev",
      phone: "+998 93 311-88-77",
      isOneIdVerified: true,
    },
    documents: [
      { id: "ses", name: "SES Sertifikati" },
      { id: "stir", name: "Davlat Reestri STIR" },
      { id: "lab", name: "Lab Tahlili O'zDSt" },
    ],
    status: "Kutilmoqda",
  },
  {
    id: "req-8994",
    reqNumber: "#REQ-8994",
    time: "Kecha 17:45",
    farm: {
      name: '"Vodiy Logistics & Water Hub" MCHJ',
      stir: "590 102 331",
    },
    type: {
      title: "Tarqatish markazi",
      iconType: "hub",
    },
    location: {
      region: "Farg'ona viloyati",
      address: "Farg'ona sh., Marg'ilon yo'li",
    },
    boss: {
      name: "Nodira Mirzayeva",
      phone: "+998 97 700-12-88",
      isOneIdVerified: true,
    },
    documents: [
      { id: "ses", name: "Ombor sanitariya litsenziyasi" },
      { id: "contract", name: "Logistika parki shartnomasi" },
    ],
    status: "Kutilmoqda",
  },
]

// Arxivlangan arizalar uchun mock ma'lumotlar
const MOCK_ARCHIVED_APPLICATIONS = [
  {
    id: "req-8850",
    reqNumber: "#REQ-8850",
    time: "15-Apr 14:10",
    farm: {
      name: '"Toshkent Mineral Suvlari" MCHJ',
      stir: "201 543 890",
    },
    type: {
      title: "Mineral suv",
      iconType: "bottle",
    },
    location: {
      region: "Toshkent shahri",
      address: "Yunusobod t., 4-mavze",
    },
    boss: {
      name: "Sherzod Alimov",
      phone: "+998 90 123-45-67",
      isOneIdVerified: true,
    },
    documents: [
      { id: "ses", name: "SES Sertifikati" },
      { id: "stir", name: "Davlat Reestri STIR" },
    ],
    status: "Tasdiqlangan",
  },
  {
    id: "req-8812",
    reqNumber: "#REQ-8812",
    time: "12-Apr 10:30",
    farm: {
      name: '"Oasis Fresh Water" XK',
      stir: "305 678 123",
    },
    type: {
      title: "Quyish stansiyasi",
      iconType: "artesian",
    },
    location: {
      region: "Buxoro viloyati",
      address: "Buxoro sh., Mustaqillik ko'chasi",
    },
    boss: {
      name: "Farrux Saidov",
      phone: "+998 93 456-78-90",
      isOneIdVerified: true,
    },
    documents: [
      { id: "ses", name: "SES Sertifikati" },
    ],
    status: "Rad etilgan",
  },
  {
    id: "req-8790",
    reqNumber: "#REQ-8790",
    time: "10-Apr 16:20",
    farm: {
      name: '"Andijon Fresh Delivery" MCHJ',
      stir: "408 912 773",
    },
    type: {
      title: "Distributsiya markazi",
      iconType: "hub",
    },
    location: {
      region: "Andijon viloyati",
      address: "Andijon sh., Bobur shoh ko'chasi",
    },
    boss: {
      name: "Olimjon Rahmonov",
      phone: "+998 91 234-56-78",
      isOneIdVerified: true,
    },
    documents: [
      { id: "ses", name: "Sanitariya hujjati" },
      { id: "stir", name: "Davlat Reestri STIR" },
    ],
    status: "Tasdiqlangan",
  },
]

const TasdiqlashPage = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("barcha") // "barcha" | "arxiv"
  const [applications, setApplications] = useState(MOCK_APPLICATIONS)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 600)
  }

  // Faqat 2 ta tab: "barcha" va "arxiv"
  const currentList = useMemo(() => {
    if (activeTab === "arxiv") {
      return MOCK_ARCHIVED_APPLICATIONS
    }
    return applications
  }, [activeTab, applications])

  const totalPages = Math.max(Math.ceil(currentList.length / itemsPerPage), 3)
  const paginatedList = currentList

  const handleApprove = (id) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "Tasdiqlangan" } : app
      )
    )
  }

  const handleReject = (id) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "Rad etilgan" } : app
      )
    )
  }

  const renderTypeIcon = (iconType) => {
    if (iconType === "bottle") {
      return (
        <div className="size-7 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center shrink-0 text-blue-600">
          <Milk className="size-3.5" />
        </div>
      )
    }
    if (iconType === "artesian") {
      return (
        <div className="size-7 rounded-lg bg-cyan-50 border border-cyan-100/80 flex items-center justify-center shrink-0 text-cyan-600">
          <Activity className="size-3.5" />
        </div>
      )
    }
    return (
      <div className="size-7 rounded-lg bg-indigo-50 border border-indigo-100/80 flex items-center justify-center shrink-0 text-indigo-600">
        <Share2 className="size-3.5" />
      </div>
    )
  }

  return (
    <section className="space-y-6 w-full">
      {/* 1. Sarlavha qismi */}
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
              className={`size-3.5 text-slate-500 transition-transform ${isRefreshing ? "animate-spin" : ""
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

      {/* 2. 3 ta Metrika Cardlar (Ko'k dumaloq ikonka bilan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MOCK_CARD_DATA.map((card) => {
          const isUpTrend = card.footerLeft?.includes("+")
          const isDownTrend = card.footerLeft?.includes("-")

          return (
            <Card
              key={card.id}
              className="bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 rounded-xl"
            >
              <CardHeader className="flex flex-row items-center justify-between px-4 pt-3.5 pb-1 space-y-0">
                <CardTitle className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                  {card.title}
                </CardTitle>
                <div className="size-8 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                  {React.isValidElement(card.icon) ? (
                    React.cloneElement(card.icon, {
                      className: `size-4 text-blue-600 ${card.icon.props?.className || ""}`.trim(),
                    })
                  ) : typeof card.icon === "function" ||
                    (typeof card.icon === "object" && card.icon !== null) ? (
                    <card.icon className="size-4 text-blue-600" />
                  ) : null}
                </div>
              </CardHeader>

              <CardContent className="px-4 pb-3.5 pt-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-slate-900">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-xs font-medium text-slate-500">
                      {card.unit}
                    </span>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    {isUpTrend ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">
                        <TrendingUp className="size-3" strokeWidth={2} />
                        {card.footerLeft}
                      </span>
                    ) : isDownTrend ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100">
                        <TrendingDown className="size-3" strokeWidth={2} />
                        {card.footerLeft}
                      </span>
                    ) : (
                      <span className="text-slate-500 flex items-center gap-1 text-[11px] font-normal">
                        <Clock className="size-3 text-slate-400" />
                        {card.footerLeft}
                      </span>
                    )}
                  </div>

                  {card.footerRight && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md border bg-slate-50 text-slate-700 border-slate-200/80">
                      {card.footerRight}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 3. Faqat 2 ta Tab: "Barcha arizalar" va "Arxivlanganlar" */}
      <div className="flex items-center gap-2.5 pt-2">
        {/* 1-tab: Barcha arizalar */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("barcha")
            setCurrentPage(1)
          }}
          className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${activeTab === "barcha"
              ? "bg-[#2563EB] text-white shadow-blue-500/20"
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
            }`}
        >
          <FolderArchive className="size-4" />
          <span>Barcha arizalar</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "barcha"
                ? "bg-white/20 text-white"
                : "bg-blue-50 text-blue-600"
              }`}
          >
            {applications.length}
          </span>
        </button>

        {/* 2-tab: Arxivlanganlar */}
        <button
          type="button"
          onClick={() => {
            setActiveTab("arxiv")
            setCurrentPage(1)
          }}
          className={`h-10 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${activeTab === "arxiv"
              ? "bg-[#2563EB] text-white shadow-blue-500/20"
              : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80"
            }`}
        >
          <Archive className="size-4" />
          <span>Arxivlanganlar</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === "arxiv"
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-600"
              }`}
          >
            42
          </span>
        </button>
      </div>

      {/* 4. Table Qismi */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden w-full">
        <Table className="w-full table-fixed" containerClassName="overflow-hidden">
          <TableHeader>
            <TableRow className="border-b border-slate-200/80 bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="w-[22%] pl-6 pr-2 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                FERMA / TASHKILOT & STIR
              </TableHead>
              <TableHead className="w-[13%] px-2 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                TURI
              </TableHead>
              <TableHead className="w-[20%] px-2 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                HUDUD & MANZIL
              </TableHead>
              <TableHead className="w-[16%] px-2 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                ARIZA TOPSHIRGAN BOSS
              </TableHead>
              <TableHead className="w-[11%] px-2 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-center">
                HOLATI
              </TableHead>
              <TableHead className="w-[18%] pl-2 pr-6 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-600 text-center">
                AMALLAR
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-10 text-center text-slate-400 text-sm"
                >
                  Arizalar topilmadi.
                </TableCell>
              </TableRow>
            ) : (
              paginatedList.map((app) => (
                <TableRow
                  key={app.id}
                  className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                >
                  {/* 1. FERMA / TASHKILOT & STIR */}
                  <TableCell className="pl-6 pr-2 py-3 align-middle whitespace-normal">
                    <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug" title={app.farm.name}>
                      {app.farm.name}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/70 border border-blue-100/60 text-[11px] font-medium text-slate-700 mt-1">
                      <span className="text-slate-500">STIR:</span>
                      <span className="font-semibold text-slate-900">
                        {app.farm.stir}
                      </span>
                    </div>
                  </TableCell>

                  {/* 2. TURI */}
                  <TableCell className="px-2 py-3 align-middle whitespace-normal">
                    <div className="flex items-center gap-2">
                      {renderTypeIcon(app.type.iconType)}
                      <span className="font-semibold text-xs text-slate-800 leading-tight whitespace-nowrap">
                        {app.type.title}
                      </span>
                    </div>
                  </TableCell>

                  {/* 3. HUDUD & MANZIL */}
                  <TableCell className="px-2 py-3 align-middle whitespace-normal">
                    <div className="font-semibold text-xs text-slate-900 leading-tight">
                      {app.location.region}
                    </div>
                    <div className="flex items-start gap-1 text-[11px] text-slate-500 leading-tight mt-1">
                      <MapPin className="size-3 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{app.location.address}</span>
                    </div>
                  </TableCell>

                  {/* 4. ARIZA TOPSHIRGAN BOSS */}
                  <TableCell className="px-2 py-3 align-middle whitespace-normal">
                    <div className="font-semibold text-xs text-slate-900 leading-tight">
                      {app.boss.name}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-1">
                      {app.boss.phone}
                    </div>
                  </TableCell>

                  {/* 5. HOLATI */}
                  <TableCell className="px-2 py-3 align-middle text-center whitespace-normal">
                    <span
                      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-center leading-tight whitespace-nowrap ${app.status === "Tasdiqlangan"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : app.status === "Rad etilgan"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                    >
                      {app.status}
                    </span>
                  </TableCell>

                  {/* 6. AMALLAR */}
                  <TableCell className="pl-2 pr-6 py-3 align-middle text-center whitespace-normal">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(app.id)}
                        className="h-7.5 px-2.5 rounded-lg bg-[#2563EB] hover:bg-blue-700 text-white text-[11px] font-medium gap-1 shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <CheckCheck className="size-3" />
                        <span>Tasdiqlash</span>
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleReject(app.id)}
                        className="h-7.5 px-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 text-[11px] font-medium gap-1 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <X className="size-3" />
                        <span>Rad etish</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Pagination Component */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  )
}

export default TasdiqlashPage;
