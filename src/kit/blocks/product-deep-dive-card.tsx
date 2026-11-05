import { Check, Minus } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Evidence, Pick } from "@/kit/types";
import { Award, ResultMark, ScoreBars } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { BuyBlock } from "./buy-block";
import { Avatar, lowerFirst } from "./person";
import { PickMedia, reviewId } from "./quick-verdict-bento";

/**
 * One pick, reviewed in full. Every deep dive has the same geometry, so a
 * page of them reads as one system:
 *
 *   ┌ 5 columns (sticky) ─────┐ ┌ 7 columns ─────────────────────────┐
 *   │ media, 4:3, ≤ 340px     │ │ award                              │
 *   │ how it scored / results │ │ H2 product name                    │
 *   │ specifications          │ │ what we measured (one sentence)    │
 *   └─────────────────────────┘ │ buy block: one button, disclosure  │
 *                               │ narrative, at reading measure      │
 *                               │ what we like  │ what to know       │
 *                               │ tester’s words                     │
 *                               └────────────────────────────────────┘
 *
 * Both columns start on the same line (items-start; bottom alignment is
 * banned by the audit). In a narrow container the columns dissolve into one
 * reading order: media, the story, then the evidence and specifications.
 */
export interface ProductDeepDiveCardProps {
  pick: Pick;
  disclosureHref: string;
  attribution?: AffiliateAttribution;
  className?: string;
}

const RESULT_WORD = { pass: "Pass", caution: "Near limit", fail: "Fail" } as const;

function EvidenceBlock({ evidence, id }: { evidence: Evidence; id: string }) {
  return (
    <section data-slot="evidence" aria-labelledby={id}>
      <h3 id={id} className="m-0 t-ui font-medium text-fg">
        {evidence.heading}
      </h3>
      {evidence.kind === "scores" ? (
        <ScoreBars items={evidence.items} className="mt-4" />
      ) : (
        <table className="mt-3 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="pb-2 t-caption font-normal text-fg-muted">
                Analyte
              </th>
              <th scope="col" className="pb-2 pl-3 text-right t-caption font-normal text-fg-muted">
                Measured
              </th>
              <th scope="col" className="pb-2 pl-3 text-right t-caption font-normal text-fg-muted">
                Limit
              </th>
              <th scope="col" className="pb-2 pl-3 text-right t-caption font-normal text-fg-muted">
                <span className="sr-only">Result</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {evidence.items.map((r) => (
              <tr key={r.label} className="border-b border-line">
                <th scope="row" className="py-2.5 t-small font-normal text-fg">
                  {r.label}
                </th>
                <td data-numeric className="py-2.5 pl-3 text-right whitespace-nowrap t-small t-figure text-fg">
                  {r.value}
                </td>
                <td data-numeric className="py-2.5 pl-3 text-right whitespace-nowrap t-small text-fg-muted">
                  {r.limit}
                </td>
                <td className="py-2.5 pl-3 text-right">
                  <ResultMark status={r.status}>{RESULT_WORD[r.status]}</ResultMark>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

export function ProductDeepDiveCard({ pick, disclosureHref, attribution, className }: ProductDeepDiveCardProps) {
  const { product } = pick;
  const id = reviewId(pick);
  const name = `${product.brand} ${product.name}`;
  return (
    <article id={id} data-slot="deep-dive" data-product-id={product.id} aria-labelledby={`${id}-title`} className={cn("@container scroll-mt-8", className)}>
      <div className="grid items-start gap-8 @4xl:grid-cols-12 @4xl:gap-x-12">
        <div data-col="media" className="contents @4xl:sticky @4xl:top-8 @4xl:col-span-5 @4xl:flex @4xl:flex-col @4xl:gap-10">
          <figure data-slot="media" className="order-1 m-0 @4xl:order-none">
            <PickMedia pick={pick} detail="full" sizes="(min-width: 1024px) 40vw, 100vw" className="max-h-(--media-max-h)" />
          </figure>
          <div className="order-3 @4xl:order-none">
            <EvidenceBlock evidence={pick.evidence} id={`${id}-evidence`} />
          </div>
          <section data-slot="specs" aria-labelledby={`${id}-specs`} className="order-4 @4xl:order-none">
            <h3 id={`${id}-specs`} className="m-0 t-ui font-medium text-fg">
              Specifications
            </h3>
            <dl className="m-0 mt-3 divide-y divide-line border-y border-line">
              {pick.facts.map((f) => (
                <div key={f.label} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] gap-4 py-2.5">
                  <dt className="t-small text-fg-muted">{f.label}</dt>
                  <dd data-numeric className="m-0 t-small text-fg">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <div data-col="story" className="order-2 flex min-w-0 flex-col @4xl:order-none @4xl:col-span-7">
          <Award>{pick.award}</Award>
          <h2 id={`${id}-title`} data-slot="title" data-name className="m-0 mt-4 t-title text-fg">
            {name}
          </h2>
          <p data-slot="synthesis" className="m-0 mt-3 max-w-measure t-lead text-fg-muted">
            {pick.synthesis}
          </p>
          <BuyBlock product={product} placement="deep-dive" disclosureHref={disclosureHref} attribution={attribution} className="mt-6" />
          <div data-slot="narrative" className="mt-8 flex max-w-measure flex-col gap-5">
            {pick.body.map((p) => (
              <p key={p.slice(0, 32)} className="m-0 t-body text-fg">
                {p}
              </p>
            ))}
          </div>
          <div data-slot="points" className="mt-8 grid gap-8 @xl:grid-cols-2">
            <section aria-labelledby={`${id}-likes`}>
              <h3 id={`${id}-likes`} className="m-0 t-ui font-medium text-fg">
                What we like
              </h3>
              <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
                {pick.likes.map((l) => (
                  <li key={l} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 t-small text-fg">
                    <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 text-pass" />
                    {l}
                  </li>
                ))}
              </ul>
            </section>
            <section aria-labelledby={`${id}-caveats`}>
              <h3 id={`${id}-caveats`} className="m-0 t-ui font-medium text-fg">
                What to know
              </h3>
              <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
                {pick.caveats.map((c) => (
                  <li key={c} className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-2 t-small text-fg">
                    <Minus size={16} strokeWidth={2} aria-hidden="true" className="mt-0.5 text-fg-muted" />
                    {c}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <figure data-slot="pull-quote" className="m-0 mt-10 max-w-measure">
            <blockquote className="m-0 t-quote text-fg">
              <p className="m-0">
                <span className="kit-hang">“</span>
                {pick.quote.text}”
              </p>
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3 t-small text-fg-muted">
              <Avatar person={pick.quote.person} size="sm" />
              <span>
                <span className="text-fg">{pick.quote.person.name}</span>
                {pick.quote.person.role && <>, {lowerFirst(pick.quote.person.role)}</>}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </article>
  );
}
