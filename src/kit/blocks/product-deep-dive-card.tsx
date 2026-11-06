import { cn } from "@/lib/cn";
import { AssayBadge, BuyBlock, PickMedia, pickName, ProsCons, PullQuote, reviewId, Scorecard, SpecSheet, Telemetry } from "@/kit/components";
import type { Pick } from "@/kit/types";
import { Award, Eyebrow } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * One pick, reviewed in full, as one elevated card. Every deep dive has the
 * same geometry, so a page of them reads as one system:
 *
 *   ┌ 5 columns (sticky) ─────────┬ 7 columns ───────────────────────┐
 *   │ studio frame, 4 : 4.2       │ descriptor (Eyebrow)              │
 *   │  Award pinned top-left      │ H2 product name (display serif)   │
 *   │  AssayBadge (supplements)   │ what we measured, one sentence    │
 *   │                             │ BuyBlock: OfferCard + RetailerList│
 *   │ Scorecard + Telemetry       │ narrative, ≤ 65ch                 │
 *   │                             │ ProsCons                          │
 *   │                             │ PullQuote                         │
 *   ├ footer ─────────────────────┴───────────────────────────────────┤
 *   │ SpecSheet drawer: full specifications · n details             + │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Two things in the left rail and no boxes inside the card besides the
 * offer. Both columns start on the same line, and the sticky rail is
 * shorter than the story, so neither ends in a void. In a narrow container
 * the columns dissolve into one reading order: photograph, story, score,
 * specifications.
 */
export interface ProductDeepDiveCardProps {
  pick: Pick;
  disclosureHref: string;
  attribution?: AffiliateAttribution;
  className?: string;
}

export function ProductDeepDiveCard({ pick, disclosureHref, attribution, className }: ProductDeepDiveCardProps) {
  const { product, measurements: m } = pick;
  const id = reviewId(pick);
  return (
    <article id={id} data-slot="deep-dive" data-product-id={product.id} aria-labelledby={`${id}-title`} className={cn("@container kit-card scroll-mt-8", className)}>
      <div className="grid items-start gap-8 p-5 @2xl:p-8 @4xl:grid-cols-12 @4xl:gap-x-12">
        <div data-col="media" className="contents @4xl:sticky @4xl:top-8 @4xl:col-span-5 @4xl:flex @4xl:flex-col @4xl:gap-8">
          <figure data-slot="media" className="@container order-1 m-0 @4xl:order-none">
            <PickMedia pick={pick} detail="full" sizes="(min-width: 1024px) 36vw, 100vw" className="@xl:aspect-[3/2]">
              <Award className="absolute top-4 left-4">{pick.award}</Award>
              {m.kind === "assay" && <AssayBadge m={m} className="absolute bottom-4 left-4" />}
            </PickMedia>
          </figure>
          <Scorecard rating={pick.rating} scores={pick.scores} id={`${id}-score`} className="order-3 @4xl:order-none @4xl:border-t-0 @4xl:pt-0">
            <Telemetry measurements={m} />
          </Scorecard>
        </div>

        <div data-col="story" className="order-2 flex min-w-0 flex-col @4xl:order-none @4xl:col-span-7">
          <Eyebrow data-slot="descriptor">{pick.descriptor}</Eyebrow>
          <h2 id={`${id}-title`} data-slot="title" data-name className="m-0 mt-3 t-title text-fg">
            {pickName(pick)}
          </h2>
          <p data-slot="synthesis" className="m-0 mt-3 max-w-measure t-lead text-fg-body">
            {pick.synthesis}
          </p>
          <BuyBlock id={`${id}-buy`} product={product} placement="deep-dive" disclosureHref={disclosureHref} attribution={attribution} className="mt-6 max-w-measure" />
          <div data-slot="narrative" className="mt-8 flex max-w-measure flex-col gap-5">
            {pick.body.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 t-body text-fg-body">
                {p}
              </p>
            ))}
          </div>
          <ProsCons id={id} pros={pick.likes} cons={pick.caveats} className="mt-8" />
          <PullQuote text={pick.quote.text} person={pick.quote.person} proof={pick.quote.proof} className="my-6 max-w-measure" />
        </div>
      </div>

      <SpecSheet facts={pick.facts} id={`${id}-specs`} />
    </article>
  );
}
