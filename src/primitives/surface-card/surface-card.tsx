import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/cn";

/**
 * <SurfaceCard />
 * ---------------------------------------------------------------------------
 * The Plane-1 container every commerce surface sits on. ONE geometry across
 * the whole kit (`--radius-container` 6px, 1px hairline, 24px inset); the
 * verticals only tint it.
 *
 *   --radius-container · --border-hairline · --surface-primary
 *   --inset-card (-compact / -spacious)      density
 *   --gap-stack                              rhythm between child blocks
 *   --surface-recessed + --inset-bar-*       the action-bar footer (Plane 2)
 *
 * Chroming
 *   bordered        hairline container (default)
 *   elevated        hairline + the kit's one soft shadow (floating docks, popovers)
 *   recessed        Plane-2 well — nested inside another card
 *   hairline-divide list row: top hairline only, no radius
 *   spotlight       bordered + hover ring physics (sanitized 21st.dev spotlight)
 *   ghost           no chrome
 *
 * Anatomy slots: <SurfaceCardMedia /> bleeds imagery to the hairline;
 * <SurfaceCardDivider /> is a full-width rule; <SurfaceCardFooter
 * variant="action-bar" /> is the recessed bottom bar that anchors the card
 * (Law of Closure — never a floating footer above dead space; grids that hold
 * cards use `items-start`).
 *
 * Server Component — no client JS.
 */

const surfaceCardVariants = cva(
  [
    "group/card relative isolate flex min-w-0 flex-col gap-stack text-ink",
    "transition-[box-shadow,border-color,translate] duration-interactive ease-standard",
  ],
  {
    variants: {
      chroming: {
        bordered: "rounded-container border border-hairline bg-surface shadow-surface",
        elevated: "rounded-container border border-hairline bg-surface shadow-elevated",
        recessed: "rounded-inner border border-hairline bg-recessed",
        "hairline-divide": "border-t border-hairline bg-transparent",
        spotlight: "spotlight-ring rounded-container shadow-surface hover:shadow-elevated",
        ghost: "bg-transparent",
      },
      density: {
        compact: "p-card-compact",
        default: "p-card",
        spacious: "p-card-spacious",
      },
      /** Lifts on hover — for cards that are themselves a link target. */
      interactive: {
        true: "hover:-translate-y-px hover:shadow-elevated focus-within:shadow-elevated",
        false: "",
      },
    },
    defaultVariants: { chroming: "bordered", density: "default", interactive: false },
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

/** Negative-margin helpers so slots reach the hairline at every density. */
const BLEED_X =
  "-mx-card group-data-[density=compact]/card:-mx-card-compact group-data-[density=spacious]/card:-mx-card-spacious";
const BLEED_TOP =
  "-mt-card group-data-[density=compact]/card:-mt-card-compact group-data-[density=spacious]/card:-mt-card-spacious";
const BLEED_BOTTOM =
  "-mb-card group-data-[density=compact]/card:-mb-card-compact group-data-[density=spacious]/card:-mb-card-spacious";

/** Edge-to-edge media slot: imagery reaches the hairline; top corners follow the container. */
export function SurfaceCardMedia({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="surface-card-media"
      className={cn("relative overflow-hidden rounded-t-container", BLEED_X, BLEED_TOP, className)}
      {...props}
    />
  );
}

/** Full-width hairline between card sections. */
export function SurfaceCardDivider({ className, ...props }: ComponentProps<"hr">) {
  return (
    <hr
      data-slot="surface-card-divider"
      className={cn("border-0 border-t border-hairline", BLEED_X, className)}
      {...props}
    />
  );
}

const footerVariants = cva("mt-auto flex flex-wrap items-center justify-between gap-cluster", {
  variants: {
    variant: {
      /** Inline row inside the card padding. */
      inline: "",
      /** Full-bleed hairline bar on the card plane. */
      "hairline-bar": ["border-t border-hairline px-bar-x py-bar-y", BLEED_X, BLEED_BOTTOM],
      /** Recessed Plane-2 action bar — the card's anchor. */
      "action-bar": [
        "rounded-b-container border-t border-hairline bg-recessed px-bar-x py-bar-y",
        "transition-colors duration-interactive ease-standard",
        "hover:bg-[color-mix(in_srgb,var(--surface-recessed)_55%,var(--surface-primary))]",
        BLEED_X,
        BLEED_BOTTOM,
      ],
    },
  },
  defaultVariants: { variant: "inline" },
});

/** Footer row: pinned to the bottom when the card stretches in a grid. */
export function SurfaceCardFooter({
  variant,
  className,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof footerVariants>) {
  return (
    <div
      data-slot="surface-card-footer"
      data-variant={variant ?? "inline"}
      className={cn(footerVariants({ variant }), className)}
      {...props}
    />
  );
}

export { surfaceCardVariants };
