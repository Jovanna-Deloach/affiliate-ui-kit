import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/cn";

/**
 * <SurfaceCard />
 * ---------------------------------------------------------------------------
 * Master layout container for every commerce surface (scorecards, offer
 * sheets, directory tiles). 100% of its geometry binds to the token contract:
 *
 *   --radius-surface        corner geometry (0px luxury · 0.75rem clinical)
 *   --border-width-surface  hairline weight
 *   --space-card-pad        padding density (scaled by `density`)
 *   --space-cluster-gap     vertical rhythm between children
 *   --shadow-surface(-hover) elevation (none luxury · tactile clinical)
 *   --duration-interactive / --ease-spring  hover physics
 *
 * Mobbin anatomy (Klarna retailer rows, Base44 wall-of-fame, Relevance AI
 * comparison): the card is a vertical flex stack; media bleeds to the edges
 * via <SurfaceCardMedia>; dividers run full-width via <SurfaceCardDivider>.
 * Server Component — no client JS. The `spotlight-hover` chroming is the
 * sanitized 21st.dev "border-only spotlight" as pure CSS.
 */

const surfaceCardVariants = cva(
  [
    "group/card relative isolate flex min-w-0 flex-col text-foreground",
    "rounded-surface transition-[box-shadow,border-color,translate] duration-interactive ease-spring",
  ],
  {
    variants: {
      chroming: {
        bordered: "border-surface-w border-border bg-surface shadow-surface",
        "hairline-divide": [
          "border-t-surface-w border-border bg-transparent",
          "rounded-[0]", // audit-allow: row chroming is edge-to-edge by definition
        ],
        elevated: "border-surface-w border-transparent bg-surface shadow-overlay",
        "spotlight-hover": "spotlight-ring shadow-surface hover:shadow-surface-hover",
        ghost: "bg-transparent",
      },
      density: {
        compact:
          "gap-[calc(var(--space-cluster-gap)*0.75)] p-[calc(var(--space-card-pad)*0.625)]",
        default: "gap-cluster-gap p-card-pad",
        spacious:
          "gap-[calc(var(--space-cluster-gap)*1.5)] p-[calc(var(--space-card-pad)*1.5)]",
      },
      /** Lifts on hover — for cards that are themselves a link target. */
      interactive: {
        true: "hover:-translate-y-px hover:shadow-surface-hover focus-within:shadow-surface-hover",
        false: "",
      },
    },
    defaultVariants: {
      chroming: "bordered",
      density: "default",
      interactive: false,
    },
  },
);

type SurfaceTag = "div" | "article" | "section" | "li" | "aside" | "figure";

export interface SurfaceCardProps
  extends ComponentProps<"div">,
    VariantProps<typeof surfaceCardVariants> {
  /** Semantic element. Defaults to `div`; use `article` for scorecards. */
  as?: SurfaceTag;
  /** Merge props onto the child instead of rendering a wrapper (Radix Slot). */
  asChild?: boolean;
}

export function SurfaceCard({
  as = "div",
  asChild = false,
  chroming,
  density,
  interactive,
  className,
  ...props
}: SurfaceCardProps) {
  const Comp: ElementType = asChild ? Slot : as;
  return (
    <Comp
      data-slot="surface-card"
      data-chroming={chroming ?? "bordered"}
      data-density={density ?? "default"}
      className={cn(surfaceCardVariants({ chroming, density, interactive }), className)}
      {...props}
    />
  );
}

/**
 * Edge-to-edge media slot. Negative margins undo the card padding so imagery
 * reaches the hairline; the top corners inherit the surface radius.
 */
export function SurfaceCardMedia({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="surface-card-media"
      className={cn(
        "relative -mx-card-pad -mt-card-pad overflow-hidden rounded-t-surface",
        "group-data-[density=compact]/card:-mx-[calc(var(--space-card-pad)*0.625)] group-data-[density=compact]/card:-mt-[calc(var(--space-card-pad)*0.625)]",
        "group-data-[density=spacious]/card:-mx-[calc(var(--space-card-pad)*1.5)] group-data-[density=spacious]/card:-mt-[calc(var(--space-card-pad)*1.5)]",
        className,
      )}
      {...props}
    />
  );
}

/** Full-width hairline between card sections, respecting density padding. */
export function SurfaceCardDivider({
  className,
  ...props
}: ComponentProps<"hr">) {
  return (
    <hr
      data-slot="surface-card-divider"
      className={cn(
        "-mx-card-pad border-0 border-t-surface-w border-border",
        "group-data-[density=compact]/card:-mx-[calc(var(--space-card-pad)*0.625)]",
        "group-data-[density=spacious]/card:-mx-[calc(var(--space-card-pad)*1.5)]",
        className,
      )}
      {...props}
    />
  );
}

/** Footer row: pinned to the bottom when the card stretches in a grid. */
export function SurfaceCardFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="surface-card-footer"
      className={cn(
        "mt-auto flex flex-wrap items-center justify-between gap-cluster-gap",
        className,
      )}
      {...props}
    />
  );
}

export { surfaceCardVariants };
