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
 * Geometry binds to the shared spine: `--size-control` (36px), `--radius-inner`,
 * `--keyline-cta` (148px fixed width so CTA columns never shift a price
 * column — Law of Continuity), `--inset-cell-x`.
 *
 * Intents
 *   primary   inverse fill — the one CTA per surface
 *   outline   hairline-strong on the card plane — secondary merchants
 *   ghost     ink-secondary text, hairline — out-of-stock "Check stock"
 *   price     recessed price chip ("$189") for dense comparison rows
 *   inline    underlined editorial link inside prose
 *
 * 21st.dev physics (mechanics.css): `arrow-nudge`, `sheen-sweep` (paused
 * until hover). Client leaf because of the handlers — no animation
 * controllers, so it is loop-safe.
 */

const actionVariants = cva(
  [
    "group/action relative inline-flex shrink-0 items-center justify-center gap-[0.5em]",
    "whitespace-nowrap select-none focus-ring cursor-pointer",
    "transition-[background-color,color,border-color,box-shadow,opacity] duration-interactive ease-standard",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      intent: {
        primary: [
          "type-eyebrow rounded-inner border border-inverse bg-inverse text-ink-inverse",
          "hover:bg-[color-mix(in_srgb,var(--surface-inverse)_88%,var(--surface-primary))]",
        ],
        outline: [
          "type-eyebrow rounded-inner border border-strong bg-surface text-ink",
          "hover:border-ink hover:bg-recessed",
        ],
        ghost: [
          "type-eyebrow rounded-inner border border-hairline bg-transparent text-ink-secondary",
          "hover:border-strong hover:text-ink",
        ],
        price: [
          "type-metric rounded-inner border border-transparent bg-recessed text-body-sm text-ink",
          "hover:border-strong",
        ],
        inline: [
          "font-sans text-current underline decoration-strong underline-offset-[0.3em]",
          "decoration-[length:var(--border-width)] hover:decoration-ink",
        ],
      },
      motion: {
        "arrow-nudge": "arrow-nudge",
        shimmer: "sheen-sweep arrow-nudge",
        flat: "",
      },
      size: {
        sm: "h-[calc(var(--size-control)-var(--space-2))] px-[calc(var(--inset-cell-x)*0.75)]",
        md: "h-control px-cell-x",
        lg: "h-control-lg px-well",
      },
      width: {
        auto: "",
        /** Fixed 148px keyline column — every CTA in a list lands on one axis. */
        cta: "w-cta",
        full: "w-full",
      },
    },
    compoundVariants: [
      // Inline text links have no box geometry.
      { intent: "inline", size: ["sm", "md", "lg"], class: "h-auto px-0" },
    ],
    defaultVariants: { intent: "primary", motion: "arrow-nudge", size: "md", width: "auto" },
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
  width,
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
  const resolvedIntent = intent ?? "primary";

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

  const Arrow = resolvedIntent === "inline" ? ArrowUpRight : ArrowRight;

  const content = (
    <>
      {asChild ? <Slottable>{children}</Slottable> : children}
      {arrow && (
        <Arrow data-slot="action-arrow" size="1.1em" strokeWidth={1.5} aria-hidden="true" />
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
      className={cn(actionVariants({ intent, motion, size, width }), className)}
      {...props}
    >
      {content}
    </Comp>
  );
}

export { actionVariants as affiliateActionVariants };
