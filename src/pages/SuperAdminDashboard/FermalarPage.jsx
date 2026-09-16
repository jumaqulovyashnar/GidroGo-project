import { useState } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, SlidersHorizontal, ChevronDown } from "lucide-react"
import { Button } from "@base-ui/react"
import { Input } from "@/ui"
import { Select } from "@mantine/core"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/ui/breadcrumb"

const FermalarPage = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [sort, setSort] = useState("newest")

  const statusOptions = [
    { value: "all", label: "Barcha statuslar" },
    { value: "active", label: "Faol" },
    { value: "inactive", label: "Nofaol" },
  ]

  const sortOptions = [
    { value: "newest", label: "Yangi qo'shilgan" },
    { value: "oldest", label: "Eski qo'shilgan" },
    { value: "name_asc", label: "Nomi bo'yicha (A-Z)" },
    { value: "name_desc", label: "Nomi bo'yicha (Z-A)" },
  ]

  return (
    <section className="space-y-6">
      {/* Breadcrumb qismi */}
      <div>
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="capitalize decoration-blue-500"
                render={<Link to="/super-admin" />}
              >
                bosh sahifa
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="capitalize text-blue-600">
                fermalar
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Sarlavha va Ferma qo'shish tugmasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold capitalize tracking-tight text-slate-900">
            fermalar
          </h1>
          <p className="text-sm capitalize text-slate-500 mt-1">
            Barcha fermalar ro'yxati va ularni boshqarish.
          </p>
        </div>
        <Button className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#1670FF] hover:bg-blue-700 text-white font-medium text-sm transition-colors cursor-pointer shrink-0">
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Ferma qo'shish</span>
        </Button>
      </div>

      {/* Filtr va Qidiruv Toolbar (Height 20px ga kengaytirildi) */}
      <div className="w-full bg-white px-5 py-6 rounded-[12px] border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Chap tomon: Qidiruv inputi (Kaltaroq qilingan) */}
        <div className="relative w-full sm:w-72 md:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" strokeWidth={1.75} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ferma nomi yoki manzil..."
            className="pl-9 h-10 w-full rounded-[10px] border-slate-200 bg-white placeholder:text-slate-400 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-100"
          />
        </div>

        {/* O'ng tomon: Status, Saralash va Filtrlar */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          {/* Status select (Chiroyli Modal / Dropdown va cursor-pointer) */}
          <Select
            value={status}
            onChange={(val) => setStatus(val || "all")}
            data={statusOptions}
            allowDeselect={false}
            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-full sm:w-44",
              input: "!h-10 !rounded-[10px] !border-slate-200 !text-slate-800 !text-sm !font-medium !cursor-pointer hover:!bg-slate-50 transition-colors focus:!border-blue-500",
              dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white",
              option: "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
            }}
          />

          {/* Saralash (Sort) select */}
          <Select
            value={sort}
            onChange={(val) => setSort(val || "newest")}
            data={sortOptions}
            allowDeselect={false}
            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
            classNames={{
              root: "w-full sm:w-48",
              input: "!h-10 !rounded-[10px] !border-slate-200 !text-slate-800 !text-sm !font-medium !cursor-pointer hover:!bg-slate-50 transition-colors focus:!border-blue-500",
              dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white",
              option: "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
            }}
          />

          {/* Filtrlar tugmasi */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[10px] transition-colors cursor-pointer shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <span>Filtrlar</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default FermalarPage; 