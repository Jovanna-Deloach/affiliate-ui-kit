"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { leadOffer } from "@/kit/lib/offers";
import type { KitProduct } from "@/kit/types";
import { BuyButton, Price } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface StickyBuyBarProps {
  /** The product on the page; the bar offers its lowest in-stock price. */
  product: KitProduct;
  /** The `id` of the page’s buy box: the bar appears once the reader has scrolled past it. */
  watch?: string;
  /** Shown or hidden by the page itself, in place of watching a buy box (for a page that tracks it already). */
  shown?: boolean;
  /** Where the commission disclosure lives (`#disclosure`). */
  disclosureHref: string;
  /** Where on the page the click came from, for attribution (default `sticky-bar`). */
  placement?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The product’s lowest price and buy button, pinned to the bottom of the
 * screen once the reader has scrolled past the buy box, so a long product
 * page never makes them scroll back to buy. It slides away when the buy box
 * is back in view, and is never shown beside it.
 *
 * **Use it for** a single product’s page, long enough to scroll past its buy
 * box. **Not for** a roundup or comparison (each product has its own buy
 * box), or a page whose buy box stays in view.
 *
 * @summary The lowest price and buy button, pinned once the buy box scrolls away.
 * @import import { StickyBuyBar } from "@/kit/components";
 */
export function StickyBuyBar({ product, watch, shown: forced, disclosureHref, placement = "sticky-bar", className }: StickyBuyBarProps) {
  const offer = leadOffer(product.offers);
  const [passed, setPassed] = useState(false);
  const shown = forced ?? passed;

  useEffect(() => {
    if (forced !== undefined || !watch) return;
    const target = document.getElementById(watch);
    if (!target) return;
    // Shown only once the buy box has left the screen upward, not before the reader reaches it.
    const observer = new IntersectionObserver(([entry]) => setPassed(Boolean(entry && !entry.isIntersecting && entry.boundingClientRect.top < 0)));
    observer.observe(target);
    return () => observer.disconnect();
  }, [watch, forced]);

  if (!offer?.inStock) return null;
  return (
    <aside
      aria-label={`Buy ${product.brand} ${product.name}`}
      inert={!shown}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper transition-transform duration-(--dur) ease-(--ease)",
        shown ? "translate-y-0" : "translate-y-full",
        className,
      )}
    >
      <div className="kit-well flex items-center gap-3 py-2.5 sm:gap-4">
        <span className="relative hidden size-12 shrink-0 overflow-hidden rounded-media kit-studio sm:block">
          <Image src={product.image.src} alt="" fill sizes="48px" className="object-contain p-1" />
        </span>
        <div className="grid min-w-0 flex-1 gap-0.5">
          <p data-name className="m-0 truncate t-ui font-semibold text-fg">
            {product.brand} {product.name}
          </p>
          <p className="m-0 t-caption text-fg-muted">
            We may earn a{" "}
            <a href={disclosureHref} className="kit-focus kit-link rounded-ctl">
              commission
            </a>
            .
          </p>
        </div>
        <Price amount={offer.price} was={offer.originalPrice} size="sm" className="shrink-0" />
        <BuyButton offer={offer} productId={product.id} placement={placement} className="shrink-0" />
      </div>
    </aside>
  );
}
