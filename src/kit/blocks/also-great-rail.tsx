import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { BuyLink, JumpLink } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, reviewId } from "./quick-verdict-bento";

/**
 * The picks after the verdict tiles: a quiet rail of thumbnails with the
 * award, the name, who it is for, the lowest in-stock price as a text link
 * and a jump to the review. No buttons: the filled action belongs to the
 * verdict, and each review has its own.
 */
export interface AlsoGreatRailProps {
  picks: Pick[];
  heading: string;
  jumpLabel?: string;
  className?: string;
  attribution?: AffiliateAttribution;
}

export function AlsoGreatRail({ picks, heading, jumpLabel = "Read the review", attribution, className }: AlsoGreatRailProps) {
  return (
    <section data-slot="also-great" aria-labelledby="also-great-heading" className={cn("@container", className)}>
      <h2 id="also-great-heading" className="m-0 t-ui font-medium text-fg">
        {heading}
      </h2>
      <ul className="m-0 mt-4 grid list-none gap-x-8 gap-y-6 p-0 @2xl:grid-cols-2 @5xl:grid-cols-4">
        {picks.map((pick) => {
          const offer = leadOffer(pick.product.offers);
          return (
            <li key={pick.product.id} data-product-id={pick.product.id} className="grid grid-cols-[5rem_minmax(0,1fr)] items-start gap-4">
              <PickMedia pick={pick} detail="thumb" sizes="5rem" />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="t-caption font-medium text-accent-category">{pick.award}</span>
                <a href={`#${reviewId(pick)}`} data-name className="kit-focus rounded-ctl t-ui text-fg hover:underline">
                  {pick.product.brand} {pick.product.name}
                </a>
                <p className="m-0 t-small text-fg-muted">Best for {pick.bestFor}.</p>
                {offer && (
                  <p className="m-0 t-small text-fg-muted">
                    <span data-numeric className="t-figure text-fg">
                      {formatPrice(offer.price, offer.currency ?? "USD")}
                    </span>{" "}
                    <BuyLink offer={offer} productId={pick.product.id} placement="also-great" attribution={attribution} className="t-small">
                      at {offer.merchantName}
                    </BuyLink>
                  </p>
                )}
                <JumpLink href={`#${reviewId(pick)}`} className="t-small">
                  {jumpLabel}
                </JumpLink>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
