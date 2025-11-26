"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-[#8B9AAD] bg-[#1C2128] data-[state=checked]:bg-[#73B400] data-[state=checked]:text-[#0D1117] data-[state=checked]:border-[#73B400] focus-visible:border-[#73B400] focus-visible:ring-[rgba(115,180,0,0.3)] aria-invalid:ring-destructive/20 aria-invalid:border-destructive size-6 shrink-0 rounded-[4px] border-2 shadow-md transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
