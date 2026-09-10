import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  onInvalid,
  onInput,
  requiredMessage = "Iltimos, ushbu maydonni toʻldiring.",
  ...props
}) {
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
    if (onInput) onInput(e)
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      onInvalid={handleInvalid}
      onInput={handleInput}
      className={cn(
        "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
