import { create } from "zustand"
import { fermaDefaultValues } from "@/models/fermaSchema"

const initialFormData = fermaDefaultValues

export const useFermaModalStore = create((set) => ({
  isOpen: false,
  formData: initialFormData,
  imagePreview: null,
  selectedFile: null,

  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false, imagePreview: null, selectedFile: null, formData: initialFormData }),
  toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),

  setImagePreview: (imagePreview) => set({ imagePreview }),
  setSelectedFile: (selectedFile) => set({ selectedFile }),

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

  resetForm: () => set({ formData: initialFormData, imagePreview: null, selectedFile: null }),
}))

export default useFermaModalStore
