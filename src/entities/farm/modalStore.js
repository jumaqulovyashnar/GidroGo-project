import { create } from "zustand"

const initialFormData = {
  name: "",
  phone: "",
  address: "",
  latitude: "",
  longitude: "",
  logoUrl: "",
  bossFullName: "",
  bossPhone: "",
  bossPassword: "",
}

export const useFermaModalStore = create((set) => ({
  isOpen: false,
  formData: initialFormData,
  imagePreview: null,

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, imagePreview: null, formData: initialFormData }),
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),

  setImagePreview: (imagePreview) => set({ imagePreview }),

  setFormField: (field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    })),

  setFormData: (newData) =>
    set((state) => ({
      formData: typeof newData === "function" ? newData(state.formData) : { ...state.formData, ...newData },
    })),

  resetForm: () => set({ formData: initialFormData, imagePreview: null }),
}))

export default useFermaModalStore
