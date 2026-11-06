import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { leadOffer } from "@/kit/lib/offers";
import type { Metric, MetricValue, Pick } from "@/kit/types";
import { BuyPill, ResultMark } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { PickMedia, pickName, reviewId } from "./pick-media";

/**
 * Every pick on the same columns, as a decision tool: an elevated card with
 * micro-caps column heads on a rule, our pick on a warm tint, who each pick
 * is for, and in the last column the lowest in-stock price, the retailer
 * and a “Buy” pill (filled for our pick only). The disqualified table
 * composes inside the same card on shared columns. In a narrow container
 * each contender condenses to a header, three key measurements as pills and
 * a price line, so the phone page does not repeat the deep dives.
 */

export function matrixWidths(metricCount: number): number[] {
  // Many metrics: the text columns give way, so figures never wrap mid-value.
  const many = metricCount >= 5;
  const product = many ? 21 : 26;
  const bestFor = many ? 13 : 17;
  const price = many ? 18 : 18;
  const each = (100 - product - bestFor - price) / Math.max(1, metricCount);
  return [product, bestFor, ...Array.from({ length: metricCount }, () => each), price];
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
    <span data-numeric className={cn("inline-flex flex-wrap items-center gap-2 whitespace-nowrap t-ui font-semibold", v.status === "fail" ? "text-fail" : "text-fg")}>
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

/** “the office, the pool…” → “The office, the pool…”, for a cell of its own. */
export const upperFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
/** Column heads: mono micro-caps on the secondary text colour. */
export const matrixTh = "px-4 pt-4 pb-3 align-bottom t-micro text-fg-muted";

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
      {intro && <p className="m-0 mt-3 max-w-measure t-body text-fg-body">{intro}</p>}
      <div className="kit-card mt-8 overflow-hidden">
        <table className="w-full border-collapse text-left @max-3xl:block @3xl:table-fixed">
          <MatrixColgroup metrics={metrics} />
          <thead className="@max-3xl:sr-only">
            <tr className="border-b border-line-strong">
              <th scope="col" className={cn(matrixTh, "pl-6")}>
                Product
              </th>
              <th scope="col" className={matrixTh}>
                Best for
              </th>
              {metrics.map((m) => (
                <th key={m.key} scope="col" className={matrixTh}>
                  {m.label}
                </th>
              ))}
              <th scope="col" className={cn(matrixTh, "pr-6 text-right")}>
                Best price
              </th>
            </tr>
          </thead>
          <tbody className="@max-3xl:block">
            {picks.map((pick, i) => {
              const offer = leadOffer(pick.product.offers);
              const lead = i === 0;
              return (
                <tr key={pick.product.id} data-product-id={pick.product.id} className={cn(matrixRow, "first:border-t-0", lead && "bg-accent-category-soft/40")}>
                  <th scope="row" className={matrixHead}>
                    <a href={`#${reviewId(pick)}`} className="kit-focus group grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4 rounded-ctl">
                      <PickMedia pick={pick} detail="thumb" sizes="3.5rem" />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="t-micro-sm text-accent-category-ink">{pick.award}</span>
                        <span data-name className="t-name-sm text-fg decoration-1 underline-offset-4 group-hover:underline">
                          {pickName(pick)}
                        </span>
                      </span>
                    </a>
                    <MetricPills metrics={metrics} values={pick.metrics} />
                  </th>
                  <td className={cn(matrixCell, "t-small text-fg-body")}>{upperFirst(pick.bestFor)}</td>
                  {metrics.map((m) => (
                    <td key={m.key} className={matrixCell}>
                      <MetricCell v={pick.metrics[m.key]} />
                    </td>
                  ))}
                  <td className={matrixEnd}>
                    {offer ? (
                      <span className="flex items-center justify-end gap-3 @max-3xl:justify-between">
                        <span className="flex flex-col text-right @max-3xl:text-left">
                          <span data-numeric className="t-ui font-semibold text-fg">
                            {formatPrice(offer.price, offer.currency ?? "USD")}
                          </span>
                          <span className="whitespace-nowrap t-caption text-fg-muted">at {offer.merchantName}</span>
                        </span>
                        <BuyPill offer={offer} productId={pick.product.id} placement="comparison" attribution={attribution} filled={lead} />
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
