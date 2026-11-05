import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Pick } from "@/kit/types";
import { AssayGraphic, Award, BiomechMatrix, Scorecard, TimingStrip } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { BuyBlock } from "./buy-block";
import { Avatar, lowerFirst } from "./person";
import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * One pick, reviewed in full, as an elevated card on the toned ground.
 * Every deep dive has the same geometry, so a page of them reads as one
 * system:
 *
 *   ┌ header: award, what it is ──────────────── score · specs · buy ┐
 *   ├ 5 columns (sticky) ─────────┬ 7 columns ───────────────────────┤
 *   │ media well, 4:3, ≤ 340px    │ H2 product name                   │
 *   │ composite score + subscores │ what we measured (one sentence)   │
 *   │ measurements graphic        │ merchant buy box (recessed)       │
 *   │                             │ narrative, ≤ 65ch                 │
 *   │                             │ what we like │ what to know       │
 *   │                             │ tester callout + proof            │
 *   ├ 12 columns ─────────────────┴───────────────────────────────────┤
 *   │ specifications, a two-column spec sheet                         │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * Both columns start on the same line (bottom alignment is banned by the
 * audit), and the sticky evidence column is kept shorter than the story:
 * the spec sheet runs full width beneath both, so neither column ends in a
 * void. In a narrow container the columns dissolve into one reading order:
 * media, the story, then score, measurements and specifications.
 */
export interface ProductDeepDiveCardProps {
  pick: Pick;
  disclosureHref: string;
  attribution?: AffiliateAttribution;
  className?: string;
}

function Measurements({ pick, id }: { pick: Pick; id: string }) {
  const m = pick.measurements;
  if (m.kind === "timing") return <TimingStrip m={m} id={id} />;
  if (m.kind === "biomech") return <BiomechMatrix m={m} id={id} />;
  // The certificate is the media unless the site has a photograph to lead with.
  if (pick.product.image) return <AssayGraphic measurements={m} productId={pick.product.id} name={pickName(pick)} />;
  return null;
}

export function ProductDeepDiveCard({ pick, disclosureHref, attribution, className }: ProductDeepDiveCardProps) {
  const { product } = pick;
  const id = reviewId(pick);
  const name = pickName(pick);
  const measurements = Measurements({ pick, id: `${id}-measured` });
  return (
    <article id={id} data-slot="deep-dive" data-product-id={product.id} aria-labelledby={`${id}-title`} className={cn("@container kit-card scroll-mt-8", className)}>
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line px-5 py-3 @2xl:px-8">
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <Award>{pick.award}</Award>
          <span className="t-small text-fg-muted">{pick.descriptor}</span>
        </div>
        <nav aria-label={`${name}, in this review`} className="hidden @3xl:block">
          <ul className="m-0 flex list-none gap-5 p-0 t-small">
            <li>
              <a href={`#${id}-score`} className="kit-focus kit-link rounded-ctl text-fg-muted hover:text-fg">
                Score
              </a>
            </li>
            <li>
              <a href={`#${id}-specs`} className="kit-focus kit-link rounded-ctl text-fg-muted hover:text-fg">
                Specifications
              </a>
            </li>
            <li>
              <a href={`#${id}-buy`} className="kit-focus kit-link rounded-ctl text-fg-muted hover:text-fg">
                Where to buy
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <div className="grid items-start gap-8 p-5 @2xl:p-8 @4xl:grid-cols-12 @4xl:gap-x-10">
        <div data-col="media" className="contents @4xl:sticky @4xl:top-8 @4xl:col-span-5 @4xl:flex @4xl:flex-col @4xl:gap-6">
          <figure data-slot="media" className="order-1 m-0 @4xl:order-none">
            <PickMedia pick={pick} detail="full" sizes="(min-width: 1024px) 36vw, 100vw" className="max-h-(--media-max-h)" />
          </figure>
          <div className="order-3 @4xl:order-none">
            <Scorecard rating={pick.rating} scores={pick.scores} id={`${id}-score`} />
          </div>
          {measurements && <div className="order-4 @4xl:order-none">{measurements}</div>}
        </div>

        <div data-col="story" className="order-2 flex min-w-0 flex-col @4xl:order-none @4xl:col-span-7">
          <h2 id={`${id}-title`} data-slot="title" data-name className="m-0 t-title text-fg">
            {name}
          </h2>
          <p data-slot="synthesis" className="m-0 mt-3 max-w-measure t-lead text-fg-muted">
            {pick.synthesis}
          </p>
          <BuyBlock id={`${id}-buy`} product={product} placement="deep-dive" disclosureHref={disclosureHref} attribution={attribution} className="mt-6" />
          <div data-slot="narrative" className="mt-8 flex max-w-measure flex-col gap-5">
            {pick.body.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 t-body text-fg">
                {p}
              </p>
            ))}
          </div>
          <div data-slot="points" className="mt-8 grid border-y border-line @xl:grid-cols-2 @xl:divide-x @xl:divide-line">
            <section aria-labelledby={`${id}-likes`} className="py-5 @xl:pr-6">
              <h3 id={`${id}-likes`} className="m-0 t-ui font-semibold text-fg">
                What we like
              </h3>
              <ul className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
                {pick.likes.map((l) => (
                  <li key={l} className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2.5 t-small text-fg">
                    <span aria-hidden="true" className="mt-px grid size-5 place-items-center rounded-full bg-pass-soft text-pass">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {l}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby={`${id}-caveats`} className="border-t border-line py-5 @xl:border-t-0 @xl:pl-6">
              <h3 id={`${id}-caveats`} className="m-0 t-ui font-semibold text-fg">
                What to know
              </h3>
              <ul className="m-0 mt-3 flex list-none flex-col gap-3 p-0">
                {pick.caveats.map((c) => (
                  <li key={c} className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-start gap-2.5 t-small text-fg">
                    <span aria-hidden="true" className="mt-px grid size-5 place-items-center rounded-full bg-warn-soft text-warn">
                      <Minus size={12} strokeWidth={2.5} />
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <figure data-slot="pull-quote" className="m-0 mt-8 rounded-box bg-well p-5 @xl:p-6">
            <blockquote className="m-0 t-quote text-fg">
              <p className="m-0">
                <span className="kit-hang">“</span>
                {pick.quote.text}”
              </p>
            </blockquote>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3 t-small text-fg-muted">
                <Avatar person={pick.quote.person} size="sm" />
                <span>
                  <span className="text-fg">{pick.quote.person.name}</span>
                  {pick.quote.person.role && <>, {lowerFirst(pick.quote.person.role)}</>}
                </span>
              </span>
              <span className="rounded-full border border-line bg-paper px-2.5 py-1 t-caption font-medium text-fg">{pick.quote.proof}</span>
            </figcaption>
          </figure>
        </div>

        <section data-slot="specs" id={`${id}-specs`} aria-labelledby={`${id}-specs-heading`} className="order-5 scroll-mt-8 @4xl:col-span-12 @4xl:border-t @4xl:border-line @4xl:pt-8">
          <h3 id={`${id}-specs-heading`} className="m-0 t-ui font-semibold text-fg">
            Specifications
          </h3>
          <dl className="m-0 mt-3 grid @2xl:grid-cols-2 @2xl:gap-x-10">
            {pick.facts.map((f) => (
              <div key={f.label} className="-mt-px grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-4 border-y border-line py-2.5">
                <dt className="t-small text-fg-muted">{f.label}</dt>
                <dd data-numeric className="m-0 t-small text-fg">
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
