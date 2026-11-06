import { cn } from "@/lib/cn";
import { rankOffers } from "@/kit/lib/offers";
import type { KitProduct } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

import { OfferCard } from "./offer-card";
import { RetailerList } from "./retailer-list";

/** The short inline disclosure. Kept under 40 characters so it can repeat beside every buy box. */
export const INLINE_DISCLOSURE = "We may earn a commission.";

/**
 * The buy box: the lowest in-stock offer as an offer card, every other
 * retailer as a row beneath it, then the inline disclosure. Lowest price
 * first, sold out last; a partner relationship never changes the order.
 * One button per product. When every retailer is sold out, a notice takes
 * the offer card’s place and the rows say where it was last available.
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
  return (
    <div data-slot="buy-block" data-product-id={product.id} id={id} className={cn("@container scroll-mt-8", className)}>
      {lead ? (
        <OfferCard offer={lead} productId={product.id} verifiedAt={product.lastVerifiedAt} best={others.some((o) => o.inStock)} placement={placement} attribution={attribution} />
      ) : (
        <p className="m-0 kit-recess px-5 py-4 t-ui text-fg">Sold out at every retailer we track.</p>
      )}
      <RetailerList offers={others} best={lead?.price} productId={product.id} placement={`${placement}-row`} attribution={attribution} className="mt-1" />
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
