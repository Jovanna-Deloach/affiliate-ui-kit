import { cn } from "@/lib/cn";
import { BuyRow } from "@/kit/ui";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

/**
 * Every other retailer, under the offer card: one 44px row each on a
 * hairline, the whole row the target — monogram and name; the price, how
 * far above the best price it sits (“+$10 vs. best”) and a bordered “View”
 * pill. Sold-out rows are muted and are not links. Rows are inset 20px so
 * their monograms line up with the offer card above.
 *
 * Pass offers already in kit order (`rankOffers`): in stock by price, sold
 * out last.
 */
export interface RetailerListProps {
  offers: MerchantOffer[];
  /** The lead price, for each row’s difference. */
  best?: number;
  productId: string;
  placement: string;
  attribution?: AffiliateAttribution;
  label?: string;
  className?: string;
}

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
