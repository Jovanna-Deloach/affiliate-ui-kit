import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Pick } from "@/kit/types";
import { Award, BestPrice, BuyButton, JumpLink } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickRow } from "./also-great-rail";
import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * The answer, above the fold, as an asymmetric bento on the toned ground.
 *
 *   ┌ 7 columns ─────────────────────────┐ ┌ 5 columns ─────────────┐
 *   │ ▬ accent rule                       │ │ compact card, pick 2   │
 *   │ media     │ award, name, verdict,   │ ├────────────────────────┤
 *   │           │ price, one filled button│ │ compact card, pick 3   │
 *   └─────────────────────────────────────┘ └────────────────────────┘
 *   ┌ 12 columns: also tested and recommended (picks 4+) ──────────────┐
 *
 * The hero says why (verdict); compact cards say who (best for); neither
 * repeats the deep dive, which says what was measured. One filled button,
 * on the hero; the rest are outlined.
 */
export interface QuickVerdictBentoProps {
  picks: Pick[];
  jumpLabel: string;
  attribution?: AffiliateAttribution;
  heading?: string;
  moreHeading?: string;
  className?: string;
}

/** The lead price, and “Best price” when another retailer has it in stock for more. The merchant is named on the button. */
function Price({ pick, size = "lg" }: { pick: Pick; size?: "lg" | "md" }) {
  const offer = leadOffer(pick.product.offers);
  if (!offer) return <p className="m-0 t-small text-fg-muted">Sold out everywhere we track</p>;
  const competing = pick.product.offers.some((o) => o.inStock && o.id !== offer.id);
  return (
    <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1">
      <span data-numeric className={cn(size === "lg" ? "t-figure-xl" : "t-figure-table", "text-fg")}>
        {formatPrice(offer.price, offer.currency ?? "USD")}
      </span>
      {size === "lg" && competing && <BestPrice />}
    </p>
  );
}

/**
 * The well a verdict card's media fills. Its height comes from the card
 * (side by side) or its own ratio (stacked); the media is laid in absolutely,
 * contain-fit, so it never sets the card's height and never floats small.
 */
function MediaWell({ pick, sizes, className }: { pick: Pick; sizes: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-media bg-well", className)}>
      <div className="absolute inset-0">
        <PickMedia pick={pick} detail="card" sizes={sizes} />
      </div>
    </div>
  );
}

/**
 * The hero. Beside a stack its well takes the stack's height; alone (a
 * single-pick page) it is the deep dive's 5 : 7 split with a 4 : 3 well, so
 * a wide card never leaves the media small in a long, low box.
 */
function HeroCard({ pick, jumpLabel, attribution, solo, className }: { pick: Pick; jumpLabel: string; attribution?: AffiliateAttribution; solo?: boolean; className?: string }) {
  const offer = leadOffer(pick.product.offers);
  return (
    <article data-slot="verdict-hero" data-product-id={pick.product.id} className={cn("@container kit-card flex flex-col overflow-hidden", className)}>
      <span aria-hidden="true" className="block h-[3px] bg-accent-category" />
      <div className={cn("grid flex-1 gap-5 p-5 @xl:gap-6 @xl:p-6", solo ? "@xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]" : "@xl:grid-cols-2")}>
        <MediaWell pick={pick} sizes="(min-width: 1024px) 26vw, 90vw" className={solo ? "aspect-square @xl:aspect-[4/3]" : "aspect-square @xl:aspect-auto @xl:min-h-80"} />
        <div className="flex flex-col @xl:py-2">
          <Award>{pick.award}</Award>
          <h3 className="m-0 mt-3 t-title text-fg">
            <a href={`#${reviewId(pick)}`} data-name className="kit-focus rounded-ctl hover:underline">
              {pickName(pick)}
            </a>
          </h3>
          <p className="m-0 mt-3 t-lead text-fg-muted">{pick.verdict}</p>
          <div className="mt-auto pt-6">
            <Price pick={pick} />
          </div>
          {offer && (
            <BuyButton offer={offer} productId={pick.product.id} placement="verdict-hero" attribution={attribution} icon className="mt-4 h-[46px] w-full font-medium @2xl:w-auto @2xl:min-w-[220px] @2xl:self-start" />
          )}
          <JumpLink href={`#${reviewId(pick)}`} className="mt-1 self-start">
            {jumpLabel}
          </JumpLink>
        </div>
      </div>
    </article>
  );
}

function CompactCard({ pick, jumpLabel, attribution, tall, className }: { pick: Pick; jumpLabel: string; attribution?: AffiliateAttribution; tall?: boolean; className?: string }) {
  const offer = leadOffer(pick.product.offers);
  return (
    <article data-slot="verdict-card" data-product-id={pick.product.id} className={cn("@container kit-card p-4", className)}>
      <div className={cn("grid h-full gap-4", tall ? "grid-rows-[auto_1fr]" : "grid-cols-[7rem_minmax(0,1fr)] @md:grid-cols-[9rem_minmax(0,1fr)]")}>
        <MediaWell pick={pick} sizes="(min-width: 1024px) 18vw, 9rem" className={tall ? "aspect-[4/3]" : "min-h-40"} />
        <div className="flex min-w-0 flex-col py-0.5">
          <Award>{pick.award}</Award>
          <h3 className="m-0 mt-2 t-name text-fg">
            <a href={`#${reviewId(pick)}`} data-name className="kit-focus rounded-ctl hover:underline">
              {pickName(pick)}
            </a>
          </h3>
          <p className="m-0 mt-1 t-small text-fg-muted">Best for {pick.bestFor}.</p>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
            <Price pick={pick} size="md" />
            {offer && <BuyButton offer={offer} productId={pick.product.id} placement="verdict-card" attribution={attribution} emphasis="secondary" />}
          </div>
          <JumpLink href={`#${reviewId(pick)}`} className="mt-1 self-start t-small">
            {jumpLabel}
          </JumpLink>
        </div>
      </div>
    </article>
  );
}

export function QuickVerdictBento({ picks, jumpLabel, attribution, heading = "Our picks at a glance", moreHeading = "Also tested and recommended", className }: QuickVerdictBentoProps) {
  const [hero, ...rest] = picks;
  if (!hero) return null;
  const stack = rest.slice(0, 2);
  const more = rest.slice(2);
  return (
    <section data-slot="quick-verdict" aria-labelledby="quick-verdict-heading" className={cn("@container", className)}>
      <h2 id="quick-verdict-heading" className="sr-only">
        {heading}
      </h2>
      <div className={cn("grid gap-4", stack.length > 0 && "@4xl:grid-cols-12")}>
        <HeroCard pick={hero} jumpLabel={jumpLabel} attribution={attribution} solo={stack.length === 0} className={cn(stack.length > 0 && "@4xl:col-span-7", stack.length === 2 && "@4xl:row-span-2")} />
        {stack.map((pick) => (
          <CompactCard key={pick.product.id} pick={pick} jumpLabel={jumpLabel} attribution={attribution} tall={stack.length === 1} className="@4xl:col-span-5" />
        ))}
        {more.length > 0 && (
          <section data-slot="verdict-more" aria-labelledby="verdict-more-heading" className="kit-card @4xl:col-span-12">
            <h3 id="verdict-more-heading" className="m-0 border-b border-line px-5 py-3 t-ui font-semibold text-fg">
              {moreHeading}
            </h3>
            <ul className={cn("m-0 grid list-none divide-y divide-line p-0", more.length > 1 && "@3xl:grid-cols-2 @3xl:divide-x @3xl:divide-y-0")}>
              {more.map((pick) => (
                <li key={pick.product.id} className="p-4">
                  <PickRow pick={pick} jumpLabel={jumpLabel} attribution={attribution} wide={more.length === 1} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
