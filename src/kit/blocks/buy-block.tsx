import { cn } from "@/lib/cn";
import { formatDateShort, formatPrice } from "@/lib/format";
import { rankOffers } from "@/kit/lib/offers";
import type { KitProduct } from "@/kit/types";
import { BestPrice, BuyButton, BuyRow, Monogram, Sep } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/** The short inline disclosure. Kept under 40 characters so it can repeat beside every buy box. */
export const INLINE_DISCLOSURE = "We may earn a commission.";

/**
 * The merchant buy box. The lowest in-stock offer leads as a recessed offer
 * card: monogram, merchant and its terms on the left; the price (1.5rem,
 * bold, tabular), the struck list price and “Best price” on the right; one
 * full-width 44px button beneath. Every other retailer follows as a compact
 * 44px row on a hairline: price, how far above the best price it sits, and a
 * bordered “View” pill. Lowest price first, sold out last; a partner
 * relationship never changes the order.
 */
export interface BuyBlockProps {
  product: KitProduct;
  placement: string;
  disclosureHref: string;
  attribution?: AffiliateAttribution;
  id?: string;
  className?: string;
}

export function BuyBlock({ product, placement, disclosureHref, attribution, id, className }: BuyBlockProps) {
  const ranked = rankOffers(product.offers);
  const lead = ranked[0]?.inStock ? ranked[0] : undefined;
  const others = lead ? ranked.slice(1) : ranked;
  const competing = others.some((o) => o.inStock);
  const currency = lead?.currency ?? "USD";
  return (
    <div data-slot="buy-block" data-product-id={product.id} id={id} className={cn("@container scroll-mt-8", className)}>
      {lead ? (
        <div className="kit-recess px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="flex min-w-0 items-center gap-3">
              <Monogram name={lead.merchantName} />
              <div className="min-w-0">
                <p className="m-0 t-ui font-semibold text-fg">{lead.merchantName}</p>
                <p className="m-0 mt-0.5 flex flex-col t-caption text-fg-muted @md:flex-row @md:flex-wrap @md:items-center">
                  {lead.shippingNote && (
                    <>
                      <span>{lead.shippingNote}</span>
                      {product.lastVerifiedAt && <Sep className="hidden @md:inline" />}
                    </>
                  )}
                  {product.lastVerifiedAt && (
                    <span>
                      Verified <time dateTime={product.lastVerifiedAt}>{formatDateShort(product.lastVerifiedAt)}</time>
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-1.5">
              <p className="m-0 flex items-baseline gap-2 @md:ml-auto">
                {lead.originalPrice && lead.originalPrice > lead.price && (
                  <s data-numeric className="t-small text-fg-muted">
                    {formatPrice(lead.originalPrice, currency)}
                  </s>
                )}
                <span data-numeric className="t-price text-fg">
                  {formatPrice(lead.price, currency)}
                </span>
              </p>
              {competing && <BestPrice className="@md:ml-auto" />}
            </div>
          </div>
          <BuyButton offer={lead} productId={product.id} placement={placement} attribution={attribution} fullWidth icon className="mt-4 h-11">
            View deal at {lead.merchantName}
          </BuyButton>
        </div>
      ) : (
        <p className="m-0 kit-recess px-5 py-4 t-ui text-fg">Sold out at every retailer we track.</p>
      )}
      {others.length > 0 && (
        <ul aria-label="Other retailers" className="m-0 mt-1 list-none p-0">
          {others.map((offer) => (
            <li key={offer.id} className="border-b border-line">
              <BuyRow offer={offer} productId={product.id} placement={`${placement}-row`} attribution={attribution} best={lead?.price} className="px-5" />
            </li>
          ))}
        </ul>
      )}
      <p data-slot="inline-disclosure" className="m-0 mt-3 t-caption text-fg-muted">
        We may earn a{" "}
        <a href={disclosureHref} className="kit-focus kit-link rounded-ctl">
          commission
        </a>
        .
      </p>
    </div>
  );
}
