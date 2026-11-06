import { cn } from "@/lib/cn";
import type { Metric, NotRecommended } from "@/kit/types";
import { Eyebrow } from "@/kit/ui";

import { MatrixColgroup, MetricCell, MetricPills, matrixCell, matrixEnd, matrixHead, matrixRow } from "./comparison-matrix";

export interface DisqualifiedSubTableProps {
  /** Each product: its `name`, the `reason` in one line, and its `metrics` on the comparison’s keys. */
  items: NotRecommended[];
  /** The comparison’s columns, so values line up under the picks. */
  metrics: Metric[];
  /** The band’s label. Default “Tested and not recommended”. */
  heading?: string;
  /** Frame it as its own card instead of a band inside the comparison. */
  standalone?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Products we tested and would not buy, on the comparison’s own columns,
 * under a toned band inside the comparison card. Each says why in one line.
 * Nothing here links to a retailer.
 *
 * **Use it for** the honest end of a comparison: as the child of
 * `ComparisonMatrix`, or `standalone` on a page without one. **Not for**
 * picks (they belong in the matrix) or products that were not tested.
 *
 * @summary Products tested and not recommended, on the comparison’s columns, never linked.
 * @import import { DisqualifiedSubTable } from "@/kit/blocks";
 */
export function DisqualifiedSubTable({ items, metrics, heading = "Tested and not recommended", standalone = false, className }: DisqualifiedSubTableProps) {
  if (items.length === 0) return null;
  return (
    <div data-slot="disqualified" className={cn(standalone ? "@container kit-card overflow-hidden" : "border-t border-line-strong", className)}>
      <Eyebrow as="h3" id="disqualified-heading" className="bg-well px-4 py-3 @3xl:px-6">
        {heading}
      </Eyebrow>
      <table aria-labelledby="disqualified-heading" className="w-full border-collapse text-left @max-3xl:block @3xl:table-fixed">
        <MatrixColgroup metrics={metrics} />
        <thead className="sr-only">
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Best for</th>
            {metrics.map((m) => (
              <th key={m.key} scope="col">
                {m.label}
              </th>
            ))}
            <th scope="col">Best price</th>
          </tr>
        </thead>
        <tbody className="@max-3xl:block">
          {items.map((item) => (
            <tr key={item.name} className={matrixRow}>
              <th scope="row" className={matrixHead}>
                <span className="flex flex-col gap-1">
                  <span className="t-ui font-semibold text-fg">{item.name}</span>
                  <span className="t-small text-fg-muted">{item.reason}</span>
                </span>
                <MetricPills metrics={metrics} values={item.metrics} />
              </th>
              <td className={cn(matrixCell, "t-small text-fg-muted")}>Not recommended</td>
              {metrics.map((m) => (
                <td key={m.key} className={matrixCell}>
                  <MetricCell v={item.metrics[m.key]} />
                </td>
              ))}
              <td className={cn(matrixEnd, "t-small text-fg-muted")}>Not linked</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
