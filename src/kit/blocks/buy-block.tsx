import { cn } from "@/lib/cn";
import { formatDateShort, formatPrice } from "@/lib/format";
import { rankOffers } from "@/kit/lib/offers";
import type { KitProduct } from "@/kit/types";
import { BuyButton, BuyRow } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/** The short inline disclosure. Kept under 40 characters so it can repeat beside every buy block. */
export const INLINE_DISCLOSURE = "We may earn a commission.";

/**
 * Where to buy one product. One button, for the lowest in-stock price;
 * every other retailer is a quiet row below it, lowest price first, sold
 * out last. A partner relationship never changes the order. The inline
 * disclosure sits inside the block, beside the button it qualifies.
 */
export interface BuyBlockProps {
  product: KitProduct;
  placement: string;
  disclosureHref: string;
  attribution?: AffiliateAttribution;
  className?: string;
}

export function BuyBlock({ product, placement, disclosureHref, attribution, className }: BuyBlockProps) {
  const ranked = rankOffers(product.offers);
  const lead = ranked[0]?.inStock ? ranked[0] : undefined;
  const others = lead ? ranked.slice(1) : ranked;
  const currency = lead?.currency ?? "USD";
  return (
    <div data-slot="buy-block" data-product-id={product.id} className={cn("@container rounded-box bg-well p-5", className)}>
      <div className="grid gap-4 @lg:grid-cols-[minmax(0,1fr)_auto] @lg:items-center @lg:gap-x-6">
        {lead ? (
          <div className="min-w-0">
            <p className="m-0 flex flex-wrap items-baseline gap-x-3">
              <span data-numeric className="t-figure-xl text-fg">
                {formatPrice(lead.price, currency)}
              </span>
              {lead.originalPrice && lead.originalPrice > lead.price && (
                <s data-numeric className="t-small text-fg-muted">
                  {formatPrice(lead.originalPrice, currency)}
                </s>
              )}
            </p>
            <p className="m-0 mt-1.5 t-small text-fg-muted">
              At {lead.merchantName}
              {product.lastVerifiedAt && <>, checked {formatDateShort(product.lastVerifiedAt)}</>}
            </p>
          </div>
        ) : (
          <p className="m-0 t-ui text-fg">Sold out at every retailer we track.</p>
        )}
        {lead && <BuyButton offer={lead} productId={product.id} placement={placement} attribution={attribution} className="w-full @lg:w-auto @lg:min-w-48" />}
      </div>
      {others.length > 0 && (
        <ul className="m-0 mt-4 list-none divide-y divide-line border-t border-line p-0">
          {others.map((offer) => (
            <li key={offer.id}>
              <BuyRow offer={offer} productId={product.id} placement={`${placement}-row`} attribution={attribution} />
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
