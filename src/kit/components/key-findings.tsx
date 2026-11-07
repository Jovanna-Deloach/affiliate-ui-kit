import { Fragment, type ReactNode } from "react";

import { overLimit, passesPurity, withinTolerance } from "@/kit/lib/evidence";
import type { LabReport } from "@/kit/types";
import { ResultMark, Sep } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { upperFirst } from "@/kit/lib/text";
import { formatDateLong, formatPrice } from "@/lib/format";

export interface KeyFindingsProps {
  /** The lab report: its finding, tests run, batch, lab, serving, price per serving, ingredients, contaminants and watchlist. */
  report: LabReport;
  /** The heading (default “Key findings”). */
  heading?: string;
  /** Where the watchlist is on the page, for the count to link to (default `#watchlist`). */
  watchlistHref?: string;
  /** The heading’s level: `h2` (default), or `h3` inside a section. */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `key-findings`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/** A short mark (“Pass”, “2 found”) and the detail beside it, wrapping under it in a narrow column. */
function Check({ status, mark, children }: { status: "pass" | "fail" | "caution"; mark: string; children?: ReactNode }) {
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <ResultMark status={status}>{mark}</ResultMark>
      {children ? <span>{children}</span> : null}
    </span>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="-mt-px grid gap-1 border-y border-line py-3 @md:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] @md:items-baseline @md:gap-4">
      <dt className="t-small text-fg-muted">{label}</dt>
      <dd className="m-0 t-small text-fg">{children}</dd>
    </div>
  );
}

/**
 * A lab report at a glance: the result in one sentence, then the numbers a
 * reader checks first: tests run, the batch and when it was tested, the
 * serving, what a serving costs, whether every ingredient matched its label,
 * whether every contaminant stayed under its limit, and how many watchlist
 * ingredients it has. Rows sit between hairlines, as in `SpecSheet`; a
 * failure is a mark with an icon, never color alone.
 *
 * **Use it for** the top of a product’s lab report, under its grade.
 * **Not for** every measured value (`AssayTable`), what the watchlist
 * ingredients are (`WatchlistIngredients`), or specifications (`SpecSheet`).
 *
 * @summary A lab report at a glance: the finding, tests, serving, accuracy, purity.
 * @import import { KeyFindings } from "@/kit/components";
 */
export function KeyFindings({ report, heading = "Key findings", watchlistHref = "#watchlist", as: Heading = "h2", id = "key-findings", className }: KeyFindingsProps) {
  const tolerance = report.tolerance ?? 10;
  const off = report.ingredients.filter((i) => !withinTolerance(i, tolerance)).length;
  const pure = passesPurity(report);
  const over = report.contaminants.filter(overLimit).map((c) => c.name.toLowerCase());
  const watch = report.watchlist.length;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container kit-card grid scroll-mt-8 gap-4 p-5 sm:p-6", className)}>
      <div className="grid gap-2">
        <Heading id={`${id}-heading`} className="m-0 t-micro text-fg-muted">
          {heading}
        </Heading>
        <p className="m-0 max-w-measure t-title text-fg">{report.finding}</p>
      </div>
      <dl className="m-0 grid @2xl:grid-cols-2 @2xl:gap-x-12">
        <Row label="Tests run">
          <span data-numeric>{report.tests}</span>
        </Row>
        <Row label="Batch">
          {report.batch}, tested <time dateTime={report.testedAt}>{formatDateLong(report.testedAt)}</time>
        </Row>
        <Row label="Serving">{report.serving}</Row>
        {report.perServing ? (
          <Row label="Price per serving">
            <span data-numeric>{formatPrice(report.perServing.amount, report.perServing.currency)}</span>
          </Row>
        ) : null}
        <Row label="Label accuracy">
          <Check status={off ? "fail" : "pass"} mark={off ? "Fail" : "Pass"}>
            {off
              ? `${off} of ${report.ingredients.length} off by more than ${tolerance}%`
              : report.ingredients.length === 1
                ? `Within ${tolerance}% of the label`
                : `All ${report.ingredients.length} within ${tolerance}% of the label`}
          </Check>
        </Row>
        <Row label="Purity">
          <Check status={pure ? "pass" : "fail"} mark={pure ? "Pass" : "Fail"}>
            {pure ? "Every contaminant under its limit" : `${upperFirst(over.join(", "))} over the limit`}
          </Check>
        </Row>
        <Row label="Watchlist ingredients">
          {watch ? (
            <Check status="caution" mark={`${watch} found`}>
              <a href={watchlistHref} className="kit-focus kit-link rounded-ctl">
                {report.watchlist.map((w, i) => (
                  <Fragment key={w.name}>
                    {i ? <Sep /> : null}
                    {w.name}
                  </Fragment>
                ))}
              </a>
            </Check>
          ) : (
            <Check status="pass" mark="None" />
          )}
        </Row>
        <Row label="Lab">{report.lab}</Row>
      </dl>
    </section>
  );
}
