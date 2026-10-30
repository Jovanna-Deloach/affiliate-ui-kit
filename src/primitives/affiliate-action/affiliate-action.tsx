"use client";

import type { VariantProps } from "class-variance-authority";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Children, cloneElement, isValidElement, type ComponentProps, type MouseEvent, type ReactElement, type ReactNode } from "react";

import { buildAffiliateHref, emitAffiliateClick, mergeRel } from "@/lib/affiliate";
import { cn } from "@/lib/cn";
import { buttonVariants } from "@/primitives/button";
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
 *   • `asChild` merges onto the consumer's element (a framework <Link>, say)
 *     with COMPLIANCE WINNING: the child's own href/rel/target are replaced,
 *     its handlers composed, its className merged. (Radix Slot lets the child
 *     win, which would let a raw href or rel slip past the guardrail.)
 *
 * Geometry binds to the shared spine: `--size-control` (36px), `--radius-control`,
 * `--keyline-cta` (148px minimum so CTA columns share one axis — Law of
 * Continuity; a longer label widens the track instead of clipping), `--inset-cell-x`.
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

// Geometry and intents are shared with <Button /> so a merchant CTA and a
// plain control beside it share one silhouette; only compliance differs.
const actionVariants = buttonVariants;

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
  /** Merge onto a single child element instead of rendering an <a>; href/rel/tracking are still enforced. */
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
  const resolvedIntent = intent ?? "primary";

  const track = (trigger: AffiliateClickEvent["trigger"]) =>
    emitAffiliateClick({ href: finalHref, trigger, ...tracking }, onTrack);

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
  const trailing = (
    <>
      {arrow && <Arrow data-slot="action-arrow" size="1.1em" strokeWidth={1.5} aria-hidden="true" />}
      {newTab && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  const compliance = {
    "data-slot": "affiliate-action",
    "data-intent": resolvedIntent,
    href: finalHref,
    target: target ?? (newTab ? "_blank" : undefined),
  };
  const classes = actionVariants({ intent, motion: motion ?? "arrow-nudge", size, width });

  if (asChild) {
    const child = Children.only(children) as ReactElement<ChildProps>;
    if (!isValidElement<ChildProps>(child)) throw new Error("<AffiliateAction asChild> expects exactly one element child.");
    const cp = child.props;
    return cloneElement(
      child,
      {
        ...props,
        ...compliance,
        // The child's rel is merged, never trusted alone — sponsored/nofollow stay.
        rel: mergeRel([cp.rel, rel].filter(Boolean).join(" ")),
        className: cn(classes, className, cp.className),
        style: { ...props.style, ...cp.style },
        onClick: (e: MouseEvent<HTMLAnchorElement>) => {
          cp.onClick?.(e);
          handleClick(e);
        },
        onAuxClick: (e: MouseEvent<HTMLAnchorElement>) => {
          cp.onAuxClick?.(e);
          handleAuxClick(e);
        },
      },
      cp.children,
      trailing,
    );
  }

  return (
    <a
      {...compliance}
      rel={mergeRel(rel)}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      className={cn(classes, className)}
      {...props}
    >
      {/* Last-resort guard: a label squeezed by a narrow consumer ellipsizes, never overflows. */}
      <span className="min-w-0 truncate">{children}</span>
      {trailing}
    </a>
  );
}

type ChildProps = Pick<ComponentProps<"a">, "rel" | "className" | "style" | "onClick" | "onAuxClick" | "children">;

export { actionVariants as affiliateActionVariants };
