import { useState, useMemo } from "react"
import {
  Package,
  Plus,
  RefreshCw,
  Edit2,
  Droplet,
  Boxes,
  Coins,
  X,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import {
  useManagerProducts,
  useManagerCreateProduct,
  useManagerUpdateProduct,
  useManagerStockWarehouse,
  useManagerUpdateStockWarehouse,
} from "@/shared/hooks"
import { Spinner } from "@/shared/ui"

export default function ManagerProductsPage() {
  const [activeTab, setActiveTab] = useState("products") // 'products' | 'stock'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingStockItem, setEditingStockItem] = useState(null)

  // API hooks
  const {
    data: productsRes,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useManagerProducts()

  const {
    data: stockRes,
    isLoading: isStockLoading,
    refetch: refetchStock,
  } = useManagerStockWarehouse()

  const createProductMutation = useManagerCreateProduct()
  const updateProductMutation = useManagerUpdateProduct()
  const updateStockMutation = useManagerUpdateStockWarehouse()

  const rawProducts =
    productsRes?.data || (Array.isArray(productsRes) ? productsRes : null)
  const products = useMemo(
    () => (Array.isArray(rawProducts) ? rawProducts : []),
    [rawProducts]
  )

  const rawStock = stockRes?.data || (Array.isArray(stockRes) ? stockRes : null)
  const stockItems = useMemo(
    () => (Array.isArray(rawStock) ? rawStock : []),
    [rawStock]
  )

  // Form states for Add / Edit Product
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    volumeLiters: "18.9",
    depositPrice: "0",
    description: "",
  })

  // Form state for Stock Update
  const [stockQuantity, setStockQuantity] = useState("")

  const handleOpenAddModal = () => {
    setProductForm({
      name: "",
      price: "",
      volumeLiters: "18.9",
      depositPrice: "0",
      description: "",
    })
    setIsAddModalOpen(true)
  }

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name || "",
      price: String(prod.price || ""),
      volumeLiters: String(prod.volumeLiters || "18.9"),
      depositPrice: String(prod.depositPrice || "0"),
      description: prod.description || "",
      active: prod.active !== undefined ? prod.active : true,
    })
  }

  const handleOpenEditStock = (item) => {
    setEditingStockItem(item)
    setStockQuantity(String(item.quantity || "0"))
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    if (!productForm.name.trim() || !productForm.price) {
      toast.error("Mahsulot nomi va narxini kiritish majburiy!")
      return
    }

    try {
      await createProductMutation.mutateAsync({
        name: productForm.name.trim(),
        price: Number(productForm.price),
        volumeLiters: Number(productForm.volumeLiters || 18.9),
        depositPrice: Number(productForm.depositPrice || 0),
        description: productForm.description?.trim(),
      })
      toast.success("Yangi suv turi muvaffaqiyatli qo'shildi!")
      setIsAddModalOpen(false)
      refetchProducts()
      refetchStock()
    } catch (err) {
      toast.error(err?.message || "Mahsulot qo'shishda xatolik yuz berdi")
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    if (!editingProduct) return
    if (!productForm.name.trim() || !productForm.price) {
      toast.error("Mahsulot nomi va narxini kiritish majburiy!")
      return
    }

    try {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: {
          name: productForm.name.trim(),
          price: Number(productForm.price),
          volumeLiters: Number(productForm.volumeLiters || 18.9),
          depositPrice: Number(productForm.depositPrice || 0),
          description: productForm.description?.trim(),
          active: productForm.active,
        },
      })
      toast.success("Mahsulot muvaffaqiyatli yangilandi!")
      setEditingProduct(null)
      refetchProducts()
    } catch (err) {
      toast.error(err?.message || "O'zgartirishda xatolik yuz berdi")
    }
  }

  const handleUpdateStock = async (e) => {
    e.preventDefault()
    if (!editingStockItem) return
    const qty = Number(stockQuantity)
    if (isNaN(qty) || qty < 0) {
      toast.error("Noto'g'ri miqdor kiritildi!")
      return
    }

    try {
      await updateStockMutation.mutateAsync({
        productId: editingStockItem.productId || editingStockItem.id,
        quantity: qty,
      })
      toast.success("Ombor zaxirasi muvaffaqiyatli yangilandi!")
      setEditingStockItem(null)
      refetchStock()
    } catch (err) {
      toast.error(err?.message || "Zaxirani yangilashda xatolik yuz berdi")
    }
  }

  const totalStockCount = stockItems.reduce(
    (acc, s) => acc + Number(s.quantity || 0),
    0
  )

  return (
    <div className="space-y-6 sm:space-y-7 pb-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Mahsulotlar va Ombor zaxirasi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fermaning suv turlari, narxlari va ombordagi mavjud idishlar zaxirasini boshqarish.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              refetchProducts()
              refetchStock()
            }}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
            title="Yangilash"
          >
            <RefreshCw className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Plus className="size-4" />
            <span>Yangi suv turi qo'shish</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Jami suv turlari</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">{products.length}</span>
              <span className="text-xs font-semibold text-slate-400">xil mahsulot</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Sotuvda mavjud turlar</p>
          </div>
          <div className="size-12 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Droplet className="size-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Ombordagi to'la suv zaxirasi</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {totalStockCount.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-400">dona idish</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Barcha idishlar tayyor holatda</p>
          </div>
          <div className="size-12 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
            <Boxes className="size-5.5" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">O'rtacha suv narxi</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900">
                {products.length > 0
                  ? Math.round(
                      products.reduce((acc, p) => acc + Number(p.price || 0), 0) /
                        products.length
                    ).toLocaleString()
                  : "0"}
              </span>
              <span className="text-xs font-semibold text-slate-400">so'm</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Barcha mahsulotlar bo'yicha</p>
          </div>
          <div className="size-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Coins className="size-5.5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="size-4" />
          <span>Suv turlari ({products.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("stock")}
          className={`pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === "stock"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Boxes className="size-4" />
          <span>Ombordagi zaxira ({stockItems.length})</span>
        </button>
      </div>

      {/* Tab 1: Suv turlari (Products) */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {isProductsLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <Spinner size="md" />
              <span>Mahsulotlar yuklanmoqda...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
              <Droplet className="size-8 text-slate-300" />
              <span>Hozircha mahsulotlar mavjud emas.</span>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer"
              >
                + Birinchi suv turini qo'shish
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <th className="py-3.5 px-4">Mahsulot nomi</th>
                    <th className="py-3.5 px-4">Hajmi (Litr)</th>
                    <th className="py-3.5 px-4">Suv narxi</th>
                    <th className="py-3.5 px-4">Idish depoziti</th>
                    <th className="py-3.5 px-4">Holat</th>
                    <th className="py-3.5 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="size-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                            <Droplet className="size-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {p.name}
                            </span>
                            {p.description && (
                              <span className="text-xs text-slate-400 line-clamp-1">
                                {p.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-slate-700">
                        {p.volumeLiters ? `${p.volumeLiters} L` : "18.9 L"}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900 font-mono">
                        {Number(p.price || 0).toLocaleString()} so'm
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-600">
                        {p.depositPrice ? `${Number(p.depositPrice).toLocaleString()} so'm` : "Yo'q"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            p.active !== false
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {p.active !== false ? "Faol" : "Nofaol"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="size-3.5 text-slate-500" />
                          <span>Tahrirlash</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Ombordagi zaxira (Warehouse Stock) */}
      {activeTab === "stock" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
          {isStockLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
              <Spinner size="md" />
              <span>Ombor zaxirasi yuklanmoqda...</span>
            </div>
          ) : stockItems.length === 0 ? (
            <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <Boxes className="size-8 text-slate-300" />
              <span>Omborda kiritilgan zaxiralar mavjud emas.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
                    <th className="py-3.5 px-4">Mahsulot nomi</th>
                    <th className="py-3.5 px-4">Ombordagi zaxira (dona)</th>
                    <th className="py-3.5 px-4">Oxirgi yangilangan vaqt</th>
                    <th className="py-3.5 px-4 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stockItems.map((item) => (
                    <tr key={item.id || item.productId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        {item.productName || `Mahsulot #${item.productId}`}
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-blue-600 font-mono text-base">
                          {Number(item.quantity || 0).toLocaleString()} dona
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-500 font-mono">
                        {item.updatedAt
                          ? new Date(item.updatedAt).toLocaleString("uz-UZ", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })
                          : "—"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditStock(item)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          Zaxirani o'zgartirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Yangi suv turi qo'shish */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Yangi suv turi qo'shish
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suv turi nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: 18.9L Toza Suv"
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Narxi (so'm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="15000"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hajmi (Litr)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="18.9"
                    value={productForm.volumeLiters}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        volumeLiters: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bo'sh idish depozit narxi (so'm)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={productForm.depositPrice}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      depositPrice: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows="2"
                  placeholder="Tabiiy filtrlangan toza ichimlik suvi..."
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={createProductMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {createProductMutation.isPending ? (
                    <Spinner size="xs" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mahsulotni tahrirlash */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Mahsulotni tahrirlash
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Suv turi nomi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) =>
                    setProductForm({ ...productForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Narxi (so'm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({ ...productForm, price: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hajmi (Litr)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={productForm.volumeLiters}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        volumeLiters: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bo'sh idish depozit narxi (so'm)
                </label>
                <input
                  type="number"
                  min="0"
                  value={productForm.depositPrice}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      depositPrice: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={productForm.active}
                  onChange={(e) =>
                    setProductForm({ ...productForm, active: e.target.checked })
                  }
                  className="size-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="activeCheck"
                  className="text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Sotuvda faol (mijozlar buyurtma bera oladi)
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={updateProductMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {updateProductMutation.isPending ? (
                    <Spinner size="xs" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>Yangilash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Ombordagi zaxirani yangilash */}
      {editingStockItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                Zaxirani yangilash
              </h3>
              <button
                type="button"
                onClick={() => setEditingStockItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateStock} className="p-5 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">
                  Mahsulot:
                </span>
                <span className="text-sm font-bold text-slate-900 block">
                  {editingStockItem.productName || `Mahsulot #${editingStockItem.productId}`}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ombordagi mavjud miqdor (dona idish) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white font-mono text-base font-bold text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStockItem(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={updateStockMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {updateStockMutation.isPending ? (
                    <Spinner size="xs" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>Zaxirani saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
