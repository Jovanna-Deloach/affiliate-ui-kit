import { cn } from "@/lib/cn";
import type { Metric, NotRecommended } from "@/kit/types";

import { MatrixColgroup, MetricCell, MetricPills, matrixCell, matrixEnd, matrixHead, matrixRow } from "./comparison-matrix";

/**
 * Products we tested and would not buy, on the comparison’s own columns
 * (the colgroup is shared, so values line up under the picks), under a
 * toned subheader inside the comparison card. Nothing here is linked to a
 * retailer. `standalone` frames it as its own card.
 */
export interface DisqualifiedSubTableProps {
  items: NotRecommended[];
  metrics: Metric[];
  heading?: string;
  standalone?: boolean;
  className?: string;
}

export function DisqualifiedSubTable({ items, metrics, heading = "Tested and not recommended", standalone = false, className }: DisqualifiedSubTableProps) {
  if (items.length === 0) return null;
  return (
    <div data-slot="disqualified" className={cn(standalone ? "@container kit-card overflow-hidden" : "border-t border-line", className)}>
      <h3 id="disqualified-heading" className="m-0 bg-well px-4 py-3 t-caption font-medium text-fg-muted @3xl:px-6">
        {heading}
      </h3>
      <table aria-labelledby="disqualified-heading" className="w-full border-collapse text-left @max-3xl:block @3xl:table-fixed">
        <MatrixColgroup metrics={metrics} />
        <thead className="sr-only">
          <tr>
            <th scope="col">Product</th>
            {metrics.map((m) => (
              <th key={m.key} scope="col">
                {m.label}
              </th>
            ))}
            <th scope="col">Lowest price</th>
          </tr>
        </thead>
        <tbody className="@max-3xl:block">
          {items.map((item) => (
            <tr key={item.name} className={matrixRow}>
              <th scope="row" className={cn(matrixHead, "border-l-[3px] border-l-transparent @max-3xl:border-l-0")}>
                <span className="flex flex-col gap-0.5">
                  <span className="t-ui text-fg">{item.name}</span>
                  <span className="t-small text-fg-muted">{item.reason}</span>
                </span>
                <MetricPills metrics={metrics} values={item.metrics} />
              </th>
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
