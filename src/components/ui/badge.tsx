import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border",
        accent: "border-transparent bg-accent/10 text-accent",
        primary: "border-transparent bg-primary/10 text-primary",
        muted: "border-transparent bg-muted text-muted-foreground",
        aiml: "border-transparent bg-[#2F6FED]/10 text-[#2F6FED]",
        co: "border-transparent bg-[#35C2A0]/10 text-[#35C2A0]",
        mech: "border-transparent bg-[#F59E0B]/10 text-[#F59E0B]",
        civil: "border-transparent bg-[#8B5CF6]/10 text-[#8B5CF6]",
        notes: "border-transparent bg-primary/10 text-primary",
        microproject: "border-transparent bg-accent/10 text-accent",
        capstone: "border-transparent bg-[#8B5CF6]/10 text-[#8B5CF6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
