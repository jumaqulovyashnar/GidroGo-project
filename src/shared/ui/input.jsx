import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/shared/lib"
import { formatPhoneInput } from "@/shared/lib/phoneUtils"

const Input = React.forwardRef(function Input(
  {
    className,
    type,
    onInvalid,
    onInput,
    onChange,
    onKeyDown,
    onFocus,
    requiredMessage = "Iltimos, ushbu maydonni toʻldiring.",
    ...props
  },
  ref
) {
  const handleInvalid = (e) => {
    if (e.target.validity.valueMissing) {
      e.target.setCustomValidity(requiredMessage)
    } else if (e.target.validity.typeMismatch && type === "email") {
      e.target.setCustomValidity("Iltimos, toʻgʻri email manzilini kiriting.")
    }
    if (onInvalid) onInvalid(e)
  }

  const handleInput = (e) => {
    e.target.setCustomValidity("")
    if (type === "tel" && e.target) {
      const formatted = formatPhoneInput(e.target.value)
      if (e.target.value !== formatted) {
        e.target.value = formatted
      }
    }
    if (onInput) onInput(e)
  }

  const handleChange = (e) => {
    if (type === "tel" && e.target) {
      e.target.value = formatPhoneInput(e.target.value)
    }
    if (onChange) onChange(e)
  }

  const handleKeyDown = (e) => {
    // Telefon inputlarida oraliq bo'shliq (probel / space) bosilishini taqiqlash
    if (type === "tel" && (e.key === " " || e.code === "Space")) {
      e.preventDefault()
      return
    }

    // Telefon inputida + bosilganda +998 qilib berish
    if (type === "tel" && (e.key === "+" || e.key === "=")) {
      if (!e.target.value) {
        e.preventDefault()
        e.target.value = "+998"
        const event = new Event("input", { bubbles: true })
        e.target.dispatchEvent(event)
        if (onChange) onChange(e)
        return
      }
    }

    // Telefon inputida +998 (yoki qisqa prefiks) qolganda Backspace bosilsa, inputni butunlay tozalash
    if (type === "tel" && e.key === "Backspace") {
      const val = e.target.value || ""
      const digits = val.replace(/\D/g, "")
      // Agar faqat +998 yoki prefiks belgilari bo'lsa
      if (val === "+998" || val === "+99" || val === "+9" || val === "+" || (digits === "998" && val.length <= 4)) {
        e.preventDefault()
        e.target.value = ""
        const event = new Event("input", { bubbles: true })
        e.target.dispatchEvent(event)
        if (onChange) onChange(e)
        return
      }
    }

    if (onKeyDown) onKeyDown(e)
  }

  const handleFocus = (e) => {
    if (onFocus) onFocus(e)
  }

  return (
    <InputPrimitive
      ref={ref}
      type={type}
      data-slot="input"
      onInvalid={handleInvalid}
      onInput={handleInput}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
})

export { Input }
