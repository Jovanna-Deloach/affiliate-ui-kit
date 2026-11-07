import type { ExpertReview } from "@/kit/types";
import { Avatar } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface ReviewedByProps {
  /** The reviewer, their credentials as they sign them, and when they last checked the page. */
  review: ExpertReview;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The expert who checked a page’s facts, set like the author’s byline:
 * portrait or initials, “Reviewed by” and their name (linked to their
 * profile), their credentials, and the date they checked it. The article
 * header shows it under the author when the guide has `reviewedBy`.
 *
 * **Use it for** a health page’s byline, beside the author: the reviewer’s
 * `beats` must cover the page’s category. **Not for** the author (the byline
 * itself), a tester’s quote (`PullQuote`), or the site’s promises
 * (`TrustPrinciples`).
 *
 * @summary The medical or science reviewer beside the author, with credentials and a date.
 * @import import { ReviewedBy } from "@/kit/components";
 */
export function ReviewedBy({ review, className }: ReviewedByProps) {
  const { person } = review;
  return (
    <div data-slot="reviewed-by" className={cn("flex items-center gap-4", className)}>
      <Avatar person={person} />
      <div className="flex min-w-0 flex-col">
        <p className="m-0 t-ui text-fg">
          Reviewed by{" "}
          {person.href ? (
            <a href={person.href} className="kit-focus kit-link rounded-ctl">
              {person.name}
            </a>
          ) : (
            person.name
          )}
          <span className="font-normal text-fg-muted">, {review.credentials}</span>
        </p>
        <p className="m-0 mt-1 t-small text-fg-muted">
          Checked the facts on <time dateTime={review.reviewedAt}>{formatDateLong(review.reviewedAt)}</time>
        </p>
      </div>
    </div>
  );
}
