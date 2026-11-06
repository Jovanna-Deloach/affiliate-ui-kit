import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Three emphasis levels, one shape. `primary` is the accent fill and is
 * reserved for the one action that matters in view (docs/DESIGN.md, rule 4).
 * Labels are written in sentence case and say what happens; the button face
 * sets them in tracked capitals (t-button). Arrows are icons, never glyphs.
 */
export const buttonStyles = cva(
  "kit-focus inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-ctl t-button transition-colors duration-(--dur) ease-(--ease) disabled:cursor-default disabled:opacity-50",
  {
    variants: {
      emphasis: {
        primary: "bg-accent text-on-accent hover:bg-accent-hover",
        secondary: "border border-line-strong bg-paper text-fg hover:border-fg",
        quiet: "kit-link px-0 text-fg",
      },
      size: {
        md: "h-11 px-5",
        lg: "h-12 px-6",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    compoundVariants: [{ emphasis: "quiet", class: "h-auto px-0 t-ui" }],
    defaultVariants: { emphasis: "secondary", size: "md", fullWidth: false },
  },
);

export interface ButtonProps extends ComponentProps<"button">, VariantProps<typeof buttonStyles> {
  asChild?: boolean;
}

export function Button({ emphasis, size, fullWidth, asChild, type, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp type={asChild ? undefined : (type ?? "button")} className={cn(buttonStyles({ emphasis, size, fullWidth }), className)} {...props} />;
}
