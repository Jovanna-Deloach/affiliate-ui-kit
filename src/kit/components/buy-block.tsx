import { cn } from "@/lib/cn";
import { rankOffers } from "@/kit/lib/offers";
import { underWarning, warningId } from "@/kit/lib/warnings";
import type { KitProduct } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

import { OfferCard } from "./offer-card";
import { RetailerList } from "./retailer-list";
import { WarningNote } from "./warning-note";

/** The short inline disclosure. Kept under 40 characters so it can repeat beside every buy box. */
export const INLINE_DISCLOSURE = "We may earn a commission.";

export interface BuyBlockProps {
  /** The product, with every retailer’s offer in any order: the buy box ranks them. */
  product: KitProduct;
  /** Where the buy box sits, for click tracking: `deep-dive`. The rows report `{placement}-row`. */
  placement: string;
  /** The page that explains how the publication makes money; the inline disclosure links to it. */
  disclosureHref: string;
  /** Campaign attribution added to every link. */
  attribution?: AffiliateAttribution;
  /** An anchor for the box, unique on the page. */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The buy box: the lowest in-stock offer as an `OfferCard`, every other
 * retailer as a `RetailerList` row beneath it, then the inline disclosure
 * (“We may earn a commission.”). Lowest price first, sold out last; a
 * partner relationship never changes the order. One button per product.
 * When every retailer is sold out, a notice takes the offer card’s place;
 * while a warning about the product stands, the warning takes the whole
 * box’s place (`WarningNote`), linked to the page’s `ConsumerWarning`.
 *
 * **Use it for** where a reader decides to buy one product: a deep dive, a
 * product page. **Not for** a verdict card or a table row (they carry one
 * `BuyButton` or `BuyPill` to the lead offer) or a second buy box for the
 * same product on one screen.
 *
 * @summary The buy box: lead offer card, other retailers, inline disclosure. Ranks the offers.
 * @import import { BuyBlock } from "@/kit/components";
 */
export function BuyBlock({ product, placement, disclosureHref, attribution, id, className }: BuyBlockProps) {
  if (product.warning && underWarning(product))
    return (
      <div data-slot="buy-block" data-product-id={product.id} data-warning="active" id={id} className={cn("scroll-mt-8", className)}>
        <WarningNote warning={product.warning} href={`#${warningId(product)}`} size="box" />
      </div>
    );
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
