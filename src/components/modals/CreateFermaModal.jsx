import React, { useRef, useState } from "react"
import { Modal as MantineModal } from "@mantine/core"
import { Building2, User, Plus, Inbox, Trash2, Image as ImageIcon, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { useFermaModalStore, fermaSchema } from "@/entities/farm"
import { Button, Input, Spinner } from "@/shared/ui"
import { useUpload, useCreateFarm } from "@/shared/hooks"
import { formatPhoneInput } from "@/shared/lib"

export function CreateFermaModal() {
  const {
    isOpen,
    closeModal,
    formData,
    setFormField,
    resetForm,
    imagePreview,
    setImagePreview,
    setSelectedFile,
  } = useFermaModalStore()

  const [errors, setErrors] = useState({})
  const [showBossPassword, setShowBossPassword] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const uploadMutation = useUpload()
  const createFarmMutation = useCreateFarm()

  const handleClose = () => {
    setErrors({})
    closeModal()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    const finalValue = (name === "phone" || name === "bossPhone") ? formatPhoneInput(value) : value
    setFormField(name, finalValue)
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleFile = async (file) => {
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Faqat rasm formatidagi fayllar qabul qilinadi!")
      return
    }

    // Maksimal hajm: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Rasm hajmi 5MB dan oshmasligi kerak!")
      return
    }

    setSelectedFile(file)

    // Mahalliy tezkor preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)

    // useUpload orqali serverga yuklash
    try {
      const res = await uploadMutation.mutateAsync(file)
      const uploadedUrl =
        res?.data?.url ||
        res?.url ||
        res?.data?.fileUrl ||
        res?.fileUrl ||
        res?.data?.photoUrl ||
        res?.photoUrl ||
        res?.data?.fileDownloadUri ||
        res?.fileDownloadUri ||
        res?.data?.path ||
        res?.path ||
        (typeof res?.data === "string" ? res.data : "") ||
        (typeof res === "string" ? res : "") ||
        ""

      if (uploadedUrl) {
        setFormField("logoUrl", uploadedUrl)
        toast.success("Rasm serverga muvaffaqiyatli yuklandi!")
      }
    } catch (err) {
      console.error("Rasm yuklashda xatolik:", err)
      toast.error(err?.message || "Rasm yuklashda xatolik yuz berdi")
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
    setSelectedFile(null)
    setFormField("logoUrl", "")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (uploadMutation.isPending) {
      toast.warning("Iltimos, rasm serverga yuklanishini kuting!")
      return
    }

    // Zod orqali validatsiya qilish
    const validationResult = fermaSchema.safeParse(formData)
    if (!validationResult.success) {
      const fieldErrors = {}
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message
        }
      })
      setErrors(fieldErrors)

      const firstMessage = validationResult.error.issues[0]?.message
      if (firstMessage) {
        toast.error(firstMessage)
      }
      return
    }

    setErrors({})

    try {
      let finalLogoUrl = formData.logoUrl
      if (selectedFile && !finalLogoUrl) {
        try {
          const res = await uploadMutation.mutateAsync(selectedFile)
          finalLogoUrl =
            res?.data?.url ||
            res?.url ||
            res?.data?.fileUrl ||
            res?.fileUrl ||
            (typeof res?.data === "string" ? res.data : "") ||
            ""
        } catch (uploadErr) {
          console.error("Rasm yuklashda xatolik:", uploadErr)
        }
      }

      await createFarmMutation.mutateAsync({
        ...formData,
        logoUrl: finalLogoUrl || formData.logoUrl || "",
        latitude: Number(formData.latitude) || 0,
        longitude: Number(formData.longitude) || 0,
      })

      toast.success("Yangi ferma muvaffaqiyatli qo'shildi!")
      resetForm()
      setErrors({})
      closeModal()
    } catch (err) {
      console.error("Ferma yaratishda xatolik:", err)
      toast.error(err?.message || "Ferma yaratishda xatolik yuz berdi")
    }
  }

  return (
    <MantineModal
      opened={isOpen}
      onClose={handleClose}
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
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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
                    Rasmni shu yerga tashlang yoki tanlang
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    PNG, JPG, WEBP formatlaridagi rasm (maksimal 5MB)
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
              {uploadMutation.isPending && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 text-white z-10">
                  <Spinner size="md" className="border-t-white border-blue-300" />
                  <span className="text-xs font-semibold">Rasm serverga yuklanmoqda...</span>
                </div>
              )}
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
                className={`h-10 rounded-xl text-sm ${
                  errors.name
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.name && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-phone" className="text-xs font-semibold text-slate-700">
                Rasmiy telefon <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998752214050"
                className={`h-10 rounded-xl text-sm ${
                  errors.phone
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.phone && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.phone}</p>}
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
                className={`h-10 rounded-xl text-sm ${
                  errors.address
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.address && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.address}</p>}
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
                className={`h-10 rounded-xl text-sm ${
                  errors.latitude
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.latitude && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.latitude}</p>}
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
                className={`h-10 rounded-xl text-sm ${
                  errors.longitude
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.longitude && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.longitude}</p>}
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
                className={`h-10 rounded-xl text-sm ${
                  errors.bossFullName
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.bossFullName && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.bossFullName}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-bossPhone" className="text-xs font-semibold text-slate-700">
                Rahbar telefoni <span className="text-rose-500">*</span>
              </label>
              <Input
                id="modal-bossPhone"
                name="bossPhone"
                type="tel"
                autoComplete="username"
                value={formData.bossPhone}
                onChange={handleChange}
                placeholder="+998901234567"
                className={`h-10 rounded-xl text-sm ${
                  errors.bossPhone
                    ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                    : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                }`}
              />
              {errors.bossPhone && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.bossPhone}</p>}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="modal-bossPassword" className="text-xs font-semibold text-slate-700">
                Parol <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="modal-bossPassword"
                  name="bossPassword"
                  type={showBossPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.bossPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`h-10 rounded-xl text-sm pr-10 ${
                    errors.bossPassword
                      ? "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-100"
                      : "border-slate-200 focus-visible:border-blue-500 focus-visible:ring-blue-100"
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowBossPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer transition-colors"
                  title={showBossPassword ? "Parolni yashirish" : "Parolni ko'rsatish"}
                >
                  {showBossPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.bossPassword && <p className="text-[11px] font-medium text-rose-500 mt-1">{errors.bossPassword}</p>}
            </div>
          </div>
        </div>

        {/* 4. Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createFarmMutation.isPending || uploadMutation.isPending}
            className="h-10 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 text-sm font-semibold transition-colors cursor-pointer"
          >
            Bekor qilish
          </Button>
          <Button
            type="submit"
            disabled={createFarmMutation.isPending || uploadMutation.isPending}
            className="h-10 px-5 rounded-xl bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors cursor-pointer shadow-xs gap-2"
          >
            {createFarmMutation.isPending ? (
              <>
                <Spinner size="xs" className="border-t-white border-blue-200" />
                <span>Saqlanmoqda...</span>
              </>
            ) : uploadMutation.isPending ? (
              <>
                <Spinner size="xs" className="border-t-white border-blue-200" />
                <span>Rasm yuklanmoqda...</span>
              </>
            ) : (
              <>
                <Plus className="size-4" />
                <span>Saqlash</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </MantineModal>
  )
}
