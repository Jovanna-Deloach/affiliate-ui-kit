import { cn } from "@/lib/cn";
import { formatDateShort } from "@/lib/format";
import { BestPrice, BuyButton, Monogram, Price, Sep } from "@/kit/ui";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

/**
 * The lead offer, as a recessed card (16px × 20px): on the left the
 * merchant’s monogram, its name and its terms (“Free 2-day shipping ·
 * Verified Oct 28”); on the right the price at 1.5rem, the struck list
 * price and “Best price”; beneath, one full-width 44px button in tracked
 * capitals. On a narrow card the terms stack and the price drops under the
 * merchant.
 *
 * Pass the lowest in-stock offer (`leadOffer`), and `best` only when
 * another retailer has it in stock for more. For a product sold out
 * everywhere, the buy box shows a notice instead of an offer card.
 */
export interface OfferCardProps {
  offer: MerchantOffer;
  productId: string;
  /** When the price was last checked (ISO). */
  verifiedAt?: string;
  /** Another retailer has it in stock for more: show “Best price”. */
  best?: boolean;
  /** Where the click came from, for tracking: “deep-dive”, “product-page”. */
  placement: string;
  attribution?: AffiliateAttribution;
  /** The button label. Default “View deal at {merchant}”. */
  ctaLabel?: string;
  className?: string;
}

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
