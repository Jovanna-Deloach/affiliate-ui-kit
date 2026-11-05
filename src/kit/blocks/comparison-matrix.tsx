import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Metric, MetricValue, Pick } from "@/kit/types";
import { BuyPill, ResultMark } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * Every pick on the same columns, as a decision tool: an elevated card
 * with a toned header row, our pick highlighted with a tint and an accent
 * bar, and a pill to the lowest in-stock retailer in the last column. The
 * disqualified table composes inside the same card on shared columns. In a
 * narrow container each contender condenses to a header, three key
 * measurements as pills and a price line, so the phone page does not
 * repeat the specification lists of the deep dives.
 */

export function matrixWidths(metricCount: number): number[] {
  // Many metrics: the product column gives way, so figures never wrap mid-value.
  const product = metricCount >= 5 ? 25 : 30;
  const price = metricCount >= 5 ? 16 : 18;
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
  if (!v) return <span className="t-small text-fg-muted">Not measured</span>;
  if (v.status && (v.value === "Pass" || v.value === "Fail")) return <ResultMark status={v.status}>{v.value}</ResultMark>;
  return (
    <span data-numeric className={cn("inline-flex flex-wrap items-center gap-2 whitespace-nowrap t-figure-table", v.status === "fail" ? "text-fail" : "text-fg")}>
      {v.value}
      {v.status === "fail" && <ResultMark status="fail">Fail</ResultMark>}
    </span>
  );
}

export const compactMetrics = (metrics: Metric[]) => {
  const marked = metrics.filter((m) => m.compact);
  return marked.length ? marked : metrics.slice(0, 3);
};

/** Key measurements as pills: the condensed phone row. */
export function MetricPills({ metrics, values }: { metrics: Metric[]; values: Record<string, MetricValue> }) {
  return (
    <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0 @3xl:hidden">
      {compactMetrics(metrics).map((m) => {
        const v = values[m.key];
        return (
          <li key={m.key} className="inline-flex items-baseline gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 t-caption">
            <span className="text-fg-muted">{m.label}</span>
            <span data-numeric className={cn("font-medium", v?.status === "fail" ? "text-fail" : "text-fg")}>
              {v?.value ?? "Not measured"}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Row classes shared with the disqualified table. In a narrow container a
 * row is a small card: the header (thumbnail, award, name) on the full
 * width, its three key measurements as pills, then the price and the
 * retailer pill on one line. Nothing competes with the name for width.
 */
export const matrixRow = "border-t border-line @max-3xl:grid @max-3xl:gap-3 @max-3xl:px-4 @max-3xl:py-4";
export const matrixHead = "py-4 pr-4 pl-6 text-left align-middle font-normal @max-3xl:p-0";
export const matrixCell = "px-4 py-4 align-middle @max-3xl:hidden";
export const matrixEnd = "py-4 pr-6 pl-4 text-right align-middle @max-3xl:p-0 @max-3xl:text-left";

export interface ComparisonMatrixProps {
  heading: string;
  intro?: string;
  metrics: Metric[];
  picks: Pick[];
  attribution?: AffiliateAttribution;
  /** Rendered inside the card under the picks, e.g. a DisqualifiedSubTable. */
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
      <div className="kit-card mt-8 overflow-hidden">
        <table className="w-full border-collapse text-left @max-3xl:block @3xl:table-fixed">
          <MatrixColgroup metrics={metrics} />
          <thead className="@max-3xl:sr-only">
            <tr className="bg-well">
              <th scope="col" className="py-3 pr-4 pl-6 t-caption font-medium text-fg-muted">
                Product
              </th>
              {metrics.map((m) => (
                <th key={m.key} scope="col" className="px-4 py-3 t-caption font-medium text-fg-muted">
                  {m.label}
                </th>
              ))}
              <th scope="col" className="py-3 pr-6 pl-4 text-right t-caption font-medium text-fg-muted">
                Lowest price
              </th>
            </tr>
          </thead>
          <tbody className="@max-3xl:block">
            {picks.map((pick, i) => {
              const offer = leadOffer(pick.product.offers);
              const lead = i === 0;
              return (
                <tr
                  key={pick.product.id}
                  data-product-id={pick.product.id}
                  className={cn(matrixRow, lead && "bg-accent-category-soft/50 @max-3xl:border-l-[3px] @max-3xl:border-l-accent-category")}
                >
                  <th scope="row" className={cn(matrixHead, "border-l-[3px] @max-3xl:border-l-0", lead ? "border-l-accent-category" : "border-l-transparent")}>
                    <a href={`#${reviewId(pick)}`} className="kit-focus group grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-3 rounded-ctl">
                      <span className="rounded-media bg-well p-1">
                        <PickMedia pick={pick} detail="thumb" sizes="3.5rem" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="t-caption font-medium text-accent-category">{pick.award}</span>
                        <span data-name className="t-ui text-fg decoration-1 underline-offset-4 group-hover:underline">
                          {pickName(pick)}
                        </span>
                      </span>
                    </a>
                    <MetricPills metrics={metrics} values={pick.metrics} />
                  </th>
                  {metrics.map((m) => (
                    <td key={m.key} className={matrixCell}>
                      <MetricCell v={pick.metrics[m.key]} />
                    </td>
                  ))}
                  <td className={matrixEnd}>
                    {offer ? (
                      <span className="inline-flex flex-col items-stretch gap-1.5 text-right @max-3xl:flex @max-3xl:flex-row @max-3xl:items-center @max-3xl:justify-between">
                        <span data-numeric className="t-figure-table text-fg">
                          {formatPrice(offer.price, offer.currency ?? "USD")}
                        </span>
                        <BuyPill offer={offer} productId={pick.product.id} placement="comparison" attribution={attribution}>
                          {offer.merchantName}
                        </BuyPill>
                      </span>
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
      </div>
      {notes.length > 0 && (
        <div className="mt-4 flex max-w-measure flex-col gap-1">
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
