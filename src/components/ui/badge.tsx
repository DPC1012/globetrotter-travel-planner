import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm",
        coral: "bg-primary text-primary-foreground shadow-sm",
        emerald: "bg-emerald-600 text-white font-bold",
        amber: "bg-amber-500 text-amber-950 font-extrabold",
        secondary: "bg-secondary text-secondary-foreground border border-border/80",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-current text-foreground",
        stamp: "bg-white text-slate-900 border border-slate-300 shadow-md transform -rotate-1 font-serif",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
