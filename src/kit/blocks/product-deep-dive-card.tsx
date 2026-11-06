import { Check, Minus, Plus } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Pick } from "@/kit/types";
import { AssayBadge, Award, Scorecard, Sep, Telemetry } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { BuyBlock } from "./buy-block";
import { Avatar, lowerFirst } from "./person";
import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * One pick, reviewed in full, as one elevated card. Every deep dive has the
 * same geometry, so a page of them reads as one system:
 *
 *   ┌ 5 columns (sticky) ─────────┬ 7 columns ───────────────────────┐
 *   │ studio frame, 4 : 4.2       │ descriptor, in micro-caps         │
 *   │  award pinned top-left      │ H2 product name (display serif)   │
 *   │  (supplements: lab badge)   │ what we measured, one sentence    │
 *   │                             │ buy box: offer card + rows        │
 *   │ score / 10, segments,       │ narrative, ≤ 65ch                 │
 *   │ sub-scores, telemetry       │ what we like │ what to know       │
 *   │                             │ pull-quote on a 2px rule + proof  │
 *   ├ footer ─────────────────────┴───────────────────────────────────┤
 *   │ full specifications · n details                               + │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Two things in the left rail and no boxes inside the card besides the
 * offer: the frame, then the scorecard on a hairline. The specifications
 * are a native <details> drawer (in the DOM for search, closed by default).
 * Both columns start on the same line, and the sticky rail is shorter than
 * the story, so neither ends in a void. In a narrow container the columns
 * dissolve into one reading order: photograph, story, score, specifications.
 */
export interface ProductDeepDiveCardProps {
  pick: Pick;
  disclosureHref: string;
  attribution?: AffiliateAttribution;
  className?: string;
}

function Points({ id, title, items, tone }: { id: string; title: string; items: string[]; tone: "pass" | "warn" }) {
  const Icon = tone === "pass" ? Check : Minus;
  return (
    <section aria-labelledby={id}>
      <h3 id={id} className="m-0 t-micro text-fg-muted">
        {title}
      </h3>
      <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
        {items.map((item) => (
          <li key={item} className="grid grid-cols-[1rem_minmax(0,1fr)] items-start gap-3 t-small text-fg-body">
            <Icon size={15} strokeWidth={2.25} aria-hidden="true" className={cn("mt-0.5", tone === "pass" ? "text-pass" : "text-warn")} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
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
          <p data-slot="descriptor" className="m-0 t-micro text-fg-muted">
            {pick.descriptor}
          </p>
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
          <div data-slot="points" className="mt-8 grid gap-8 @xl:grid-cols-2 @xl:gap-10">
            <Points id={`${id}-likes`} title="What we like" items={pick.likes} tone="pass" />
            <Points id={`${id}-caveats`} title="What to know" items={pick.caveats} tone="warn" />
          </div>
          <figure data-slot="pull-quote" className="m-0 my-6 max-w-measure border-l-2 border-accent pl-5">
            <blockquote className="m-0 t-quote text-fg">
              <p className="m-0">
                <span className="kit-hang">“</span>
                {pick.quote.text}”
              </p>
            </blockquote>
            <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <Avatar person={pick.quote.person} size="sm" />
              <span className="t-small text-fg-muted">
                <span className="font-semibold text-fg">{pick.quote.person.name}</span>
                {pick.quote.person.role && <>, {lowerFirst(pick.quote.person.role)}</>}
              </span>
              <span className="rounded-ctl border border-line-strong px-2 py-1 t-micro text-fg">{pick.quote.proof}</span>
            </figcaption>
          </figure>
        </div>
      </div>

      <details data-slot="specs" id={`${id}-specs`} className="group kit-details scroll-mt-8 border-t border-line">
        <summary className="kit-focus flex min-h-14 items-center justify-between gap-4 rounded-b-box px-5 t-micro text-fg @2xl:px-8">
          <span className="flex flex-wrap items-center">
            Full specifications
            <Sep />
            <span className="text-fg-muted">{pick.facts.length} details</span>
          </span>
          <span aria-hidden="true" className="grid size-7 shrink-0 place-items-center rounded-ctl border border-line-strong text-fg transition-colors duration-(--dur) ease-(--ease) group-hover:border-fg">
            <Plus size={14} strokeWidth={2} className="group-open:hidden" />
            <Minus size={14} strokeWidth={2} className="hidden group-open:block" />
          </span>
        </summary>
        <dl className="m-0 grid px-5 pb-6 @2xl:grid-cols-2 @2xl:gap-x-12 @2xl:px-8">
          {pick.facts.map((f) => (
            <div key={f.label} className="-mt-px grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)] gap-4 border-y border-line py-3">
              <dt className="t-small text-fg-muted">{f.label}</dt>
              <dd data-numeric className="m-0 t-small text-fg">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </article>
  );
}
