import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { PickMedia, pickName, reviewId, WarningNote } from "@/kit/components";
import { leadOffer } from "@/kit/lib/offers";
import { underWarning, warningId } from "@/kit/lib/warnings";
import { upperFirst } from "@/kit/lib/text";
import type { Metric, MetricValue, Pick } from "@/kit/types";
import { BuyPill, Eyebrow, Price, ResultMark } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

/*
 * The comparison table’s shared geometry: column widths, the colgroup, cells
 * and row classes, so the disqualified table lines up under the picks.
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
/** Column heads: mono micro-caps on the secondary text color. */
export const matrixTh = "px-4 pt-4 pb-3 align-bottom t-micro text-fg-muted";

export interface ComparisonMatrixProps {
  /** The section’s heading, saying something: “How the six compare”, not “Comparison”. */
  heading: string;
  /** An optional sentence under the heading. */
  intro?: string;
  /** The columns every pick is measured on; a `note` prints under the table, `compact` picks the phone pills. */
  metrics: Metric[];
  /** The picks in order, our pick first (it gets the tint and the filled pill). Each pick’s `metrics` holds a value per column key. */
  picks: Pick[];
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** Rendered inside the card under the picks: a `DisqualifiedSubTable`, on the same columns. */
  children?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Every pick on the same columns, as a decision tool: micro-caps column
 * heads, our pick on the category tint, who each pick is for, and in the last
 * column the lowest in-stock price, its retailer and a “Buy” pill (filled
 * for our pick only). In a narrow container each pick condenses to its name,
 * three key measurements as pills and a price line, so the phone page does
 * not repeat the deep dives.
 *
 * **Use it for** two or more picks measured on the same things. **Not for**
 * specifications of one product (`SpecSheet`), products we would not buy
 * (`DisqualifiedSubTable`, as its child) or a catalog without measurements
 * (`AlsoGreatRail`).
 *
 * @summary Every pick on the same columns, with each one’s lowest price and a Buy pill.
 * @import import { ComparisonMatrix } from "@/kit/blocks";
 */
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
              const warning = underWarning(pick.product) ? pick.product.warning : undefined;
              const offer = warning ? undefined : leadOffer(pick.product.offers);
              const lead = i === 0;
              return (
                <tr key={pick.product.id} data-product-id={pick.product.id} data-warning={warning ? "active" : undefined} className={cn(matrixRow, "first:border-t-0", lead && "bg-accent-category-soft/40")}>
                  <th scope="row" className={matrixHead}>
                    <a href={`#${reviewId(pick)}`} className="kit-focus group grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4 rounded-ctl">
                      <PickMedia pick={pick} detail="thumb" sizes="3.5rem" />
                      <span className="flex min-w-0 flex-col gap-1">
                        <Eyebrow as="span" size="sm" tone="category">
                          {pick.award}
                        </Eyebrow>
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
                        <Price amount={offer.price} currency={offer.currency} size="sm" note={<span className="whitespace-nowrap">at {offer.merchantName}</span>} />
                        <BuyPill offer={offer} productId={pick.product.id} placement="comparison" attribution={attribution} filled={lead} />
                      </span>
                    ) : warning ? (
                      <WarningNote warning={warning} href={`#${warningId(pick.product)}`} className="justify-end text-right @max-3xl:justify-start @max-3xl:text-left" />
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
