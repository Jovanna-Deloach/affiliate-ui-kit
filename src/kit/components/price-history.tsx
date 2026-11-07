import type { PricePoint } from "@/kit/types";
import { Disclosure, DisclosureIcon, DisclosureSummary } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDateShort, formatPrice } from "@/lib/format";

interface Run {
  from: number;
  to: number;
  price: number | null;
  merchant?: string;
}

/** Consecutive days at the same price (or sold out) become one run. */
function runsOf(points: readonly PricePoint[]): Run[] {
  const runs: Run[] = [];
  points.forEach((point, i) => {
    const last = runs.at(-1);
    if (last && last.price === point.price && last.merchant === point.merchant) last.to = i;
    else runs.push({ from: i, to: i, price: point.price, merchant: point.merchant });
  });
  return runs;
}

const span = (points: readonly PricePoint[], run: Run) => {
  const from = formatDateShort(points[run.from]!.date);
  const to = formatDateShort(points[run.to]!.date);
  return from === to ? from : `${from} to ${to}`;
};

export interface PriceHistoryProps {
  /** The lowest in-stock price on each day, oldest first, about 90 of them; `null` on a day it was sold out everywhere. */
  points: PricePoint[];
  /** ISO 4217 code (default `USD`). */
  currency?: string;
  /** The heading (default “Price over the last 90 days”). Tie a number to its unit with a no-break space. */
  heading?: string;
  /** The heading’s level: `h2` on a page, `h3` inside a section (default). */
  as?: "h2" | "h3";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A product’s lowest price day by day, as a step line: where it is now
 * against the low and the high of the period, in a sentence and three
 * figures, then the line with the low and the high marked and labeled, and
 * days it was sold out shown as hatched gaps, named in a key. Hover a
 * stretch of the line for its dates, price and retailer; every price change
 * is also in a table under the chart, for keyboards and screen readers.
 * Drawn on the server: no script.
 *
 * **Use it for** a product’s page, beside the buy box or under it, so a
 * reader can tell whether today’s price is a good one. **Not for** prices at
 * several retailers today (`BuyBlock`), or a score over time.
 *
 * @summary 90 days of the lowest price: now against the low and high, and a table.
 * @import import { PriceHistory } from "@/kit/components";
 */
export function PriceHistory({ points, currency = "USD", heading = "Price over the last 90\u00a0days", as: Heading = "h3", className }: PriceHistoryProps) {
  const runs = runsOf(points);
  const priced = runs.filter((run): run is Run & { price: number } => run.price !== null);
  if (!priced.length || points.length < 2) return null;

  const low = priced.reduce((a, b) => (b.price < a.price ? b : a));
  const high = priced.reduce((a, b) => (b.price > a.price ? b : a));
  const last = runs.at(-1)!;
  const now = last.price;
  const money = (amount: number) => formatPrice(amount, currency);
  const verdict =
    now === null
      ? `Sold out everywhere we check. It last sold for ${money(priced.at(-1)!.price)}.`
      : now <= low.price
        ? `${money(now)} now: the lowest price in this period.`
        : `${money(now)} now, ${money(now - low.price)} above the low of ${money(low.price)} on ${formatDateShort(points[low.from]!.date)}.`;

  // Geometry, in percent of the plot: x by day, y by price with 12% of air above the high and below the low.
  const n = points.length;
  const x = (i: number) => (i / (n - 1)) * 100;
  const spread = high.price - low.price || 1;
  const y = (price: number) => 12 + ((high.price - price) / spread) * 76;
  const end = (run: Run) => x(Math.min(run.to + 1, n - 1));

  let d = "";
  let previous: Run | undefined;
  for (const run of runs) {
    if (run.price === null) {
      previous = undefined;
      continue;
    }
    d += previous ? ` V ${y(run.price)} H ${end(run)}` : ` M ${x(run.from)} ${y(run.price)} H ${end(run)}`;
    previous = run;
  }
  const gaps = runs.filter((run) => run.price === null);
  const months = points.map((point, i) => ({ i, date: point.date })).filter(({ date, i }) => i > 0 && date.slice(8, 10) === "01");

  return (
    <section aria-label={heading} className={cn("grid gap-4", className)}>
      <div className="grid gap-1">
        <Heading className="m-0 t-name-sm text-fg">{heading}</Heading>
        <p className="m-0 t-small text-fg-body">{verdict}</p>
      </div>
      <dl className="m-0 grid grid-cols-3 gap-4 border-y border-line py-3">
        <div className="grid gap-0.5">
          <dt className="t-micro text-fg-muted">Now</dt>
          <dd data-numeric className="m-0 t-ui font-semibold text-fg">
            {now === null ? "Sold out" : money(now)}
          </dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="t-micro text-fg-muted">Low</dt>
          <dd data-numeric className="m-0 t-ui font-semibold text-fg">
            {money(low.price)}
          </dd>
        </div>
        <div className="grid gap-0.5">
          <dt className="t-micro text-fg-muted">High</dt>
          <dd data-numeric className="m-0 t-ui font-semibold text-fg">
            {money(high.price)}
          </dd>
        </div>
      </dl>

      <div aria-hidden="true" className="grid gap-2">
        <div className="relative h-36">
          {/* Hairlines at the high and the low, across the plot. */}
          <div className="absolute inset-x-0 border-t border-line" style={{ top: `${y(high.price)}%` }} />
          <div className="absolute inset-x-0 border-t border-line" style={{ top: `${y(low.price)}%` }} />
          {/* The data, inset so a dot on either end stays inside the plot. */}
          <div className="absolute inset-y-0 inset-x-2">
            {/* Sold-out stretches, hatched between the hairlines (the labels live outside them); the key under the months names them. */}
            {gaps.map((run) => (
              <div
                key={`gap-${run.from}`}
                className="kit-hatch pointer-events-none absolute"
                style={{ left: `${x(run.from)}%`, width: `${end(run) - x(run.from)}%`, top: `${y(high.price)}%`, bottom: `${100 - y(low.price)}%` }}
              />
            ))}
            {/* Hover a stretch for its dates, price and retailer: a mouse aid only; the table below has every value. */}
            {runs.map((run) => {
              const left = x(run.from);
              const align = left < 15 ? "left-0" : end(run) > 85 ? "right-0" : "left-1/2 -translate-x-1/2";
              return (
                <span key={`hit-${run.from}`} className="group absolute inset-y-0 hover:bg-well" style={{ left: `${left}%`, width: `${Math.max(end(run) - left, 1)}%` }}>
                  <span className={cn("absolute bottom-full mb-1 hidden rounded-ctl bg-fg px-2 py-1 t-caption whitespace-nowrap text-paper group-hover:block", align)}>
                    {span(points, run)}: {run.price === null ? "sold out" : `${money(run.price)} at ${run.merchant ?? "the lowest retailer"}`}
                  </span>
                </span>
              );
            })}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full overflow-visible text-fg">
              <path d={d.trim()} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </svg>
            {/* The low, the high and today, marked; the low and high labeled. */}
            <span className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pass ring-2 ring-paper" style={{ left: `${x(low.from)}%`, top: `${y(low.price)}%` }} />
            <span
              className={cn("pointer-events-none absolute pt-2 t-caption whitespace-nowrap text-fg", x(low.from) > 80 ? "-translate-x-full" : x(low.from) > 20 && "-translate-x-1/2")}
              style={{ left: `${x(low.from)}%`, top: `${y(low.price)}%` }}
            >
              Low {money(low.price)}
            </span>
            <span className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg-muted ring-2 ring-paper" style={{ left: `${x(high.from)}%`, top: `${y(high.price)}%` }} />
            <span
              className={cn("pointer-events-none absolute -translate-y-full pb-2 t-caption whitespace-nowrap text-fg", x(high.from) > 80 ? "-translate-x-full" : x(high.from) > 20 && "-translate-x-1/2")}
              style={{ left: `${x(high.from)}%`, top: `${y(high.price)}%` }}
            >
              High {money(high.price)}
            </span>
            {now !== null ? (
              <span className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg ring-2 ring-paper" style={{ left: "100%", top: `${y(now)}%` }} />
            ) : null}
          </div>
        </div>
        <div className="relative mx-2 h-5">
          {months.map(({ i, date }) => (
            <span key={date} className="absolute -translate-x-1/2 t-caption text-fg-muted" style={{ left: `${x(i)}%` }}>
              {new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(date))}
            </span>
          ))}
        </div>
        {gaps.length ? (
          <p className="m-0 flex items-center gap-2 t-caption text-fg-muted">
            <span className="kit-hatch h-3 w-5 border border-line-strong" />
            Sold out everywhere
          </p>
        ) : null}
      </div>

      <Disclosure>
        <DisclosureSummary className="t-small text-fg">
          Every price change, as a table
          <DisclosureIcon />
        </DisclosureSummary>
        <table className="mt-2 w-full border-collapse text-left t-small">
          <caption className="sr-only">{heading}: every price change, newest first</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 pr-4 t-micro font-normal text-fg-muted">
                Dates
              </th>
              <th scope="col" className="py-2 pr-4 t-micro font-normal text-fg-muted">
                Lowest price
              </th>
              <th scope="col" className="py-2 t-micro font-normal text-fg-muted">
                At
              </th>
            </tr>
          </thead>
          <tbody>
            {[...runs].reverse().map((run) => (
              <tr key={run.from} className="border-b border-line last:border-0">
                <td data-numeric className="py-2 pr-4 text-fg">
                  {span(points, run)}
                </td>
                <td data-numeric className="py-2 pr-4 text-fg">
                  {run.price === null ? "Sold out" : money(run.price)}
                </td>
                <td className="py-2 text-fg-muted">{run.merchant ?? "Nowhere"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Disclosure>
    </section>
  );
}
