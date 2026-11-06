import type { ReactNode } from "react";

import type { Rating } from "@/kit/types";
import type { SubScoreItem } from "@/types/affiliate";

import { cn } from "@/lib/cn";

/**
 * The composite score and its telemetry, as one block in the review’s left
 * rail. No frame of its own: a hairline above, the score in the display serif
 * (2.5rem) with “/ 10”, the tier and an honest standing, a 10-segment meter
 * whose part-filled segment is clipped (never shrunk to a dot), the
 * sub-scores on 6px tracks, then the category’s telemetry (children).
 */
export function Scorecard({ rating, scores, id, children, className }: { rating: Rating; scores: SubScoreItem[]; id: string; children?: ReactNode; className?: string }) {
  const filled = Math.max(0, Math.min(10, rating.score));
  return (
    <section data-slot="scorecard" id={id} aria-labelledby={`${id}-label`} className={cn("scroll-mt-8 border-t border-line-strong pt-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p id={`${id}-label`} className="m-0 t-micro text-fg-muted">
            Overall score
          </p>
          <p className="m-0 mt-2 flex items-baseline gap-1.5">
            <span data-numeric className="t-score text-fg">
              {rating.score.toFixed(1)}
            </span>
            <span className="t-name lining-nums text-fg-muted">/ 10</span>
          </p>
        </div>
        <div className="pt-0.5 text-right">
          <p className="m-0 t-ui font-semibold text-fg">{rating.tier}</p>
          <p data-numeric className="m-0 mt-0.5 t-small text-fg-muted">
            {rating.standing}
          </p>
        </div>
      </div>
      <div aria-hidden="true" className="mt-4 grid grid-cols-10 gap-1">
        {Array.from({ length: 10 }, (_, i) => {
          const share = Math.max(0, Math.min(1, filled - i));
          return (
            <span key={i} className="relative h-1.5 overflow-hidden rounded-full bg-line">
              <span className="absolute inset-y-0 left-0 bg-meter" style={{ width: `${share * 100}%` }} />
            </span>
          );
        })}
      </div>
      <dl className="m-0 mt-5 grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_2.5rem] items-center gap-x-4 gap-y-2.5">
        {scores.map((item) => {
          const pct = Math.max(0, Math.min(100, (item.score / (item.maxScore ?? 10)) * 100));
          return (
            <div key={item.label} className="contents">
              <dt className="t-small text-fg-muted">{item.label}</dt>
              <dd aria-hidden="true" className="m-0 h-1.5 overflow-hidden rounded-full bg-well">
                <span className="block h-full rounded-full bg-meter" style={{ width: `${pct}%` }} />
              </dd>
              <dd data-numeric className="m-0 text-right t-small t-figure text-fg">
                {item.score.toFixed(1)}
              </dd>
            </div>
          );
        })}
      </dl>
      {children}
    </section>
  );
}
