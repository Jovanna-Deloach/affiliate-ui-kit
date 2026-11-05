import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { BuyPill, JumpLink } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * A pick as one row: thumbnail on the well, award, name, who it is for,
 * the lowest price with a pill to the retailer, and a jump to the review.
 * Used inside the verdict bento (picks 4+) and as a catalogue card.
 */
export function PickRow({ pick, jumpLabel, attribution, wide }: { pick: Pick; jumpLabel: string; attribution?: AffiliateAttribution; wide?: boolean }) {
  const offer = leadOffer(pick.product.offers);
  return (
    <div data-product-id={pick.product.id} className={cn("@container grid grid-cols-[4.5rem_minmax(0,1fr)] items-start gap-4", wide && "@2xl:grid-cols-[4.5rem_minmax(0,1fr)_auto] @2xl:items-center")}>
      <div className="flex items-center justify-center rounded-media bg-well p-1">
        <PickMedia pick={pick} detail="thumb" sizes="4.5rem" />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="t-caption font-medium text-accent-category">{pick.award}</span>
        <a href={`#${reviewId(pick)}`} data-name className="kit-focus rounded-ctl t-ui text-fg hover:underline">
          {pickName(pick)}
        </a>
        <p className="m-0 t-small text-fg-muted">Best for {pick.bestFor}.</p>
      </div>
      <div className={cn("col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1", wide && "@2xl:col-start-auto")}>
        {offer && (
          <>
            <span data-numeric className="t-figure-table text-fg">
              {formatPrice(offer.price, offer.currency ?? "USD")}
            </span>
            <BuyPill offer={offer} productId={pick.product.id} placement="verdict-more" attribution={attribution}>
              Buy at {offer.merchantName}
            </BuyPill>
          </>
        )}
        <JumpLink href={`#${reviewId(pick)}`} className="t-small">
          {jumpLabel}
        </JumpLink>
      </div>
    </div>
  );
}

/**
 * Picks as a catalogue of cards (the collector’s guide index): every piece
 * on the same card, in a grid that queries its own width.
 */
export interface AlsoGreatRailProps {
  picks: Pick[];
  heading: string;
  jumpLabel?: string;
  attribution?: AffiliateAttribution;
  className?: string;
}

export function AlsoGreatRail({ picks, heading, jumpLabel = "Read the review", attribution, className }: AlsoGreatRailProps) {
  return (
    <section data-slot="also-great" aria-labelledby="also-great-heading" className={cn("@container", className)}>
      <h2 id="also-great-heading" className="m-0 t-ui font-semibold text-fg">
        {heading}
      </h2>
      <ul className="m-0 mt-4 grid list-none gap-4 p-0 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {picks.map((pick) => (
          <li key={pick.product.id} className="kit-card p-4">
            <PickRow pick={pick} jumpLabel={jumpLabel} attribution={attribution} />
          </li>
        ))}
      </ul>
    </section>
  );
}
