import * as React from "react"
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/shared/lib"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-4 w-px inline-block",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
