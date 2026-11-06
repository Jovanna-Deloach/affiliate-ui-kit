import { cva } from "class-variance-authority";
import { AlertTriangle, Check, X } from "lucide-react";
import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** The badge’s classes, for parts that set the badge look on another element (the lab’s `AssayBadge`). */
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

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "tw"> {
  /** `outline` a proof beside a name (default) · `solid` an award · `frosted` a stamp on a photograph · `soft` a result or a status, in a `tone`. */
  variant?: "solid" | "outline" | "frosted" | "soft";
  /** For `soft`: `neutral` (default), `pass`, `fail`, `warn`. Pair a tone with a word or an icon: color is never the only signal. */
  tone?: "neutral" | "pass" | "fail" | "warn";
  /** `sm` 10px, on photographs and in rows (default) · `md` 11px, beside a name. */
  size?: "sm" | "md";
  /** The label, in sentence case: CSS sets the capitals. One short phrase, never a sentence. */
  children?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A short label in a pill, in the micro-caps voice: one shape, four
 * surfaces. Written in sentence case (CSS sets the capitals).
 *
 * **Use it for** a proof beside a name (“64 days on the wrist”), a stamp on
 * a photograph, a status in a table. **Not for** the award a pick holds
 * (`Award`), the best-price mark (`BestPrice`) or a lab result with its icon
 * (`ResultMark`): those are badges with their wording and tone decided.
 *
 * @summary A micro-caps pill: a proof, a stamp on a photograph or a status in a tone.
 * @import import { Badge } from "@/kit/ui";
 */
export function Badge({ variant, tone, size, className, ...props }: BadgeProps) {
  return <span data-slot="badge" className={cn(badgeStyles({ variant, tone, size }), className)} {...props} />;
}

export interface AwardProps {
  /** The award, in sentence case: “Our pick”, “Budget pick”, “Upgrade pick”. Never numbered. */
  children: ReactNode;
  /** Position it here when it sits on a photograph: `absolute top-4 left-4`. */
  className?: string;
}

/**
 * The award a pick holds, as a solid pill in the theme’s award colors
 * (obsidian, with a brass border in Atelier). Picks are awards, never
 * ranks: “Our pick”, not “01 — Best overall”.
 *
 * **Use it for** the head of a verdict card and the corner of a review
 * photograph. **Not for** the award in a table row or a catalog card,
 * where it is set as text (`Eyebrow`, `tone="category"`).
 *
 * @summary The award a pick holds (“Our pick”), as a solid pill. Never numbered.
 * @import import { Award } from "@/kit/ui";
 */
export function Award({ children, className }: AwardProps) {
  return (
    <Badge variant="solid" data-slot="award" className={cn("self-start justify-self-start", className)}>
      {children}
    </Badge>
  );
}

export interface BestPriceProps {
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * “Best price”, in the pass tone with a dot. A claim that has to be true:
 * show it only when another retailer has the product in stock for more.
 *
 * **Use it for** the lead price of an offer card or a feature verdict card.
 * **Not for** a product with a single in-stock retailer (there is nothing to
 * be best against) or a sale (`Price` with `was`).
 *
 * @summary “Best price” beside a lead price, only when another retailer has it in stock for more.
 * @import import { BestPrice } from "@/kit/ui";
 */
export function BestPrice({ className }: BestPriceProps) {
  return (
    <Badge variant="soft" tone="pass" className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-pass" />
      Best price
    </Badge>
  );
}

const RESULT = { pass: Check, fail: X, caution: AlertTriangle } as const;

export interface ResultMarkProps {
  /** `pass`, `fail`, or `caution` (near the limit): sets the tone and the icon. */
  status: "pass" | "fail" | "caution";
  /** The result in a word or two: “Pass”, “Fail”, “Near limit”. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A lab or bench result as a soft pill with an icon (a tick, a cross, a
 * warning), so color is never the only signal.
 *
 * **Use it for** a pass or fail in a comparison or a lab table. **Not for**
 * a measured value: print the figure and add a mark only when it fails.
 *
 * @summary A pass, fail or near-limit result as a pill with an icon.
 * @import import { ResultMark } from "@/kit/ui";
 */
export function ResultMark({ status, children, className }: ResultMarkProps) {
  const Icon = RESULT[status];
  return (
    <Badge variant="soft" tone={status === "caution" ? "warn" : status} className={cn("gap-1 pl-1.5", className)}>
      <Icon size="1.2em" strokeWidth={2.25} aria-hidden="true" />
      {children}
    </Badge>
  );
}
