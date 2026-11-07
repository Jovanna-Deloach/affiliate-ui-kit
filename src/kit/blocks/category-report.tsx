import { summarizeResults } from "@/kit/lib/evidence";
import type { CategoryResults } from "@/kit/types";
import { Disclosure, DisclosureIcon, DisclosureSummary, ResultMark } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface CategoryReportProps {
  /** Every product tested in the category: its label accuracy and whether it passed every contaminant limit. */
  results: CategoryResults;
  /** The heading (default “How {n} {category} products tested”). */
  heading?: string;
  /** An anchor, unique on the page (default `category-report`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

const pct = (n: number) => `${n.toFixed(1)}%`;

/**
 * How a whole category tested: how many products, the average label
 * accuracy, how many came within the tolerance of their label, and how many
 * failed a contaminant limit; a sentence on the range; then every product as
 * a dot on one accuracy scale, the tolerance band shaded and the label claim
 * marked, a failed contaminant shown as an open ring, not by color alone.
 * Hover a dot for the product. Every result is also in a table under it.
 *
 * **Use it for** a category’s report page or tab, beside its ranking.
 * **Not for** one product’s results (`AssayTable`), the ranked list with
 * grades and prices (`RankingList`), or picks (`ComparisonMatrix`).
 *
 * @summary A whole category’s lab results: accuracy, failures, every product on one scale.
 * @import import { CategoryReport } from "@/kit/blocks";
 */
export function CategoryReport({ results, heading, id = "category-report", className }: CategoryReportProps) {
  const { tested, average, within, failed, both, tolerance } = summarizeResults(results);
  const sorted = [...results.products].sort((a, b) => a.accuracy - b.accuracy);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  // The scale: the tolerance band with room on both sides, widened to every result, in steps of 5.
  const lo = Math.floor(Math.min(100 - tolerance * 2, lowest?.accuracy ?? 100) / 5) * 5;
  const hi = Math.ceil(Math.max(100 + tolerance * 2, highest?.accuracy ?? 100) / 5) * 5;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  // Ticks every 10%, on round numbers, so the claim (100%) is always one.
  const first = Math.ceil(lo / 10) * 10;
  const ticks = Array.from({ length: Math.floor((hi - first) / 10) + 1 }, (_, i) => first + i * 10);
  // Stack dots that would touch: each takes the lowest row where it clears the last dot by a dot’s width.
  const gap = (hi - lo) / 32;
  const lastInRow: number[] = [];
  const placed = sorted.map((p) => {
    let row = lastInRow.findIndex((last) => p.accuracy - last >= gap);
    if (row === -1) row = lastInRow.length;
    lastInRow[row] = p.accuracy;
    return { ...p, row };
  });
  const rows = Math.max(lastInRow.length, 1);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid scroll-mt-8 gap-6", className)}>
      <div className="grid gap-2">
        <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
          {heading ?? `How ${tested} ${results.name} products tested`}
        </h2>
        <p className="m-0 t-small text-fg-muted">
          Every product we bought and tested; the last on <time dateTime={results.testedAt}>{formatDateLong(results.testedAt)}</time>.
        </p>
      </div>
      <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line py-5 @2xl:grid-cols-4">
        {[
          { label: "Products tested", value: String(tested) },
          { label: "Average label accuracy", value: pct(average) },
          { label: `Within ${tolerance}% of the label`, value: `${within} of ${tested}` },
          { label: "Failed a contaminant limit", value: String(failed), fail: failed > 0 },
        ].map((stat) => (
          <div key={stat.label} className="grid content-start gap-1">
            <dt className="t-small text-fg-muted">{stat.label}</dt>
            <dd data-numeric className={cn("m-0 t-figure", stat.fail ? "text-fail" : "text-fg")}>
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {lowest && highest ? (
        <p className="m-0 max-w-measure t-body text-fg-body">
          Label accuracy ran from <span data-numeric>{pct(lowest.accuracy)}</span> ({lowest.brand} {lowest.name}) to <span data-numeric>{pct(highest.accuracy)}</span> ({highest.brand} {highest.name}).{" "}
          Of the {tested}, {both} came within {tolerance}% of {both === 1 ? "its" : "their"} label and passed every contaminant limit.
        </p>
      ) : null}

      <figure className="m-0 grid gap-3">
        <figcaption className="t-ui font-semibold text-fg">Label accuracy, product by product</figcaption>
        <div aria-hidden="true" className="grid gap-2">
          <div className="relative mx-2" style={{ height: `${rows * 1.125 + 2.5}rem` }}>
            {/* The tolerance band and the label claim. */}
            <div className="absolute inset-y-0 border-x border-line-strong bg-well" style={{ left: `${x(100 - tolerance)}%`, width: `${x(100 + tolerance) - x(100 - tolerance)}%` }} />
            <div className="absolute top-6 bottom-0 border-l border-line-strong" style={{ left: `${x(100)}%` }} />
            <span className="absolute top-1 -translate-x-1/2 t-caption whitespace-nowrap text-fg-muted" style={{ left: `${x(100)}%` }}>
              Label claim
            </span>
            {/* One dot per product, stacked upward from the axis where they would touch. */}
            {placed.map((p) => {
              const left = x(p.accuracy);
              const align = left < 20 ? "left-0" : left > 80 ? "right-0" : "left-1/2 -translate-x-1/2";
              return (
                <span key={`${p.brand} ${p.name}`} className="group absolute size-4 -translate-x-1/2 translate-y-1/2" style={{ left: `${left}%`, bottom: `${p.row * 1.125 + 0.5}rem` }}>
                  <span className={cn("absolute inset-0.5 rounded-full", p.purity ? "bg-fg" : "bg-paper ring-2 ring-fail ring-inset")} />
                  <span className={cn("absolute bottom-full z-10 mb-1 hidden rounded-ctl bg-fg px-2 py-1 t-caption whitespace-nowrap text-paper group-hover:block", align)}>
                    {p.brand} {p.name}: {pct(p.accuracy)}
                    {p.purity ? "" : ", failed a contaminant limit"}
                  </span>
                </span>
              );
            })}
          </div>
          <div className="relative mx-2 h-5 border-t border-line-strong">
            {ticks.map((t) => (
              <span key={t} className="absolute top-1 -translate-x-1/2 t-caption text-fg-muted" style={{ left: `${x(t)}%` }}>
                {t}%
              </span>
            ))}
          </div>
          <p className="m-0 mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 t-caption text-fg-muted">
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full bg-fg" />
              Passed every contaminant limit
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="size-3 rounded-full bg-paper ring-2 ring-fail ring-inset" />
              Failed one
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-5 border-x border-line-strong bg-well" />
              Within {tolerance}% of the label
            </span>
          </p>
        </div>
      </figure>

      <Disclosure>
        <DisclosureSummary className="min-h-11 gap-4 rounded-ctl t-ui text-fg">
          Every product’s result, as a table
          <DisclosureIcon />
        </DisclosureSummary>
        <table className="mt-2 w-full border-collapse text-left">
          <caption className="sr-only">Each {results.name} product’s label accuracy and contaminant result, most accurate first</caption>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className="py-2 pr-4 t-micro font-normal text-fg-muted">
                Product
              </th>
              <th scope="col" className="py-2 pr-4 text-right t-micro font-normal text-fg-muted">
                Label accuracy
              </th>
              <th scope="col" className="py-2 t-micro font-normal text-fg-muted">
                Contaminants
              </th>
            </tr>
          </thead>
          <tbody>
            {[...results.products]
              .sort((a, b) => Math.abs(a.accuracy - 100) - Math.abs(b.accuracy - 100))
              .map((p) => (
                <tr key={`${p.brand} ${p.name}`} className="border-b border-line">
                  <th scope="row" className="py-2 pr-4 text-left t-small font-normal text-fg">
                    {p.href ? (
                      <a href={p.href} className="kit-focus kit-link rounded-ctl">
                        {p.brand} {p.name}
                      </a>
                    ) : (
                      `${p.brand} ${p.name}`
                    )}
                  </th>
                  <td data-numeric className={cn("py-2 pr-4 text-right t-small", Math.abs(p.accuracy - 100) <= tolerance ? "text-fg" : "font-semibold text-fail")}>
                    {pct(p.accuracy)}
                  </td>
                  <td className="py-2">{p.purity ? <ResultMark status="pass">Pass</ResultMark> : <ResultMark status="fail">Fail</ResultMark>}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Disclosure>
    </section>
  );
}
