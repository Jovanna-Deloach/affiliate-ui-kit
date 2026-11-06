import { cn } from "@/lib/cn";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { Award, BestPrice, BuyButton, JumpLink, Price } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, pickName, reviewId } from "./pick-media";

export interface VerdictCardProps {
  /** The pick: its award, name, photograph, `verdict` (feature) or `bestFor` (compact), and its offers. */
  pick: Pick;
  /** The jump to the pick’s deep dive: “Read the full review”. */
  jumpLabel: string;
  /** `feature` the lead pick, with the page’s one filled button (default) · `compact` picks 2 and 3, outlined. */
  variant?: "feature" | "compact";
  /** For `feature` on a single-pick page: a 5 : 7 split with a 4 : 3 well, so a full-width card never leaves the photograph small. */
  wide?: boolean;
  /** For `compact`: the photograph on top, when one compact card stands beside the feature card. */
  stacked?: boolean;
  /** Campaign attribution added to the buy link. */
  attribution?: AffiliateAttribution;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
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

/**
 * A pick, answered above the fold. `feature` is the lead pick: a warmer,
 * lifted card with the photograph beside the award, the name in the display
 * serif, the verdict (why, in two lines), the price with its list price and
 * “Best price”, and the page’s one filled button. `compact` is picks 2 and 3:
 * who it is for (“Best for …”), the price and an outlined button. The
 * photograph fills its studio well, so it never sets the card’s height. Sold
 * out everywhere: the price line says so and the button goes.
 *
 * **Use it for** the quick verdict, at most three cards (`QuickVerdictBento`
 * lays them out). **Not for** the full review (`ProductDeepDiveCard`), a
 * fourth pick (the comparison has it) or a catalogue of every piece
 * (`AlsoGreatRail`).
 *
 * @summary A pick above the fold: the feature card for the lead pick, compact for picks 2 and 3.
 * @import import { VerdictCard } from "@/kit/components";
 */
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
