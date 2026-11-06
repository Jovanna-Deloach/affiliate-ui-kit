import { cn } from "@/lib/cn";
import { BuyRow } from "@/kit/ui";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

export interface RetailerListProps {
  /** The other retailers, already in kit order (`rankOffers` from `@/kit/lib/offers`): in stock by price, sold out last. */
  offers: MerchantOffer[];
  /** The lead price, so each row can say how far above it sits. */
  best?: number;
  /** The product the offers are for, for click tracking. */
  productId: string;
  /** Where the rows sit, for click tracking: `deep-dive-row`. */
  placement: string;
  /** Campaign attribution added to every link. */
  attribution?: AffiliateAttribution;
  /** The list’s accessible name. Default “Other retailers”. */
  label?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Every other retailer, under the offer card: one 44px `BuyRow` each on a
 * hairline, the whole row the link. Rows are inset 20px so their monograms
 * line up with the offer card above. Renders nothing for an empty list.
 *
 * **Use it for** the retailers after the lead offer. **Not for** a whole buy
 * box (`BuyBlock` composes the offer card, this list and the disclosure) or
 * offers in any order but the kit’s: lowest in-stock price first, a partner
 * never moved up.
 *
 * @summary The other retailers under an offer card, as 44px rows, lowest price first.
 * @import import { RetailerList } from "@/kit/components";
 */
export function RetailerList({ offers, best, productId, placement, attribution, label = "Other retailers", className }: RetailerListProps) {
  if (offers.length === 0) return null;
  return (
    <ul data-slot="retailers" aria-label={label} className={cn("@container m-0 list-none p-0", className)}>
      {offers.map((offer) => (
        <li key={offer.id} className="border-b border-line">
          <BuyRow offer={offer} productId={productId} placement={placement} attribution={attribution} best={best} className="px-5" />
        </li>
      ))}
    </ul>
  );
}
