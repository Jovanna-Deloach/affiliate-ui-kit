import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatDateShort, formatPrice } from "@/lib/format";
import { rankOffers } from "@/kit/lib/offers";
import type { KitProduct } from "@/kit/types";
import { BestPrice, BuyButton, BuyRow } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/** The short inline disclosure. Kept under 40 characters so it can repeat beside every buy box. */
export const INLINE_DISCLOSURE = "We may earn a commission.";

/**
 * The merchant buy box: a recessed, framed module. The lowest in-stock
 * offer leads, grouped with its badge and provenance, beside one
 * substantial button; every other retailer is a full-width row with a
 * bordered “Buy” pill, lowest price first, sold out last. A partner
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
    <div data-slot="buy-block" data-product-id={product.id} id={id} className={cn("@container scroll-mt-8 overflow-hidden rounded-box border border-line bg-well", className)}>
      <div className="grid gap-4 p-5 @lg:grid-cols-[minmax(0,1fr)_auto] @lg:items-center @lg:gap-x-6">
        {lead ? (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span data-numeric className="t-figure-xl text-fg">
                {formatPrice(lead.price, currency)}
              </span>
              {lead.originalPrice && lead.originalPrice > lead.price && (
                <s data-numeric className="t-small text-fg-muted">
                  {formatPrice(lead.originalPrice, currency)}
                </s>
              )}
              {competing && <BestPrice />}
            </div>
            <p className="m-0 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 t-small text-fg-muted">
              <span>At {lead.merchantName}</span>
              {product.lastVerifiedAt && (
                <span className="inline-flex items-center gap-1">
                  <BadgeCheck size={14} strokeWidth={2} aria-hidden="true" className="text-pass" />
                  Verified <time dateTime={product.lastVerifiedAt}>{formatDateShort(product.lastVerifiedAt)}</time>
                </span>
              )}
            </p>
          </div>
        ) : (
          <p className="m-0 t-ui text-fg">Sold out at every retailer we track.</p>
        )}
        {lead && <BuyButton offer={lead} productId={product.id} placement={placement} attribution={attribution} icon className="h-[46px] w-full font-medium @lg:w-auto @lg:min-w-[220px]" />}
      </div>
      {others.length > 0 && (
        <ul className="m-0 list-none divide-y divide-line border-t border-line p-0">
          {others.map((offer) => (
            <li key={offer.id}>
              <BuyRow offer={offer} productId={product.id} placement={`${placement}-row`} attribution={attribution} />
            </li>
          ))}
        </ul>
      )}
      <p data-slot="inline-disclosure" className="m-0 border-t border-line px-5 py-3 t-caption text-fg-muted">
        We may earn a{" "}
        <a href={disclosureHref} className="kit-focus kit-link rounded-ctl">
          commission
        </a>
        .
      </p>
    </div>
  );
}
