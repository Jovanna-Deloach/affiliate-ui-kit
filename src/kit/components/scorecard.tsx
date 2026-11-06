import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { Rating } from "@/kit/types";
import { Eyebrow, Meter } from "@/kit/ui";
import type { SubScoreItem } from "@/types/affiliate";

/**
 * The composite score and its evidence, as one unboxed block: a hairline
 * above (dropped where a photograph sits directly over it), “Overall score”
 * in micro-caps, the score in the display serif (2.5rem) over “/ 10”, the
 * tier and an honest standing (“1st of 14 tested”, never an invented
 * percentile), a 10-segment meter, the sub-scores on 6px meters, then the
 * category’s telemetry (children).
 */
export interface ScorecardProps {
  rating: Rating;
  /** Sub-scores, out of `maxScore` (10 when absent). Five is the norm. */
  scores: SubScoreItem[];
  /** Used for the block’s own id and its label; must be unique on the page. */
  id: string;
  /** Telemetry for the category (`<Telemetry />`), set under the sub-scores. */
  children?: ReactNode;
  className?: string;
}

export function Scorecard({ rating, scores, id, children, className }: ScorecardProps) {
  return (
    <section data-slot="scorecard" id={id} aria-labelledby={`${id}-label`} className={cn("scroll-mt-8 border-t border-line-strong pt-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow id={`${id}-label`}>Overall score</Eyebrow>
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
      <Meter value={rating.score} max={10} segments={10} className="mt-4" />
      <dl className="m-0 mt-5 grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_2.5rem] items-center gap-x-4 gap-y-2.5">
        {scores.map((item) => (
          <div key={item.label} className="contents">
            <dt className="t-small text-fg-muted">{item.label}</dt>
            <dd className="m-0">
              <Meter value={item.score} max={item.maxScore ?? 10} />
            </dd>
            <dd data-numeric className="m-0 text-right t-small t-figure text-fg">
              {item.score.toFixed(1)}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </section>
  );
}
