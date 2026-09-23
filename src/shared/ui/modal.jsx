import React, { useRef, useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { Building2, User, Plus, Inbox, Trash2, Image as ImageIcon } from "lucide-react"
import { useFermaModalStore } from "@/entities/farm"
import { Input } from "@/shared/ui"

export function CreateFermaModal() {
  const {
    isOpen,
    closeModal,
    formData,
    setFormField,
    resetForm,
    imagePreview,
    setImagePreview,
  } = useFermaModalStore()

  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormField(name, value)
  }

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setFormField("logoUrl", e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemoveImage = (e) => {
    e.stopPropagation()
    setImagePreview(null)
    setFormField("logoUrl", "")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Yangi ferma ma'lumotlari (Zustand):", formData)
    resetForm()
    closeModal()
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={closeModal}
      title={
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Building2 className="size-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">Yangi ferma qo'shish</h3>
            <p className="text-xs text-slate-500 mt-0.5">Ferma va uning rahbar rekvizitlarini kiriting</p>
          </div>
        </div>
      }
      size="550px"
      centered
      radius="xl"
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 4,
      }}
      styles={{
        content: {
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        },
        header: {
          borderBottom: "1px solid #f1f5f9",
          padding: "18px 24px",
          backgroundColor: "#ffffff",
        },
        body: {
          padding: "20px 24px 24px",
          maxHeight: "calc(85vh - 75px)",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        },
      }}
      className="[&_.mantine-Modal-body::-webkit-scrollbar]:hidden"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1-QATOR: Ant Design uslubidagi Rasm yuklash (Upload Dragger) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 block">
            Rasm yuklash (Ferma logotipi / muqovasi)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
                  : "border-slate-300 hover:border-blue-500 bg-slate-50/70 hover:bg-blue-50/20"
              }`}
            >
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="size-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center transition-transform group-hover:scale-110">
                  <Inbox className="size-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click or drag file to this area to upload
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 h-44 group">
              <img
                src={imagePreview}
                alt="Yuklangan rasm"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-semibold shadow-md hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <ImageIcon className="size-3.5" />
                  Almashtirish
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-md hover:bg-red-700 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  O'chirish
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Ferma ma'lumotlari */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <Building2 className="size-3.5" />
            <span>Ferma ma'lumotlari</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5">
              <label htmlFor="modal-name" className="text-xs font-semibold text-slate-700">
                Ferma nomi <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masalan: Oazis Agro"
                required
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-phone" className="text-xs font-semibold text-slate-700">
                Rasmiy telefon <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998 75 221 40 50"
                required
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="modal-address" className="text-xs font-semibold text-slate-700">
                Manzil <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Qarshi sh., Islom Karimov ko'chasi, 45-uy"
                required
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-latitude" className="text-xs font-semibold text-slate-700">
                Latitude (Kenglik)
              </label>
              <Input
                id="modal-latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="38.8612"
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-longitude" className="text-xs font-semibold text-slate-700">
                Longitude (Uzunlik)
              </label>
              <Input
                id="modal-longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="65.7847"
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 3. Ferma Rahbari (Boss) */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <User className="size-3.5" />
            <span>Ferma rahbari (Boss)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1.5 sm:col-span-2">
              <label htmlFor="modal-bossFullName" className="text-xs font-semibold text-slate-700">
                Rahbar F.I.Sh <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-bossFullName"
                name="bossFullName"
                value={formData.bossFullName}
                onChange={handleChange}
                placeholder="Aliyev Bobur Mansurovich"
                required
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-bossPhone" className="text-xs font-semibold text-slate-700">
                Rahbar telefoni <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-bossPhone"
                name="bossPhone"
                value={formData.bossPhone}
                onChange={handleChange}
                placeholder="+998 90 123 45 67"
                required
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-bossPassword" className="text-xs font-semibold text-slate-700">
                Parol <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-bossPassword"
                name="bossPassword"
                type="password"
                value={formData.bossPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="h-10 rounded-xl border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="size-4" />
            <span>Saqlash</span>
          </button>
        </div>
      </form>
    </MantineModal>
  )
}

export default CreateFermaModal
