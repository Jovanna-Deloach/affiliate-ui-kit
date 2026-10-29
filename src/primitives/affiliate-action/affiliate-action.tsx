"use client";

import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ComponentProps, MouseEvent, ReactNode } from "react";

import { buildAffiliateHref, emitAffiliateClick, mergeRel } from "@/lib/affiliate";
import { cn } from "@/lib/cn";
import type { AffiliateAttribution, AffiliateClickEvent } from "@/types/affiliate";

/**
 * <AffiliateAction />
 * ---------------------------------------------------------------------------
 * The ONLY way a monetized outbound link leaves the site. Enforces:
 *
 *   • rel="sponsored nofollow noopener"  (merged with any consumer rel — never dropped)
 *   • UTM / subId injection via buildAffiliateHref (existing params preserved)
 *   • click tracking on onClick AND onAuxClick (middle-click / new-tab opens),
 *     fanned out to `onTrack` and a global `affiliate:click` CustomEvent
 *   • target="_blank" by default, with a visually-hidden "(opens in a new tab)"
 *
 * Variants bind to the contract: --size-control (tap target), --radius-interactive,
 * --radius-badge (price pill), --space-badge-x, type-eyebrow voice, accent ink.
 *
 * 21st.dev physics (mechanics.css): `arrow-nudge` (interactive-hover-button),
 * `sheen-sweep` (klyv shimmer, paused until hover). Client leaf because of the
 * handlers — but no animation controllers, so it is loop-safe.
 *
 * Mobbin anatomy (adidas "ADD TO BAG →", Vipps "Select", Fable "Buy on …"):
 * a flat directional CTA with a trailing arrow; outline for secondary
 * merchants; price-as-label pill for dense comparison rows.
 */

const actionVariants = cva(
  [
    "group/action relative inline-flex shrink-0 items-center justify-center gap-[0.5em]",
    "whitespace-nowrap select-none focus-ring cursor-pointer",
    "transition-[background-color,color,border-color,box-shadow,opacity] duration-interactive ease-spring",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      intent: {
        "primary-cta": [
          "type-eyebrow leading-none rounded-interactive border-interactive-w border-accent",
          "bg-accent text-accent-foreground",
          "hover:bg-[color-mix(in_srgb,var(--color-accent)_86%,var(--color-surface))]",
        ],
        "merchant-outline": [
          "type-eyebrow leading-none rounded-interactive border-interactive-w border-border-strong",
          "bg-surface text-foreground",
          "hover:border-foreground hover:bg-surface-recessed",
        ],
        "price-pill": [
          "rounded-badge border-interactive-w border-transparent bg-surface-recessed",
          "type-price text-sm text-foreground",
          "hover:border-border-strong",
        ],
        "inline-editorial": [
          "font-sans text-current underline decoration-border-strong underline-offset-[0.3em]",
          "decoration-[length:var(--border-width-interactive)] hover:decoration-foreground",
        ],
      },
      motion: {
        "arrow-nudge": "arrow-nudge",
        shimmer: "sheen-sweep arrow-nudge",
        flat: "",
      },
      size: {
        sm: "h-[calc(var(--size-control)*0.8)] px-[calc(var(--space-badge-x)*1.4)]",
        md: "h-control px-[calc(var(--space-badge-x)*1.8)]",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Inline text links have no box geometry.
      { intent: "inline-editorial", size: ["sm", "md"], class: "h-auto px-0" },
    ],
    defaultVariants: { intent: "primary-cta", motion: "arrow-nudge", size: "md", fullWidth: false },
  },
);

export interface AffiliateActionProps
  extends Omit<ComponentProps<"a">, "href" | "children">,
    VariantProps<typeof actionVariants> {
  /** Raw merchant URL. UTM/subId are appended at render. */
  href: string;
  /** Attribution to inject (campaign = article slug, content = placement…). */
  attribution?: AffiliateAttribution;
  /** Identity for the click event. */
  tracking?: Pick<AffiliateClickEvent, "merchant" | "productId" | "offerId" | "placement">;
  /** Per-instance sink; the global `affiliate:click` event always fires too. */
  onTrack?: (event: AffiliateClickEvent) => void;
  /** Open in a new tab (default). */
  newTab?: boolean;
  /** Trailing arrow glyph (default on). */
  arrow?: boolean;
  /** Merge onto a child element instead of rendering an <a>. */
  asChild?: boolean;
  children: ReactNode;
}

export function AffiliateAction({
  href,
  attribution,
  tracking,
  onTrack,
  newTab = true,
  arrow = true,
  asChild = false,
  intent,
  motion,
  size,
  fullWidth,
  rel,
  target,
  onClick,
  onAuxClick,
  className,
  children,
  ...props
}: AffiliateActionProps) {
  const finalHref = buildAffiliateHref(href, attribution);
  const Comp = asChild ? Slot : "a";
  const resolvedIntent = intent ?? "primary-cta";

  const track = (trigger: AffiliateClickEvent["trigger"]) =>
    emitAffiliateClick(
      { href: finalHref, trigger, timestamp: Date.now(), ...tracking },
      onTrack,
    );

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) track("primary");
  };
  const handleAuxClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onAuxClick?.(e);
    // button 1 = middle click → browsers open a new tab without firing click.
    if (!e.defaultPrevented && e.button === 1) track("auxiliary");
  };

  const Arrow = resolvedIntent === "inline-editorial" ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      {asChild ? <Slottable>{children}</Slottable> : children}
      {arrow && (
        <Arrow
          data-slot="action-arrow"
          size="1.1em"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      )}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );

  return (
    <Comp
      data-slot="affiliate-action"
      data-intent={resolvedIntent}
      href={finalHref}
      rel={mergeRel(rel)}
      target={target ?? (newTab ? "_blank" : undefined)}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      className={cn(actionVariants({ intent, motion, size, fullWidth }), className)}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { actionVariants as affiliateActionVariants };
