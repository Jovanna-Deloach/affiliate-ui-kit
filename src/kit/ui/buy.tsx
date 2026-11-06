import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

import { buttonStyles } from "./button";
import { Monogram } from "./marks";

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
 * Another retailer, as a compact row of the buy box (44px, the whole row is
 * the target): monogram and name, then the price, how far it sits above the
 * best price, and a bordered “View” pill (just its arrow in a container under
 * 24rem, so the merchant keeps its width). Sold-out rows are not links.
 */
export function BuyRow({ offer, productId, placement, attribution, best, className }: Omit<BuyProps, "children"> & { best?: number }) {
  const grid = "grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-4";
  const currency = offer.currency ?? "USD";
  const delta = best !== undefined && offer.price > best ? offer.price - best : 0;
  if (!offer.inStock)
    return (
      <div data-cta="none" {...offerData(offer)} className={cn(grid, "text-fg-muted", className)}>
        <Monogram name={offer.merchantName} className="opacity-60" />
        <span className="truncate t-small">{offer.merchantName}</span>
        <span className="flex items-center gap-3">
          <s data-numeric className="t-small t-figure">
            {formatPrice(offer.price, currency)}
          </s>
          <span className="t-micro-sm">Sold out</span>
        </span>
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
      className={cn("kit-focus group text-fg transition-colors duration-(--dur) ease-(--ease) hover:bg-paper", grid, className)}
    >
      <Monogram name={offer.merchantName} />
      <span className="truncate t-small font-medium">{offer.merchantName}</span>
      <span className="flex items-center gap-3">
        <span className="flex flex-col text-right">
          <span data-numeric className="t-small t-figure">
            {formatPrice(offer.price, currency)}
          </span>
          {delta > 0 && (
            <span data-numeric className="t-caption text-fg-muted">
              +{formatPrice(delta, currency)} vs. best
            </span>
          )}
        </span>
        <span className="inline-flex h-7 items-center justify-center gap-1 rounded-ctl border border-line-strong bg-paper px-2.5 t-micro-sm text-fg transition-colors duration-(--dur) ease-(--ease) group-hover:border-fg">
          <span className="sr-only @sm:not-sr-only">View</span>
          <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
        </span>
      </span>
    </AffiliateAction>
  );
}

/**
 * A compact “Buy” pill to a retailer (tables, catalogue cards). `filled`
 * marks the one row that leads (the page’s top pick, in the accent); every
 * other pill is bordered.
 */
export function BuyPill({ offer, productId, placement, attribution, children, filled = false, className }: BuyProps & { filled?: boolean }) {
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
        "kit-focus inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-ctl px-3.5 py-1.5 t-caption font-medium transition-colors duration-(--dur) ease-(--ease)",
        filled ? "bg-accent text-on-accent hover:bg-accent-hover" : "border border-line-strong bg-paper text-fg hover:border-fg",
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
