import { cn } from "@/lib/cn";
import type { Metric, NotRecommended } from "@/kit/types";

import { MatrixColgroup, MetricCell, matrixCell } from "./comparison-matrix";

/**
 * Products we tested and would not buy, on the comparison’s own columns
 * (the colgroup is shared, so values line up under the picks). The failing
 * result is marked; nothing here is linked to a retailer.
 */
export interface DisqualifiedSubTableProps {
  items: NotRecommended[];
  metrics: Metric[];
  heading?: string;
  className?: string;
}

export function DisqualifiedSubTable({ items, metrics, heading = "Tested and not recommended", className }: DisqualifiedSubTableProps) {
  if (items.length === 0) return null;
  return (
    <div data-slot="disqualified" className={cn("@container mt-12", className)}>
      <h3 id="disqualified-heading" className="m-0 t-ui font-medium text-fg">
        {heading}
      </h3>
      <table aria-labelledby="disqualified-heading" className="mt-3 w-full border-collapse text-left @max-3xl:block @3xl:table-fixed">
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
            <tr key={item.name} className="border-t border-line last:border-b @max-3xl:block @max-3xl:py-5">
              <th scope="row" className="py-4 pr-4 text-left font-normal @max-3xl:block @max-3xl:pt-0 @max-3xl:pb-3">
                <span className="flex flex-col gap-0.5">
                  <span className="t-ui text-fg">{item.name}</span>
                  <span className="t-small text-fg-muted">{item.reason}</span>
                </span>
              </th>
              {metrics.map((m) => (
                <td key={m.key} data-label={m.label} className={matrixCell}>
                  <MetricCell v={item.metrics[m.key]} />
                </td>
              ))}
              <td data-label="Lowest price" className={cn(matrixCell, "t-small text-fg-muted @3xl:pr-0 @3xl:text-right")}>
                Not linked
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
