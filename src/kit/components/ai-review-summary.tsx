import { Sparkles } from "lucide-react";

import { typeset } from "@/kit/lib/typeset";
import type { AiSummary, Review } from "@/kit/types";
import { Sep, StarRating } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDate, formatDateLong } from "@/lib/format";

export interface AiReviewSummaryProps {
  /** The summary, how many reviews it read, since when, and the reviews it draws on. */
  summary: AiSummary;
  /** The reviews on the page, to show the ones it draws on. */
  reviews: Review[];
  /** The heading (default “What reviewers say”). */
  heading?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A generated summary of the reviews that says what it is: labeled as
 * written by AI, with how many reviews it read and since when, then two or
 * three of those reviews (stars, author, date), linked, so a reader can check
 * it against them. In a `ReviewsSection`, the links always reach the review.
 *
 * **Use it for** a product with enough reviews to summarize (ten or more),
 * written from the reviews the page shows. **Not for** the site’s own
 * verdict (`VerdictCard`), a summary written by a person, or a summary with
 * no label.
 *
 * @summary A generated summary of the reviews, labeled as AI, with what it read.
 * @import import { AiReviewSummary } from "@/kit/components";
 */
export function AiReviewSummary({ summary, reviews, heading = "What reviewers say", className }: AiReviewSummaryProps) {
  const sources = summary.sources.map((id) => reviews.find((review) => review.id === id)).filter((review): review is Review => Boolean(review));
  return (
    <section aria-label={heading} className={cn("grid gap-4 rounded-box border border-line bg-paper p-5", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 t-micro text-fg-muted">{heading}</p>
        <p className="m-0 inline-flex items-center gap-1.5 t-caption text-fg-muted">
          <Sparkles aria-hidden="true" size={14} strokeWidth={1.75} />
          Written by AI from {summary.basedOn.toLocaleString("en-US")} reviews since {formatDateLong(summary.since)}
        </p>
      </div>
      <p className="m-0 t-body text-fg-body">{typeset(summary.body)}</p>
      {sources.length ? (
        <div className="grid gap-2 border-t border-line pt-4">
          <p className="m-0 t-caption text-fg-muted">Reviews it draws on</p>
          <ul className="m-0 grid list-none gap-2 p-0">
            {sources.map((review) => (
              <li key={review.id}>
                <a href={`#review-${review.id}`} className="kit-focus inline-flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 rounded-ctl t-small text-fg no-underline hover:underline">
                  <StarRating value={review.rating} size="sm" />
                  <span>
                    {review.author.name}
                    <Sep />
                    <time dateTime={review.postedAt}>{formatDate(review.postedAt)}</time>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
