import { formatAmount, formatDifference, overLimit, percentOff, withinTolerance } from "@/kit/lib/evidence";
import type { LabReport } from "@/kit/types";
import { Meter, ResultMark } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface AssayTableProps {
  /** The lab report: every ingredient’s claim and what was found, and every contaminant against its limit, per serving. */
  report: LabReport;
  /** The heading (default “What the lab found”). */
  heading?: string;
  /** The heading’s level: `h2` (default), or `h3` inside a section, set a size smaller. */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `assay`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

const head = "py-2 t-micro font-normal text-fg-muted";

/**
 * Every measured value in a lab report, in two tables. Against the label:
 * each ingredient’s claim, what the lab found and the difference, a miss
 * beyond the tolerance marked in red with words. Contaminants: what was
 * found (“Below LOQ” when too little to measure) against the limit and whose
 * limit it is, with the share of the limit as a bar. In a narrow column the
 * claim and the limit move under the name.
 *
 * **Use it for** the full results on a product’s lab report, after
 * `KeyFindings`. **Not for** the compact readout in a review’s scorecard
 * (`Telemetry`), a pass or fail alone (`ResultMark`), or products side by
 * side (`ComparisonMatrix`).
 *
 * @summary Every ingredient against its claim, every contaminant against its limit.
 * @import import { AssayTable } from "@/kit/components";
 */
export function AssayTable({ report, heading = "What the lab found", as: Heading = "h2", id = "assay", className }: AssayTableProps) {
  const tolerance = report.tolerance ?? 10;
  const belowLoq = report.contaminants.some((c) => c.found === null);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid scroll-mt-8 gap-8", className)}>
      <div className="grid gap-2">
        <Heading id={`${id}-heading`} className={cn("m-0 text-fg", Heading === "h2" ? "t-headline" : "t-title")}>
          {heading}
        </Heading>
        <p className="m-0 t-small text-fg-muted">
          Batch {report.batch}, tested <time dateTime={report.testedAt}>{formatDateLong(report.testedAt)}</time> by {report.lab}. Every figure is per serving: {report.serving}.
        </p>
      </div>

      <div className="grid gap-3">
        <h3 className="m-0 t-ui font-semibold text-fg">Against the label</h3>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">What the label claims and what the lab found, per serving</caption>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className={cn(head, "pr-4")}>
                Ingredient
              </th>
              <th scope="col" className={cn(head, "hidden pr-4 text-right @xl:table-cell")}>
                Claimed
              </th>
              <th scope="col" className={cn(head, "pr-4 text-right")}>
                Found
              </th>
              <th scope="col" className={cn(head, "text-right")}>
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {report.ingredients.map((ingredient) => {
              const diff = percentOff(ingredient.found, ingredient.claimed);
              const ok = withinTolerance(ingredient, tolerance);
              return (
                <tr key={ingredient.name} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4 text-left font-normal">
                    <span className="block t-small text-fg">{ingredient.name}</span>
                    <span data-numeric className="block t-caption text-fg-muted @xl:hidden">
                      Claims {formatAmount(ingredient.claimed, ingredient.unit)}
                    </span>
                  </th>
                  <td data-numeric className="hidden py-3 pr-4 text-right t-small text-fg-body @xl:table-cell">
                    {formatAmount(ingredient.claimed, ingredient.unit)}
                  </td>
                  <td data-numeric className="py-3 pr-4 text-right t-small text-fg">
                    {formatAmount(ingredient.found, ingredient.unit)}
                  </td>
                  <td className="py-3 text-right">
                    <span data-numeric className={cn("block t-small", ok ? "text-fg-body" : "font-semibold text-fail")}>
                      {formatDifference(diff)}
                    </span>
                    {ok ? null : <span className="block t-caption text-fail">{diff < 0 ? "Under" : "Over"} the label</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="m-0 t-caption text-fg-muted">Within {tolerance}% of the claim counts as accurate.</p>
      </div>

      <div className="grid gap-3">
        <h3 className="m-0 t-ui font-semibold text-fg">Contaminants</h3>
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Each contaminant the lab tested for, against its limit, per serving</caption>
          <thead>
            <tr className="border-b border-line-strong">
              <th scope="col" className={cn(head, "pr-4")}>
                Contaminant
              </th>
              <th scope="col" className={cn(head, "pr-4 text-right")}>
                Found
              </th>
              <th scope="col" className={cn(head, "hidden pr-4 text-right @xl:table-cell")}>
                Limit
              </th>
              <th scope="col" className={cn(head, "hidden w-44 @xl:table-cell")}>
                Share of the limit
              </th>
            </tr>
          </thead>
          <tbody>
            {report.contaminants.map((contaminant) => {
              const over = overLimit(contaminant);
              const share = contaminant.found === null ? 0 : contaminant.found / contaminant.limit;
              const limit = `${formatAmount(contaminant.limit, contaminant.unit)}${contaminant.standard ? ` (${contaminant.standard})` : ""}`;
              return (
                <tr key={contaminant.name} className="border-b border-line align-top">
                  <th scope="row" className="py-3 pr-4 text-left font-normal">
                    <span className="block t-small text-fg">{contaminant.name}</span>
                    <span data-numeric className="block t-caption text-fg-muted @xl:hidden">
                      Limit {limit}
                    </span>
                  </th>
                  <td className="py-3 pr-4 text-right t-small">
                    {contaminant.found === null ? (
                      <span className="text-fg-body">Below LOQ</span>
                    ) : (
                      <span data-numeric className={over ? "font-semibold text-fail" : "text-fg"}>
                        {formatAmount(contaminant.found, contaminant.unit)}
                      </span>
                    )}
                    {over ? (
                      <span className="mt-1 flex justify-end">
                        <ResultMark status="fail">Over the limit</ResultMark>
                      </span>
                    ) : null}
                  </td>
                  <td data-numeric className="hidden py-3 pr-4 text-right t-small text-fg-body @xl:table-cell">
                    {limit}
                  </td>
                  <td className="hidden py-3 @xl:table-cell">
                    <span className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-3">
                      <Meter value={share} tone={over ? "fail" : "meter"} />
                      <span data-numeric className="text-right t-small text-fg-body">
                        {contaminant.found === null ? "0%" : `${Math.round(share * 100)}%`}
                      </span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {belowLoq ? <p className="m-0 t-caption text-fg-muted">Below LOQ: less than the lab can measure reliably, its limit of quantification.</p> : null}
      </div>
    </section>
  );
}
