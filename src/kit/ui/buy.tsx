import { ArrowUpRight } from "lucide-react";
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
export function BuyButton({
  offer,
  productId,
  placement,
  attribution,
  children,
  className,
  emphasis = "primary",
  size = "md",
  fullWidth = false,
  icon = false,
}: BuyProps & { emphasis?: "primary" | "secondary"; size?: "md" | "lg"; fullWidth?: boolean; icon?: boolean }) {
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
      {icon && <ArrowUpRight size="1.05em" strokeWidth={2} aria-hidden="true" />}
    </AffiliateAction>
  );
}

/**
 * Another retailer, as a row of the buy box: the whole row is the target
 * (48px), merchant, price and a bordered “Buy” pill; sold-out rows are
 * not links.
 */
export function BuyRow({ offer, productId, placement, attribution, className }: Omit<BuyProps, "children">) {
  const grid = "grid min-h-12 grid-cols-[minmax(0,1fr)_auto_4.5rem] items-center gap-x-4 px-5";
  if (!offer.inStock)
    return (
      <div data-cta="none" {...offerData(offer)} className={cn(grid, "t-ui text-fg-muted", className)}>
        <span>{offer.merchantName}</span>
        <span data-numeric className="t-figure">
          {formatPrice(offer.price, offer.currency ?? "USD")}
        </span>
        <span className="justify-self-end t-caption">Sold out</span>
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
      className={cn("kit-focus group t-ui text-fg transition-colors duration-(--dur) ease-(--ease) hover:bg-paper", grid, className)}
    >
      <span>{offer.merchantName}</span>
      <span data-numeric className="t-figure">
        {formatPrice(offer.price, offer.currency ?? "USD")}
      </span>
      <span className="inline-flex h-8 items-center justify-center gap-1 justify-self-end rounded-full border border-line bg-paper px-3 t-caption font-medium text-fg transition-colors duration-(--dur) ease-(--ease) group-hover:border-fg">
        Buy
        <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
      </span>
    </AffiliateAction>
  );
}

/** A compact pill to a retailer (tables, rails): price context lives beside it. */
export function BuyPill({ offer, productId, placement, attribution, children, className }: BuyProps) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta="link"
      {...offerData(offer)}
      className={cn(
        "kit-focus inline-flex h-9 items-center justify-center gap-1 rounded-full border border-line bg-paper px-4 t-caption font-medium text-fg transition-colors duration-(--dur) ease-(--ease) hover:border-fg",
        className,
      )}
    >
      {children ?? "Buy"}
      <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
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
