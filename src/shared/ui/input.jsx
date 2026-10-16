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

    // Telefon inputida +998 prefiksini o'chirishni taqiqlash
    if (type === "tel" && e.key === "Backspace") {
      const target = e.target
      const selStart = target.selectionStart
      const selEnd = target.selectionEnd
      const val = target.value || ""

      // Agar faqat +998 bo'lsa yoki kursor +998 ichida/boshida bo'lsa
      if (val.length <= 4 && selStart <= 4) {
        e.preventDefault()
        return
      }

      if (selStart <= 4 && selEnd <= 4) {
        e.preventDefault()
        return
      }

      // Agar foydalanuvchi +998 ni ham belgilab (select) o'chirmoqchi bo'lsa
      if (selStart < 4 && selEnd > 4) {
        e.preventDefault()
        target.value = "+998" + val.slice(selEnd)
        target.setSelectionRange(4, 4)
        const event = new Event("input", { bubbles: true })
        target.dispatchEvent(event)
        if (onChange) onChange(e)
        return
      }
    }

    // Delete tugmasi bilan ham +998 ni o'chirishni taqiqlash
    if (type === "tel" && e.key === "Delete") {
      const target = e.target
      const selStart = target.selectionStart
      if (selStart < 4) {
        e.preventDefault()
        return
      }
    }

    if (onKeyDown) onKeyDown(e)
  }

  const handleFocus = (e) => {
    if (type === "tel" && e.target) {
      if (!e.target.value || !e.target.value.startsWith("+998")) {
        e.target.value = "+998"
        if (onChange) onChange(e)
      }
      setTimeout(() => {
        if (e.target && e.target.selectionStart < 4) {
          const len = e.target.value.length
          e.target.setSelectionRange(len, len)
        }
      }, 0)
    }
    if (onFocus) onFocus(e)
  }

  const handleClick = (e) => {
    if (type === "tel" && e.target && e.target.selectionStart < 4) {
      const len = e.target.value.length
      e.target.setSelectionRange(len, len)
    }
    if (props.onClick) props.onClick(e)
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
      onClick={handleClick}
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
})

export { Input }
