import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Metric, MetricValue, Pick } from "@/kit/types";
import { BuyLink, ResultMark } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, reviewId } from "./quick-verdict-bento";

/**
 * Every pick on the same columns. One semantic table with fixed column
 * widths shared with the disqualified table below it, so the two read as
 * one ledger. In a narrow container each row becomes a stacked block that
 * keeps its labels (no duplicate markup). Prices are the lowest in-stock
 * offer, linked as text.
 */

export function matrixWidths(metricCount: number): number[] {
  // Many metrics: the product column gives way, so figures never wrap mid-value.
  const product = metricCount >= 5 ? 24 : 30;
  const price = metricCount >= 5 ? 14 : 17;
  const each = (100 - product - price) / Math.max(1, metricCount);
  return [product, ...Array.from({ length: metricCount }, () => each), price];
}

export function MatrixColgroup({ metrics }: { metrics: Metric[] }) {
  return (
    <colgroup>
      {matrixWidths(metrics.length).map((w, i) => (
        <col key={i} style={{ width: `${w}%` }} />
      ))}
    </colgroup>
  );
}

export function MetricCell({ v }: { v?: MetricValue }) {
  if (!v) return <span className="text-fg-muted">Not measured</span>;
  if (v.status && (v.value === "Pass" || v.value === "Fail")) return <ResultMark status={v.status}>{v.value}</ResultMark>;
  return (
    <span data-numeric className={cn("inline-flex flex-wrap items-center gap-2 whitespace-nowrap t-figure-table", v.status === "fail" ? "text-fail" : "text-fg")}>
      {v.value}
      {v.status === "fail" && <ResultMark status="fail">Fail</ResultMark>}
    </span>
  );
}

/** Cell classes: a labelled flex row in a narrow container, a padded cell in a wide one. */
export const matrixCell =
  "@max-3xl:flex @max-3xl:items-baseline @max-3xl:justify-between @max-3xl:gap-4 @max-3xl:py-1.5 @max-3xl:before:t-small @max-3xl:before:text-fg-muted @max-3xl:before:content-[attr(data-label)] @3xl:px-4 @3xl:py-4 @3xl:align-middle";

export interface ComparisonMatrixProps {
  heading: string;
  intro?: string;
  metrics: Metric[];
  picks: Pick[];
  attribution?: AffiliateAttribution;
  /** Rendered under the table and above the notes, e.g. a DisqualifiedSubTable. */
  children?: ReactNode;
  className?: string;
}

export function ComparisonMatrix({ heading, intro, metrics, picks, attribution, children, className }: ComparisonMatrixProps) {
  const notes = metrics.filter((m) => m.note);
  return (
    <section id="compare" data-slot="comparison" aria-labelledby="compare-heading" className={cn("@container scroll-mt-24", className)}>
      <h2 id="compare-heading" className="m-0 t-headline text-fg">
        {heading}
      </h2>
      {intro && <p className="m-0 mt-3 max-w-measure t-body text-fg-muted">{intro}</p>}
      <table className="mt-8 w-full border-collapse text-left @max-3xl:block @3xl:table-fixed">
        <MatrixColgroup metrics={metrics} />
        <thead className="@max-3xl:sr-only">
          <tr className="border-b border-line">
            <th scope="col" className="pr-4 pb-3 t-caption font-normal text-fg-muted">
              Product
            </th>
            {metrics.map((m) => (
              <th key={m.key} scope="col" className="px-4 pb-3 t-caption font-normal text-fg-muted">
                {m.label}
              </th>
            ))}
            <th scope="col" className="pb-3 pl-4 text-right t-caption font-normal text-fg-muted">
              Lowest price
            </th>
          </tr>
        </thead>
        <tbody className="@max-3xl:block">
          {picks.map((pick) => {
            const offer = leadOffer(pick.product.offers);
            return (
              <tr key={pick.product.id} data-product-id={pick.product.id} className="border-b border-line @max-3xl:block @max-3xl:py-5">
                <th scope="row" className="py-4 pr-4 text-left font-normal @max-3xl:block @max-3xl:pt-0 @max-3xl:pb-3">
                  <a href={`#${reviewId(pick)}`} className="kit-focus group grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4 rounded-ctl">
                    <PickMedia pick={pick} detail="thumb" sizes="3.5rem" />
                    <span className="flex min-w-0 flex-col">
                      <span className="t-caption font-medium text-accent-category">{pick.award}</span>
                      <span data-name className="t-ui text-fg decoration-1 underline-offset-4 group-hover:underline">
                        {pick.product.brand} {pick.product.name}
                      </span>
                    </span>
                  </a>
                </th>
                {metrics.map((m) => (
                  <td key={m.key} data-label={m.label} className={matrixCell}>
                    <MetricCell v={pick.metrics[m.key]} />
                  </td>
                ))}
                <td data-label="Lowest price" className={cn(matrixCell, "@3xl:pr-0 @3xl:text-right")}>
                  {offer ? (
                    <>
                      <span data-numeric className="t-figure-table text-fg @max-3xl:ml-auto @3xl:block">
                        {formatPrice(offer.price, offer.currency ?? "USD")}
                      </span>
                      <BuyLink offer={offer} productId={pick.product.id} placement="comparison" attribution={attribution} className="t-small @max-3xl:shrink-0">
                        at {offer.merchantName}
                      </BuyLink>
                    </>
                  ) : (
                    <span className="t-small text-fg-muted">Sold out</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {children}
      {notes.length > 0 && (
        <div className="mt-5 flex max-w-measure flex-col gap-1">
          {notes.map((m) => (
            <p key={m.key} className="m-0 t-caption text-fg-muted">
              <span className="text-fg">{m.label}:</span> {m.note}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
