import { cn } from "@/lib/cn";
import { PickMedia, pickName, reviewId } from "@/kit/components";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { BuyPill, Eyebrow, JumpLink, Price } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * A pick as one catalogue entry: the photograph on a small studio well, the
 * award in micro-caps, the name in the display serif, who it is for, the
 * lowest price with a “Buy” pill to that retailer, and a jump to the review.
 */
export function PickRow({ pick, jumpLabel, attribution }: { pick: Pick; jumpLabel: string; attribution?: AffiliateAttribution }) {
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
