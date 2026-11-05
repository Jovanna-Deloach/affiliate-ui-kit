import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { Award, BuyButton, JumpLink, ProductImage, TechnicalSpecimen } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * The answer, above the fold: two or three picks as tiles. Each tile is
 * the award, the name, who it is for, the lowest in-stock price with one
 * button, and a jump to its full review. The first pick’s button is the
 * filled one; the others are outlined. Nothing here is repeated in the
 * deep dives: the tile says who it is for, the review says what we
 * measured.
 *
 * Tiles share rows through subgrid, so awards, names, prices and buttons
 * line up across tiles without pushing anything to the bottom.
 */
export interface QuickVerdictBentoProps {
  picks: Pick[];
  jumpLabel: string;
  attribution?: AffiliateAttribution;
  heading?: string;
  className?: string;
}

export function reviewId(pick: Pick) {
  return `review-${pick.product.slug}`;
}

export function PickMedia({ pick, detail, className, sizes }: { pick: Pick; detail: "full" | "card" | "thumb"; className?: string; sizes?: string }) {
  const name = `${pick.product.brand} ${pick.product.name}`;
  if (pick.specimen) return <TechnicalSpecimen specimen={pick.specimen} productId={pick.product.id} name={name} detail={detail} className={className} />;
  if (pick.product.image) return <ProductImage image={pick.product.image} ratio={detail === "thumb" ? "square" : "landscape"} inset="snug" sizes={sizes} className={className} />;
  return null;
}

/** Container breakpoints per tile count: tiles go side by side only when each has room for its name. */
const LAYOUT = {
  1: { list: "", tile: "@2xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] @2xl:gap-x-8 @2xl:p-6", media: "@2xl:max-h-64" },
  2: { list: "@2xl:grid-cols-2 @2xl:grid-rows-[auto_auto_auto_1fr_auto_auto]", tile: "@2xl:row-span-6 @2xl:grid-cols-1 @2xl:grid-rows-subgrid @2xl:p-6", media: "@2xl:row-span-1" },
  3: { list: "@3xl:grid-cols-3 @3xl:grid-rows-[auto_auto_auto_1fr_auto_auto]", tile: "@3xl:row-span-6 @3xl:grid-cols-1 @3xl:grid-rows-subgrid @3xl:p-6", media: "@3xl:row-span-1" },
} as const;

export function QuickVerdictBento({ picks, jumpLabel, attribution, heading = "Our picks at a glance", className }: QuickVerdictBentoProps) {
  const layout = LAYOUT[Math.min(3, Math.max(1, picks.length)) as 1 | 2 | 3];
  return (
    <section data-slot="quick-verdict" aria-labelledby="quick-verdict-heading" className={cn("@container", className)}>
      <h2 id="quick-verdict-heading" className="sr-only">
        {heading}
      </h2>
      <ul className={cn("m-0 grid list-none gap-4 p-0", layout.list)}>
        {picks.map((pick, i) => {
          const offer = leadOffer(pick.product.offers);
          const name = `${pick.product.brand} ${pick.product.name}`;
          return (
            <li
              key={pick.product.id}
              data-slot="verdict-tile"
              data-product-id={pick.product.id}
              className={cn("grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-box bg-well p-4", layout.tile)}
            >
              <PickMedia pick={pick} detail="card" sizes="(min-width: 1024px) 33vw, 6rem" className={cn("row-span-6 max-h-72 self-start", layout.media)} />
              <Award>{pick.award}</Award>
              <h3 className="m-0 t-title text-fg">
                <a href={`#${reviewId(pick)}`} data-name className="kit-focus rounded-ctl hover:underline">
                  {name}
                </a>
              </h3>
              <p className="m-0 t-small text-fg-muted">Best for {pick.bestFor}.</p>
              <p className="m-0 flex flex-wrap items-baseline gap-x-2 t-small text-fg-muted">
                {offer ? (
                  <>
                    <span data-numeric className="t-figure-table text-fg">
                      {formatPrice(offer.price, offer.currency ?? "USD")}
                    </span>
                    <span>at {offer.merchantName}</span>
                  </>
                ) : (
                  <span>Sold out everywhere we track</span>
                )}
              </p>
              <div className="flex flex-col items-start gap-1">
                {offer && <BuyButton offer={offer} productId={pick.product.id} placement="quick-verdict" attribution={attribution} emphasis={i === 0 ? "primary" : "secondary"} />}
                <JumpLink href={`#${reviewId(pick)}`}>{jumpLabel}</JumpLink>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
