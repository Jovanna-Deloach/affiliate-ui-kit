import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

import { buttonStyles } from "./button";

/**
 * Every monetized link in the kit. Built on AffiliateAction, so rel,
 * attribution and click tracking are enforced; the kit only owns the look.
 *
 * Each link carries its offer’s price and stock state as data attributes,
 * so the audit and the story checks can prove merchant order on the page
 * a reader actually gets.
 */
interface BuyProps {
  offer: MerchantOffer;
  productId: string;
  placement: string;
  attribution?: AffiliateAttribution;
  children?: ReactNode;
  className?: string;
}

const offerData = (offer: MerchantOffer) => ({ "data-offer-price": offer.price, "data-in-stock": String(offer.inStock), "data-merchant": offer.merchantName });

/** The one button for a product. `primary` (filled) is reserved for the pick in view. */
export function BuyButton({ offer, productId, placement, attribution, children, className, emphasis = "primary", size = "md", fullWidth = false }: BuyProps & { emphasis?: "primary" | "secondary"; size?: "md" | "lg"; fullWidth?: boolean }) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta={emphasis}
      {...offerData(offer)}
      className={cn(buttonStyles({ emphasis, size, fullWidth }), className)}
    >
      {children ?? `Buy at ${offer.merchantName}`}
    </AffiliateAction>
  );
}

/** Another retailer: the whole row is the target (44px tall), merchant, price, action. */
export function BuyRow({ offer, productId, placement, attribution, className }: Omit<BuyProps, "children">) {
  const grid = "grid min-h-11 grid-cols-[minmax(0,1fr)_auto_3.5rem] items-center gap-x-4";
  if (!offer.inStock)
    return (
      <div data-cta="none" {...offerData(offer)} className={cn(grid, "t-ui text-fg-muted", className)}>
        <span>{offer.merchantName}</span>
        <span className="t-figure">{formatPrice(offer.price, offer.currency ?? "USD")}</span>
        <span className="text-right t-small">Sold out</span>
      </div>
    );
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta="row"
      {...offerData(offer)}
      className={cn("kit-focus group rounded-ctl t-ui text-fg", grid, className)}
    >
      <span>{offer.merchantName}</span>
      <span className="t-figure">{formatPrice(offer.price, offer.currency ?? "USD")}</span>
      <span className="text-right text-accent underline decoration-1 underline-offset-[0.22em] decoration-transparent transition-colors duration-(--dur) ease-(--ease) group-hover:decoration-current">
        Buy
      </span>
    </AffiliateAction>
  );
}

/** An inline text link to a retailer (tables, prose). */
export function BuyLink({ offer, productId, placement, attribution, children, className }: BuyProps) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta="link"
      {...offerData(offer)}
      className={cn("kit-focus kit-link rounded-ctl t-ui text-accent", className)}
    >
      {children ?? `Buy at ${offer.merchantName}`}
    </AffiliateAction>
  );
}
