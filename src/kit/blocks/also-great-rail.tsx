import { cn } from "@/lib/cn";
import { PickMedia, pickName, reviewId } from "@/kit/components";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { BuyPill, Eyebrow, JumpLink, Price } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

export interface PickRowProps {
  /** The pick: photograph, award, name, `bestFor` and its lowest in-stock offer. */
  pick: Pick;
  /** The jump to the pick’s deep dive: “Read the review”. */
  jumpLabel: string;
  /** Campaign attribution added to the buy link. */
  attribution?: AffiliateAttribution;
}

/**
 * A pick as one catalogue entry: a thumbnail, the award in the category
 * accent, the name in the display serif, who it is for, the lowest price
 * with a “Buy at {merchant}” pill, and a jump to the review.
 *
 * @summary One catalogue entry: thumbnail, award, name, best for, lowest price, jump to the review.
 * @import import { PickRow } from "@/kit/blocks";
 */
export function PickRow({ pick, jumpLabel, attribution }: PickRowProps) {
  const offer = leadOffer(pick.product.offers);
  return (
    <div data-product-id={pick.product.id} className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-4">
      <PickMedia pick={pick} detail="thumb" sizes="5rem" />
      <div className="flex min-w-0 flex-col">
        <Eyebrow as="span" size="sm" tone="category">
          {pick.award}
        </Eyebrow>
        <a href={`#${reviewId(pick)}`} data-name className="kit-focus mt-1.5 self-start rounded-ctl t-name text-fg hover:underline">
          {pickName(pick)}
        </a>
        <p className="m-0 mt-1 t-small text-fg-muted">Best for {pick.bestFor}.</p>
        {offer && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Price amount={offer.price} currency={offer.currency} size="sm" />
            <BuyPill offer={offer} productId={pick.product.id} placement="catalogue" attribution={attribution}>
              Buy at {offer.merchantName}
            </BuyPill>
          </div>
        )}
        <JumpLink href={`#${reviewId(pick)}`} className="mt-1 t-small">
          {jumpLabel}
        </JumpLink>
      </div>
    </div>
  );
}

export interface AlsoGreatRailProps {
  /** Every piece in the guide, in the order to show them. */
  picks: Pick[];
  /** The section’s heading, saying something: “Twelve watches worth owning”. */
  heading: string;
  /** Each entry’s jump to its deep dive. Default “Read the review”. */
  jumpLabel?: string;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Picks as a catalogue: every piece on the same card (`PickRow`), in a grid
 * that queries its own width (one column, two from 42rem, three from
 * 64rem), under a heading in the display serif.
 *
 * **Use it for** the index of a collector’s guide, where every piece is a
 * peer, or picks beyond the verdict on a long guide. **Not for** a ranking
 * (`QuickVerdictBento` and `ComparisonMatrix` say which is best) or a single
 * pick.
 *
 * @summary A catalogue of every piece, one card each, in a self-sizing grid.
 * @import import { AlsoGreatRail } from "@/kit/blocks";
 */
export function AlsoGreatRail({ picks, heading, jumpLabel = "Read the review", attribution, className }: AlsoGreatRailProps) {
  return (
    <section data-slot="also-great" aria-labelledby="also-great-heading" className={cn("@container", className)}>
      <h2 id="also-great-heading" className="m-0 t-headline text-fg">
        {heading}
      </h2>
      <ul className="m-0 mt-8 grid list-none gap-4 p-0 @2xl:grid-cols-2 @5xl:grid-cols-3">
        {picks.map((pick) => (
          <li key={pick.product.id} className="kit-card p-5">
            <PickRow pick={pick} jumpLabel={jumpLabel} attribution={attribution} />
          </li>
        ))}
      </ul>
    </section>
  );
}
