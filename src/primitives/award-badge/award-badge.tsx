import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { AwardBadgeData, AwardTier } from "@/types/affiliate";

/**
 * <AwardBadge />
 * ---------------------------------------------------------------------------
 * Editorial accolade — "Best Overall", "Editor's Pick", "Best for Speed Work".
 *
 * ONE silhouette for the whole family (Law of Similarity): a high-contrast
 * inverse-fill tag with the eyebrow voice and an optional left-hand rank
 * index separated by a vertical hairline:  `01 | BEST OVERALL`.
 * Inventory / commercial state is a <StatusPill kind="status" /> (pill +
 * dot); lab credentials are <StatusPill kind="technical" /> (recessed chip).
 * Accolades never borrow those shapes.
 *
 *   --surface-inverse / --ink-inverse     accolade ink
 *   --radius-tag                          3px architectural corner
 *   --inset-accolade-x / -y               10px / 4px
 *   --text-eyebrow / --tracking-eyebrow   11px · 500 · 0.12em · uppercase
 *
 * Surfaces
 *   inverse   default — solid ink block
 *   glass     frosted surface for sitting over photography (same geometry)
 *   outline   hairline-strong on the card plane for secondary callouts
 *
 * One line; truncates with an ellipsis inside a narrow slot. Server
 * Component, zero JS — safe inside 30-item loops.
 */

export const AWARD_BADGE_SURFACES = ["inverse", "glass", "outline"] as const;
export type AwardBadgeSurface = (typeof AWARD_BADGE_SURFACES)[number];

const badgeVariants = cva(
  [
    "inline-flex w-fit max-w-full shrink-0 items-stretch overflow-hidden",
    "rounded-tag border type-eyebrow whitespace-nowrap [&_svg]:shrink-0",
  ],
  {
    variants: {
      surface: {
        inverse: "border-inverse bg-inverse text-ink-inverse [--accolade-rule:color-mix(in_srgb,var(--ink-inverse)_28%,transparent)]",
        glass: [
          "border-hairline bg-surface/92 text-ink shadow-badge backdrop-blur-glass",
          "[--accolade-rule:var(--border-hairline)]",
        ],
        outline: "border-strong bg-surface text-ink [--accolade-rule:var(--border-hairline)]",
      },
      size: {
        sm: "[--eyebrow-size:calc(var(--text-eyebrow)*0.9)]",
        md: "",
        lg: "[--eyebrow-size:calc(var(--text-eyebrow)*1.1)]",
      },
    },
    defaultVariants: { surface: "inverse", size: "md" },
  },
);

export interface AwardBadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof badgeVariants> {
  /** Canonical payload slice — supplies `tier` and the label. */
  badge?: AwardBadgeData;
  /** Label text when not using `badge`. */
  children?: ReactNode;
  /** Accolade tier (data attribute for consumers; the silhouette never changes). */
  tier?: AwardTier;
  /** Rank index → "01" cell with a vertical hairline. */
  rank?: number | string;
  /** lucide-react icon at 1.1em / 1.5 stroke. */
  icon?: LucideIcon;
  /** Render as the child element (e.g. a link to the methodology). */
  asChild?: boolean;
}

function formatRank(rank: number | string) {
  return typeof rank === "number" ? String(rank).padStart(2, "0") : rank;
}

export function AwardBadge({
  badge,
  children,
  tier,
  rank,
  icon: Icon,
  surface,
  size,
  asChild = false,
  className,
  ...props
}: AwardBadgeProps) {
  const resolvedTier: AwardTier = badge?.tier ?? tier ?? "winner";
  const resolvedSurface = surface ?? (resolvedTier === "callout" ? "outline" : "inverse");
  const label = badge?.label ?? children;
  const Comp = asChild ? Slot : "span";

  const content = (
    <>
      {rank !== undefined && (
        <span
          data-slot="badge-rank"
          className="flex items-center border-r-[length:var(--border-width)] border-[color:var(--accolade-rule)] px-[calc(var(--inset-accolade-x)*0.8)] font-mono font-medium tabular-nums"
        >
          {formatRank(rank)}
        </span>
      )}
      <span
        data-slot="badge-label"
        className="flex min-w-0 items-center gap-[0.5em] px-accolade-x py-accolade-y"
      >
        {Icon && <Icon size="1.1em" strokeWidth={1.5} aria-hidden="true" />}
        <span className="min-w-0 truncate">{label}</span>
      </span>
    </>
  );

  return (
    <Comp
      data-slot="award-badge"
      data-tier={resolvedTier}
      data-surface={resolvedSurface}
      className={cn(badgeVariants({ surface: resolvedSurface, size }), className)}
      {...props}
    >
      {asChild ? <Slottable>{content}</Slottable> : content}
    </Comp>
  );
}

export { badgeVariants as awardBadgeVariants };
