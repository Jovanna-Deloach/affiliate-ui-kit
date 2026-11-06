import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** The button’s classes, shared with `BuyButton` so every button has one shape. */
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

export interface ButtonProps extends Omit<ComponentProps<"button">, "tw"> {
  /** `secondary` outlined (default) · `primary` the accent fill, at most one per viewport · `quiet` an underlined text action. */
  emphasis?: "primary" | "secondary" | "quiet";
  /** `md` 44px tall (default) · `lg` 48px. */
  size?: "md" | "lg";
  /** Spans its container. */
  fullWidth?: boolean;
  /** Renders the one child element (an `<a>`) with the button’s look instead of a `<button>`. */
  asChild?: boolean;
  /** Default `button`, so a button inside a form never submits it by accident. */
  type?: "button" | "submit" | "reset";
  /** Unavailable: half opacity, no pointer. Keep the label, so the reader sees what is unavailable. */
  disabled?: boolean;
  /** The label: sentence case, saying what happens (“Save this guide”); the face sets tracked capitals. */
  children?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * An action on the page that is not a purchase: save, compare, show all,
 * reset. Three emphasis levels, one shape. Labels say what happens; arrows
 * are icons, never glyphs in the label.
 *
 * **Use it for** in-page actions and, with `asChild`, a link that should
 * look like a button. **Not for** a link to a retailer: every monetized link
 * is a `BuyButton`, `BuyRow`, `BuyPill` or `BuyLink`. Keep `primary` for the
 * one action that matters in view.
 *
 * @summary An in-page action that is not a purchase: secondary, primary (one per view) or quiet.
 * @import import { Button } from "@/kit/ui";
 */
export function Button({ emphasis, size, fullWidth, asChild, type, className, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp type={asChild ? undefined : (type ?? "button")} className={cn(buttonStyles({ emphasis, size, fullWidth }), className)} {...props} />;
}
