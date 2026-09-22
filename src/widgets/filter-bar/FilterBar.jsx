import { Input } from "@/shared/ui";
import { Select } from "@mantine/core";
import { Search, ChevronDown, SlidersHorizontal, Tractor, RotateCcw, Calendar } from "lucide-react";

const defaultStatusOptions = [
    { value: "all", label: "Barcha statuslar" },
    { value: "active", label: "Faol" },
    { value: "inactive", label: "Nofaol" },
];
const defaultSortOptions = [
    { value: "newest", label: "Yangi qo'shilgan" },
    { value: "oldest", label: "Eski qo'shilgan" },
    { value: "name_asc", label: "Nomi bo'yicha (A-Z)" },
    { value: "name_desc", label: "Nomi bo'yicha (Z-A)" },
];

const defaultFarmOptions = [
    { value: "all", label: "Barcha fermalar" },
];


const defaultDateOptions = [
    { value: 'today', label: 'Bugun' },
    { value: 'yesterday', label: 'Kecha' },
    { value: 'this_week', label: 'Shu hafta' },
    { value: 'this_month', label: 'Shu oy' },
    { value: 'this_year', label: 'Shu yil' },
];
const FilterBar = ({
    search = "",
    setSearch = () => { },
    status = "all",
    setStatus = () => { },
    statusOptions = defaultStatusOptions,
    sort = "newest",
    setSort = () => { },
    sortOptions = defaultSortOptions,
    setCurrentPage = () => { },
    placeholder = "Ferma nomi yoki manzil...",
    showSearch = true,
    showStatus = true,
    showSort = true,
    showFilterButton = true,
    onFilterClick,
    farmOptions = defaultFarmOptions,
    farm = "all",
    setFarm = () => { },
    onReset = () => { },
    showFarm = false,
    showReset = false,
    date = 'today',
    dateOptions = defaultDateOptions,
    setDate = () => { },
    showDate = false
}) => {
    return (
        <section>
            <div className={`w-full bg-white px-5 py-6 rounded-[12px] border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 ${showSearch ? "justify-between" : "justify-end"}`}>
                {/* Chap tomon: Qidiruv inputi */}
                {showSearch && (
                    <div className="relative w-full sm:w-72 md:w-80 shrink-0">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none"
                            strokeWidth={1.75}
                        />
                        <Input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            placeholder={placeholder}
                            className="pl-9 h-10 w-full rounded-[10px] border-slate-200 bg-white placeholder:text-slate-400 text-sm focus-visible:border-blue-500 focus-visible:ring-blue-100"
                        />
                    </div>
                )}

                {/* O'ng tomon: Status, Ferma, Sana, Saralash va Filtrlar */}
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
                    {/* 1. Status select */}
                    {showStatus && (
                        <Select
                            value={status}
                            onChange={(val) => {
                                setStatus(val || "all");
                                setCurrentPage(1);
                            }}
                            data={statusOptions}
                            allowDeselect={false}
                            maxDropdownHeight={450}
                            leftSection={<SlidersHorizontal className="size-4 text-slate-400 pointer-events-none" />}
                            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
                            classNames={{
                                root: "w-full sm:w-48",
                                input:
                                    "!h-10 !rounded-[10px] !border-slate-200/80 !bg-[#F4F8FF] hover:!bg-[#EBF3FF] !text-slate-700 !text-sm !font-medium !cursor-pointer transition-colors focus:!border-blue-500",
                                dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
                                option:
                                    "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
                            }}
                        />
                    )}

                    {/* 2. Ferma tanlash selecti */}
                    {showFarm && (
                        <Select
                            value={farm}
                            onChange={(val) => {
                                setFarm(val || "all");
                                setCurrentPage(1);
                            }}
                            data={farmOptions}
                            allowDeselect={false}
                            maxDropdownHeight={450}
                            leftSection={<Tractor className="size-4 text-slate-400 pointer-events-none" />}
                            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
                            classNames={{
                                root: "w-full sm:w-48",
                                input:
                                    "!h-10 !rounded-[10px] !border-slate-200/80 !bg-[#F4F8FF] hover:!bg-[#EBF3FF] !text-slate-700 !text-sm !font-medium !cursor-pointer transition-colors focus:!border-blue-500",
                                dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
                                option:
                                    "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
                            }}
                        />
                    )}

                    {/* Sana (Date) select */}
                    {showDate && (
                        <Select
                            value={date}
                            onChange={(val) => {
                                setDate(val || "today");
                                setCurrentPage(1);
                            }}
                            data={dateOptions}
                            allowDeselect={false}
                            maxDropdownHeight={450}
                            leftSection={<Calendar className="size-4 text-slate-400 pointer-events-none" />}
                            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
                            classNames={{
                                root: "w-full sm:w-40",
                                input:
                                    "!h-10 !rounded-[10px] !border-slate-200/80 !bg-[#F4F8FF] hover:!bg-[#EBF3FF] !text-slate-700 !text-sm !font-medium !cursor-pointer transition-colors focus:!border-blue-500",
                                dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
                                option:
                                    "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
                            }}
                        />
                    )}

                    {/* 3. Filtrni tozalash tugmasi */}
                    {showReset && (
                        <button
                            type="button"
                            onClick={onReset}
                            className="flex items-center gap-2 px-3.5 h-10 text-sm font-medium text-slate-700 bg-[#F4F8FF] border border-slate-200/80 hover:bg-[#EBF3FF] rounded-[10px] transition-colors cursor-pointer shrink-0"
                        >
                            <RotateCcw className="size-4 text-slate-500" />
                            <span>Filtrni tozalash</span>
                        </button>
                    )}

                    {/* Saralash (Sort) select */}
                    {showSort && (
                        <Select
                            value={sort}
                            onChange={(val) => {
                                setSort(val || "newest");
                                setCurrentPage(1);
                            }}
                            data={sortOptions}
                            allowDeselect={false}
                            maxDropdownHeight={450}
                            rightSection={<ChevronDown className="size-4 text-slate-400 pointer-events-none" />}
                            classNames={{
                                root: "w-full sm:w-48",
                                input:
                                    "!h-10 !rounded-[10px] !border-slate-200 !text-slate-800 !text-sm !font-medium !cursor-pointer hover:!bg-slate-50 transition-colors focus:!border-blue-500",
                                dropdown: "!rounded-[12px] !border-slate-200 !shadow-lg !p-1.5 !bg-white [&_.mantine-ScrollArea-scrollbar]:!hidden",
                                option:
                                    "!rounded-[8px] !text-sm !font-medium !py-2 !px-3 !cursor-pointer hover:!bg-slate-100 data-[checked=true]:!bg-blue-50 data-[checked=true]:!text-blue-600",
                            }}
                        />
                    )}

                    {/* Filtrlar tugmasi */}
                    {showFilterButton && (
                        <button
                            type="button"
                            onClick={onFilterClick}
                            className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-[10px] transition-colors cursor-pointer shrink-0"
                        >
                            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                            <span>Filtrlar</span>
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FilterBar;
