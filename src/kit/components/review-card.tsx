import { typeset } from "@/kit/lib/typeset";
import type { Review } from "@/kit/types";
import { Avatar, HelpfulButton, ReadMore, RelativeTime, ReviewLabel, Sep, StarRating } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface ReviewCardProps {
  /** The review: rating, title, body, author, dates, labels, and the brand’s reply if any. */
  review: Review;
  /** The moment relative dates count from; pin it in stories and tests (default: now). */
  now?: string;
  /** Where the site explains its review labels, linked from each label. */
  labelsHref?: string;
  /** Where a reader reports a review (a form); shows “Report”. */
  reportHref?: string;
  /** Called when the reader marks the review useful, or unmarks it. */
  onMarkUseful?: (id: string, marked: boolean) => void;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * One review, as a reader weighs it: who wrote it (or which tester), when,
 * the stars and how the review reached the site, the title, the text (cut to
 * four lines with See more), when they used the product, how many found it
 * useful, and the brand’s reply under it. A hairline above, no box: reviews
 * read as a list. Its id is `review-{id}`, so a link can point at it.
 *
 * **Use it for** every review in a list, reader or tester. **Not for** a
 * pull quote from a tester in an editorial review (`PullQuote`), or the
 * site’s own verdict (`VerdictCard`).
 *
 * @summary One review: author, stars, labels, title, text, useful count, brand reply.
 * @import import { ReviewCard } from "@/kit/components";
 */
export function ReviewCard({ review, now, labelsHref, reportHref, onMarkUseful, className }: ReviewCardProps) {
  const { author } = review;
  const about = [author.role, author.country, author.reviewCount ? `${author.reviewCount} ${author.reviewCount === 1 ? "review" : "reviews"}` : undefined].filter(Boolean);
  return (
    <article
      id={`review-${review.id}`}
      aria-labelledby={`review-${review.id}-title`}
      tabIndex={-1}
      className={cn("kit-focus grid scroll-mt-8 gap-3 border-t border-line py-6", className)}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar person={author} size="sm" />
          <div className="grid min-w-0">
            <p className="m-0 truncate t-ui font-semibold text-fg">{author.name}</p>
            {about.length ? (
              <p className="m-0 t-caption text-fg-muted">
                {about.map((item, i) => (
                  <span key={item}>
                    {i > 0 ? <Sep /> : null}
                    {item}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
        <RelativeTime date={review.postedAt} now={now} className="shrink-0 pt-0.5" />
      </header>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <StarRating value={review.rating} size="sm" />
        {review.labels.map((label) => (
          <ReviewLabel key={label} label={label} href={labelsHref} />
        ))}
        {review.edited ? <span className="t-caption text-fg-muted">Edited</span> : null}
      </div>
      <h3 id={`review-${review.id}-title`} className="m-0 t-name-sm text-fg">
        {typeset(review.title)}
      </h3>
      <ReadMore text={typeset(review.body)} />
      {review.experiencedAt ? (
        <p className="m-0 t-caption text-fg-muted">
          Date of experience: <time dateTime={review.experiencedAt}>{formatDateLong(review.experiencedAt)}</time>
        </p>
      ) : null}
      {!review.labels.includes("tester") || reportHref ? (
        <footer className="flex flex-wrap items-center gap-4">
          {!review.labels.includes("tester") ? <HelpfulButton count={review.useful} onMark={onMarkUseful ? (marked) => onMarkUseful(review.id, marked) : undefined} /> : null}
          {reportHref ? (
            <a href={`${reportHref}?review=${review.id}`} className="kit-focus kit-link rounded-ctl t-small text-fg-muted">
              Report
            </a>
          ) : null}
        </footer>
      ) : null}
      {review.reply ? (
        <div className="mt-1 ml-1 grid gap-1 border-l-2 border-line-strong py-1 pl-4">
          <p className="m-0 flex flex-wrap items-center gap-x-2 t-small font-semibold text-fg">
            Reply from {review.reply.author}
            <RelativeTime date={review.reply.postedAt} now={now} className="font-normal" />
          </p>
          <p className="m-0 t-small text-fg-body">{typeset(review.reply.body)}</p>
        </div>
      ) : null}
    </article>
  );
}
