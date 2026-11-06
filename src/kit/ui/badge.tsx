import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Check, X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * A short label in a pill, in the micro-caps voice. One shape, four
 * surfaces:
 *
 *   solid    the award: the theme’s award colours (obsidian, with a brass
 *            border in Atelier)
 *   outline  a proof beside a name: “64 days on the wrist”
 *   frosted  a stamp on a photograph: translucent paper with a blur
 *   soft     a result or a status, in a tone: pass, fail, warn, neutral
 *
 * Written in sentence case; CSS sets the capitals. Colour is never the only
 * signal: pair a tone with a word or an icon.
 */
export const badgeStyles = cva("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap", {
  variants: {
    variant: {
      solid: "rounded-ctl border border-award-line bg-award px-2 py-1 text-on-award",
      outline: "rounded-ctl border border-line-strong px-2 py-1 text-fg",
      frosted: "rounded-ctl border border-line bg-paper/85 px-2.5 py-1.5 text-fg backdrop-blur-sm",
      soft: "rounded-full px-2 py-0.5",
    },
    tone: {
      neutral: "",
      pass: "",
      fail: "",
      warn: "",
    },
    size: {
      sm: "t-micro-sm",
      md: "t-micro",
    },
  },
  compoundVariants: [
    { variant: "soft", tone: "neutral", class: "bg-well text-fg" },
    { variant: "soft", tone: "pass", class: "bg-pass-soft text-pass" },
    { variant: "soft", tone: "fail", class: "bg-fail-soft text-fail" },
    { variant: "soft", tone: "warn", class: "bg-warn-soft text-warn" },
  ],
  defaultVariants: { variant: "outline", tone: "neutral", size: "sm" },
});

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeStyles> {}

export function Badge({ variant, tone, size, className, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeStyles({ variant, tone, size }), className)} {...props} />;
}

/** The award a pick holds (“Our pick”): a solid pill. Never numbered. */
export function Award({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Badge variant="solid" data-slot="award" className={cn("self-start justify-self-start", className)}>
      {children}
    </Badge>
  );
}

/** “Best price”: beside a lead price, only when another retailer has it in stock for more. */
export function BestPrice({ className }: { className?: string }) {
  return (
    <Badge variant="soft" tone="pass" className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-pass" />
      Best price
    </Badge>
  );
}

const RESULT = { pass: Check, fail: X, caution: AlertTriangle } as const;

/** A lab or bench result (pass, fail, near the limit), with an icon so colour is never the only signal. */
export function ResultMark({ status, children, className }: { status: keyof typeof RESULT; children: ReactNode; className?: string }) {
  const Icon = RESULT[status];
  return (
    <Badge variant="soft" tone={status === "caution" ? "warn" : status} className={cn("gap-1 pl-1.5", className)}>
      <Icon size="1.2em" strokeWidth={2.25} aria-hidden="true" />
      {children}
    </Badge>
  );
}
