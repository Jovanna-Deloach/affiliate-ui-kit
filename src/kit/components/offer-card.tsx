import { cn } from "@/lib/cn";
import { formatDateShort } from "@/lib/format";
import { BestPrice, BuyButton, Monogram, Price, Sep } from "@/kit/ui";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

export interface OfferCardProps {
  /** The lead offer: the lowest in-stock price (`leadOffer(product.offers)` from `@/kit/lib/offers`). */
  offer: MerchantOffer;
  /** The product the offer is for, for click tracking. */
  productId: string;
  /** When the price was last checked (ISO date): printed as “Verified Oct 28” in the terms. */
  verifiedAt?: string;
  /** Another retailer has the product in stock for more: show “Best price”. Leave false for a single retailer. */
  best?: boolean;
  /** Where the click came from, for tracking: `deep-dive`, `product-page`. */
  placement: string;
  /** Campaign attribution added to the link: source, medium, campaign. */
  attribution?: AffiliateAttribution;
  /** The button label. Default “View deal at {merchant}”. */
  ctaLabel?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The lead offer, as a recessed card: the merchant’s monogram, name and
 * terms (“Free 2-day shipping · Verified Oct 28”); the price at 1.5rem with
 * its struck list price and “Best price”; then one full-width 44px button.
 * In a narrow card the terms stack and the price drops under the merchant.
 *
 * **Use it for** the one offer a product leads with, at the top of a buy
 * box. **Not for** the other retailers (`RetailerList` under it), a sold-out
 * product (the buy box shows a notice instead), or a whole buy box: use
 * `BuyBlock`, which picks the lead offer, ranks the rest and adds the
 * disclosure.
 *
 * @summary The lead offer of a buy box: merchant, terms, price and one full-width button.
 * @import import { OfferCard } from "@/kit/components";
 */
export function OfferCard({ offer, productId, verifiedAt, best = false, placement, attribution, ctaLabel, className }: OfferCardProps) {
  const terms = [offer.shippingNote, verifiedAt && `Verified ${formatDateShort(verifiedAt)}`].filter(Boolean);
  return (
    <div data-slot="offer-card" className={cn("@container kit-recess px-5 py-4", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 items-center gap-3">
          <Monogram name={offer.merchantName} />
          <div className="min-w-0">
            <p className="m-0 t-ui font-semibold text-fg">{offer.merchantName}</p>
            {terms.length > 0 && (
              <p className="m-0 mt-0.5 flex flex-col t-caption text-fg-muted @md:flex-row @md:flex-wrap @md:items-center">
                {offer.shippingNote && <span>{offer.shippingNote}</span>}
                {offer.shippingNote && verifiedAt && <Sep className="hidden @md:inline" />}
                {verifiedAt && (
                  <span>
                    Verified <time dateTime={verifiedAt}>{formatDateShort(verifiedAt)}</time>
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <Price amount={offer.price} currency={offer.currency} was={offer.originalPrice} size="lg" className="@md:ml-auto @md:text-right" />
          {best && <BestPrice className="@md:ml-auto" />}
        </div>
      </div>
      <BuyButton offer={offer} productId={productId} placement={placement} attribution={attribution} fullWidth icon className="mt-4">
        {ctaLabel ?? `View deal at ${offer.merchantName}`}
      </BuyButton>
    </div>
  );
}
