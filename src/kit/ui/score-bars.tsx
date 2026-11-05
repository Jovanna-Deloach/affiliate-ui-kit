import type { SubScoreItem } from "@/types/affiliate";

import { cn } from "@/lib/cn";

/** Sub-scores as thin bars on one keyline: label, bar, value. The bar takes the category colour. */
export function ScoreBars({ items, max = 10, className }: { items: SubScoreItem[]; max?: number; className?: string }) {
  return (
    <dl className={cn("m-0 grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_2.5rem] items-center gap-x-4 gap-y-3", className)}>
      {items.map((item) => {
        const pct = Math.max(0, Math.min(100, (item.score / (item.maxScore ?? max)) * 100));
        return (
          <div key={item.label} className="contents">
            <dt className="t-small text-fg-muted">{item.label}</dt>
            <dd className="m-0 h-1 overflow-hidden rounded-full bg-line" aria-hidden="true">
              <span className="block h-full rounded-full bg-meter" style={{ width: `${pct}%` }} />
            </dd>
            <dd data-numeric className="m-0 text-right t-small t-figure text-fg">
              {item.score.toFixed(1)}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
