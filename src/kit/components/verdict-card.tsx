import { cn } from "@/lib/cn";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { Award, BestPrice, BuyButton, JumpLink, Price } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * A pick, answered above the fold. Two variants, one per job:
 *
 *   feature  the lead pick: a warmer, lifted card (`kit-card-feature`); the
 *            photograph beside the award, the name in the display serif, the
 *            verdict (why, in two lines), the price at 1.5rem with its list
 *            price and “Best price”, and the page’s one filled button.
 *            `wide` (a single-pick page): a 5 : 7 split with a 4 : 3 well,
 *            so a full-width card never leaves the photograph small.
 *   compact  picks 2 and 3: who it is for (“Best for …”), the price and an
 *            outlined button. Beside the feature card the well spans the
 *            card’s height; on a phone the price and button take the full
 *            width beneath. `stacked`: the photograph on top (one compact
 *            card beside the feature card).
 *
 * Every card has a full hairline border. The photograph fills its studio
 * well (laid in absolutely, contain-fit), so it never sets the card’s
 * height. Sold out everywhere: the price line says so and the button goes.
 */
export interface VerdictCardProps {
  pick: Pick;
  /** The link to the full review: “Read the full review”. */
  jumpLabel: string;
  variant?: "feature" | "compact";
  /** feature: the card spans a single-pick page. */
  wide?: boolean;
  /** compact: the photograph on top. */
  stacked?: boolean;
  attribution?: AffiliateAttribution;
  className?: string;
}

/** The studio well a card’s photograph fills; its size comes from the card or its own ratio. */
function MediaWell({ pick, sizes, className }: { pick: Pick; sizes: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-media", className)}>
      <div className="absolute inset-0">
        <PickMedia pick={pick} detail="card" sizes={sizes} />
      </div>
    </div>
  );
}

function Name({ pick, className }: { pick: Pick; className: string }) {
  return (
    <h3 className={cn("m-0 text-fg", className)}>
      <a href={`#${reviewId(pick)}`} data-name className="kit-focus rounded-ctl hover:underline">
        {pickName(pick)}
      </a>
    </h3>
  );
}

const SOLD_OUT = <p className="m-0 t-small text-fg-muted">Sold out everywhere we track</p>;

export function VerdictCard({ pick, jumpLabel, variant = "feature", wide = false, stacked = false, attribution, className }: VerdictCardProps) {
  const offer = leadOffer(pick.product.offers);
  const competing = !!offer && pick.product.offers.some((o) => o.inStock && o.id !== offer.id);

  if (variant === "feature")
    return (
      <article data-slot="verdict-hero" data-product-id={pick.product.id} className={cn("@container kit-card-feature", className)}>
        <div className={cn("grid h-full gap-5 p-5 @xl:gap-8 @xl:p-6", wide ? "@xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : "@xl:grid-cols-2")}>
          <MediaWell pick={pick} sizes="(min-width: 1024px) 26vw, 90vw" className={wide ? "aspect-square @xl:aspect-[4/3]" : "aspect-square @xl:aspect-auto @xl:min-h-80"} />
          <div className="flex flex-col @xl:py-2">
            <Award>{pick.award}</Award>
            <Name pick={pick} className="mt-4 t-title" />
            <p className="m-0 mt-3 t-lead text-fg-body">{pick.verdict}</p>
            <div className="mt-auto pt-6">
              {offer ? (
                <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <Price amount={offer.price} currency={offer.currency} was={offer.originalPrice} size="lg" />
                  {competing && <BestPrice />}
                </p>
              ) : (
                SOLD_OUT
              )}
            </div>
            {offer && <BuyButton offer={offer} productId={pick.product.id} placement="verdict-hero" attribution={attribution} icon className="mt-4 w-full @2xl:w-auto @2xl:self-start" />}
            <JumpLink href={`#${reviewId(pick)}`} className="mt-1 self-start">
              {jumpLabel}
            </JumpLink>
          </div>
        </div>
      </article>
    );

  return (
    <article data-slot="verdict-card" data-product-id={pick.product.id} className={cn("@container kit-card p-4", className)}>
      <div className={cn("grid h-full gap-4", stacked ? "grid-rows-[auto_1fr_auto]" : "grid-cols-[6rem_minmax(0,1fr)] @md:grid-cols-[9rem_minmax(0,1fr)] @md:grid-rows-[1fr_auto]")}>
        <MediaWell pick={pick} sizes="(min-width: 1024px) 18vw, 9rem" className={stacked ? "aspect-[4/3]" : "min-h-32 @md:row-span-2 @md:min-h-40"} />
        <div className="flex min-w-0 flex-col py-0.5">
          <Award>{pick.award}</Award>
          <Name pick={pick} className="mt-3 t-name" />
          <p className="m-0 mt-1.5 t-small text-fg-muted">Best for {pick.bestFor}.</p>
        </div>
        <div className={cn("flex min-w-0 flex-col", !stacked && "col-span-2 @md:col-span-1 @md:col-start-2")}>
          {offer ? (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Price amount={offer.price} currency={offer.currency} was={offer.originalPrice} size="md" />
              <BuyButton offer={offer} productId={pick.product.id} placement="verdict-card" attribution={attribution} emphasis="secondary" icon />
            </div>
          ) : (
            SOLD_OUT
          )}
          <JumpLink href={`#${reviewId(pick)}`} className="mt-1 self-start t-small">
            {jumpLabel}
          </JumpLink>
        </div>
      </div>
    </article>
  );
}
