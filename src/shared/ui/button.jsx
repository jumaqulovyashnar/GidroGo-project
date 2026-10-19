import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva } from "class-variance-authority"
import { cn } from "@/shared/lib"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#2563EB] text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs",
        primary:
          "bg-[#2563EB] text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs",
        destructive:
          "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-xs",
        "destructive-subtle":
          "bg-rose-50 text-rose-600 hover:bg-rose-100/90 hover:text-rose-700 border border-rose-200/80 shadow-2xs font-semibold",
        "primary-subtle":
          "bg-blue-50 text-blue-600 hover:bg-blue-100/90 hover:text-blue-700 border border-blue-200/80 shadow-2xs font-semibold",
        outline:
          "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-10 gap-2 px-4 text-sm font-medium rounded-xl has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8.5 gap-1.5 rounded-lg px-3 text-xs font-medium [&_svg:not([class*='size-'])]:size-3.5",
        md: "h-10.5 gap-2 rounded-xl px-4 text-sm font-medium",
        lg: "h-11 gap-2.5 rounded-xl px-5 text-sm font-semibold [&_svg:not([class*='size-'])]:size-4.5",
        xl: "h-12 gap-3 rounded-2xl px-6 text-base font-semibold [&_svg:not([class*='size-'])]:size-5",
        icon: "size-8 rounded-lg",
        "icon-xs":
          "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-lg",
        "icon-lg": "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
