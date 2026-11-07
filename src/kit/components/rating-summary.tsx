import type { ReactNode } from "react";

import { ratingWord } from "@/kit/lib/reviews";
import type { RatingSummary as RatingSummaryData } from "@/kit/types";
import { RatingBar, Sep, StarRating } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface RatingSummaryProps {
  /** The numbers: average, count, the last 12 months and the spread. */
  summary: RatingSummaryData;
  /** Ratings the list is filtered to; their rows are marked. */
  selected?: number[];
  /** Filter in the page: called with the rating whose row the reader picks. */
  onSelectStars?: (stars: number) => void;
  /** Filter by link: the address of the reviews with a rating. */
  starHref?: (stars: number) => string;
  /** Where the site explains how its average is worked out. */
  scoreHref?: string;
  /** The way to add a review, under the spread: an outlined `Button` (the filled action stays the buy button) or a `Dialog` holding `WriteReview`. */
  action?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A product’s reviews in numbers: the average large, its word (Great), the
 * stars, how many reviews and how many from the last 12 months, then the
 * spread from 5 stars to 1, every row shown even when it is empty. Each row
 * can filter the reviews.
 *
 * **Use it for** the top of a review section, or beside a product’s score on
 * its page. **Not for** the site’s own score (`Scorecard`) or a single
 * review (`ReviewCard`).
 *
 * @summary The average, its word, the count and the 5-to-1 spread; rows filter.
 * @import import { RatingSummary } from "@/kit/components";
 */
export function RatingSummary({ summary, selected = [], onSelectStars, starHref, scoreHref, action, className }: RatingSummaryProps) {
  const { average, count, recentCount, distribution } = summary;
  return (
    <div className={cn("grid content-start gap-5", className)}>
      <div className="flex items-center gap-4">
        <p data-numeric className="m-0 t-figure-xl text-fg">
          {average.toFixed(1)}
        </p>
        <div className="grid gap-1">
          <StarRating value={average} />
          <p className="m-0 t-small text-fg-muted">
            <span className="font-semibold text-fg">{ratingWord(average)}</span>
            <Sep />
            <span data-numeric>{count.toLocaleString("en-US")}</span> {count === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>
      <div className="grid gap-0.5">
        {([5, 4, 3, 2, 1] as const).map((stars) => (
          <RatingBar
            key={stars}
            stars={stars}
            count={distribution[stars - 1] ?? 0}
            total={count}
            selected={selected.includes(stars)}
            onClick={onSelectStars ? () => onSelectStars(stars) : undefined}
            href={onSelectStars ? undefined : starHref?.(stars)}
            className="-mx-2 w-[calc(100%+1rem)]"
          />
        ))}
      </div>
      {recentCount !== undefined || scoreHref ? (
        <p className="m-0 t-caption text-fg-muted">
          {recentCount !== undefined ? (
            <>
              <span data-numeric>{recentCount.toLocaleString("en-US")}</span> in the last 12{"\u00a0"}months.
            </>
          ) : null}
          {scoreHref ? (
            <>
              {" "}
              <a href={scoreHref} className="kit-focus kit-link rounded-ctl">
                How the average is worked out
              </a>
            </>
          ) : null}
        </p>
      ) : null}
      {action ? <div>{action}</div> : null}
    </div>
  );
}
