import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { Rating } from "@/kit/types";
import { Eyebrow, Meter } from "@/kit/ui";
import type { SubScoreItem } from "@/types/affiliate";

export interface ScorecardProps {
  /** The composite: `score` out of 10, its `tier` (“Exceptional”) and an honest `standing` (“1st of 14 tested”). */
  rating: Rating;
  /** Sub-scores, out of `maxScore` (10 when absent). Five is the norm. */
  scores: SubScoreItem[];
  /** The block’s id and the base of its label’s id; must be unique on the page. */
  id: string;
  /** The category’s measurements, set under the sub-scores: `<Telemetry measurements={pick.measurements} />`. */
  children?: ReactNode;
  /** Pass `border-t-0 pt-0` where a photograph sits directly above it. */
  className?: string;
}

/**
 * The composite score and its evidence as one unboxed block: “Overall
 * score” in micro-caps, the score in the display serif over “/ 10”, the tier
 * and an honest standing (never an invented percentile), a 10-segment
 * meter, the sub-scores on 6px meters, then the category’s telemetry.
 *
 * **Use it for** the verdict in numbers, beside or under the product’s
 * photograph. **Not for** a score in a table (print the figure) or a rating
 * from readers. One per product per page.
 *
 * @summary The composite score out of 10 with its sub-scores and the category’s telemetry.
 * @import import { Scorecard } from "@/kit/components";
 */
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
