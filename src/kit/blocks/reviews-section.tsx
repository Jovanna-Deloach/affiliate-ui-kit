"use client";

import { MessageSquareText } from "lucide-react";
import { useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from "react";

import { AiReviewSummary, filterCount, RatingSummary, ReviewCard, ReviewFilters, ReviewSort, ReviewTopics } from "@/kit/components";
import { ALL_REVIEWS, filterReviews, summarize } from "@/kit/lib/reviews";
import type { AiSummary, Review, ReviewQuery, ReviewTopic } from "@/kit/types";
import { Button, Chip, EmptyState } from "@/kit/ui";
import { cn } from "@/lib/cn";

/** The summary and the filters on the left, everything else in a column on the right, in both rows. */
const COLUMNS = "grid gap-8 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12";
const POSTED_LABEL: Record<ReviewQuery["posted"], string> = { all: "", "30d": "Last 30\u00a0days", "3m": "Last 3\u00a0months", "6m": "Last 6\u00a0months", "12m": "Last 12\u00a0months" };
/** A list this short is read at a glance: no filters. */
const FEW = 5;
const REVIEW_HASH = /^#review-(.+)$/;
const hashId = (hash: string | null | undefined) => {
  try {
    return REVIEW_HASH.exec(decodeURIComponent(hash ?? ""))?.[1];
  } catch {
    return undefined;
  }
};

export interface ReviewsSectionProps {
  /** The section’s heading, saying what the reviews are of: “What readers say about Peak Supply Creatine”. */
  heading: string;
  /** Every review to show; the section filters, sorts and pages them in the browser. */
  reviews: Review[];
  /** What reviewers mention, as filters under the summary; the section counts each topic’s reviews itself and leaves out a topic none mention. */
  topics?: ReviewTopic[];
  /** A generated summary, shown labeled as AI beside the numbers. */
  aiSummary?: AiSummary;
  /** Beside the numbers, how the brand handles reviews (`TrustSignals`) or anything else. */
  aside?: ReactNode;
  /** The way to add a review, under the numbers: an outlined `Button` (the filled action stays the buy button), or a `Dialog` holding `WriteReview`. Leave out for tester reviews. */
  writeAction?: ReactNode;
  /** Reviews per step of “Show more” (default 10). */
  pageSize?: number;
  /** The moment relative dates and date filters count from; pin it in stories and tests (default: now). */
  now?: string;
  /** Where the site explains its review labels. */
  labelsHref?: string;
  /** Where a reader reports a review. */
  reportHref?: string;
  /** Where the site explains how its average is worked out. */
  scoreHref?: string;
  /** The section’s id, for links to it (default `reviews`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A product’s reviews, whole: the numbers (average, word, spread), a
 * generated summary and topics if given, then the list with its filters (a
 * sidebar on wide screens, a sheet on phones), its sort, the filters applied
 * as removable chips, and “Show more”. Every rating stays in reach: the
 * default order is newest first, and the list says that brands cannot pay to
 * remove or move a review. Works for reader reviews and for tester reviews
 * alike: filters with nothing to match are not offered, and with five
 * reviews or fewer there are no filters at all (the rating rows still
 * filter). With no reviews it says so, with `writeAction`. A link to a review
 * (`#review-{id}`, from the AI summary or anywhere on the page) always finds
 * it: the section clears filters that hide it and shows enough of the list.
 *
 * **Use it for** a product’s or brand’s reviews, up to a few hundred (it
 * filters in the browser). **Not for** thousands of reviews: compose
 * `RatingSummary`, `ReviewFilters`, `ReviewCard` and `Pagination` with links,
 * filtered on the server. Not for the site’s own verdict.
 *
 * @summary A product’s reviews: numbers, AI summary, topics, filters, sort, list.
 * @import import { ReviewsSection } from "@/kit/blocks";
 */
export function ReviewsSection({
  heading,
  reviews,
  topics,
  aiSummary,
  aside,
  writeAction,
  pageSize = 10,
  now,
  labelsHref,
  reportHref,
  scoreHref,
  id = "reviews",
  className,
}: ReviewsSectionProps) {
  const [query, setQuery] = useState<ReviewQuery>(ALL_REVIEWS);
  const [limit, setLimit] = useState(pageSize);
  const summary = useMemo(() => summarize(reviews, now), [reviews, now]);
  const counts = useMemo(() => ({ verified: reviews.filter((r) => r.labels.includes("verified")).length, withReplies: reviews.filter((r) => r.reply).length }), [reviews]);
  const shown = useMemo(() => filterReviews(reviews, query, now), [reviews, query, now]);
  const counted = useMemo(
    () =>
      topics
        ?.map((topic) => ({ ...topic, mentions: reviews.filter((review) => review.topics?.includes(topic.id)).length }))
        .filter((topic) => topic.mentions > 0)
        .sort((a, b) => b.mentions - a.mentions),
    [topics, reviews],
  );

  const sectionRef = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState<{ id: string; scroll: boolean }>();

  const change = (next: ReviewQuery) => {
    setQuery(next);
    setLimit(pageSize);
  };

  /* Show the review a link points to: clear the filters if they hide it, and lengthen the list to reach it. */
  const reveal = (reviewId: string) => {
    if (!reviews.some((review) => review.id === reviewId)) return false;
    let list = shown;
    let from = limit;
    if (!list.some((review) => review.id === reviewId)) {
      const all = { ...ALL_REVIEWS, sort: query.sort };
      list = filterReviews(reviews, all, now);
      from = pageSize;
      setQuery(all);
    }
    const index = list.findIndex((review) => review.id === reviewId);
    setLimit(Math.max(from, Math.ceil((index + 1) / pageSize) * pageSize));
    setFocus({ id: reviewId, scroll: true });
    return true;
  };
  const onHashChange = useEffectEvent(() => {
    const reviewId = hashId(window.location.hash);
    if (reviewId) reveal(reviewId);
  });
  const onClick = useEffectEvent((event: MouseEvent) => {
    const link = event.target instanceof Element ? event.target.closest("a[href^='#review-']") : null;
    const reviewId = hashId(link?.getAttribute("href"));
    if (reviewId && reveal(reviewId)) {
      event.preventDefault();
      window.history.pushState(null, "", `#review-${reviewId}`);
    }
  });
  useEffect(() => {
    const section = sectionRef.current;
    const handleHash = () => onHashChange();
    const handleClick = (event: MouseEvent) => onClick(event);
    handleHash();
    window.addEventListener("hashchange", handleHash);
    section?.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      section?.removeEventListener("click", handleClick);
    };
  }, []);
  useEffect(() => {
    if (!focus) return;
    const card = document.getElementById(`review-${focus.id}`);
    if (focus.scroll) card?.scrollIntoView({ block: "start" });
    card?.focus({ preventScroll: true });
  }, [focus]);

  const showMore = () => {
    const next = shown[limit];
    setLimit(limit + pageSize);
    if (next) setFocus({ id: next.id, scroll: false });
  };
  const toggleStars = (stars: number) => change({ ...query, stars: query.stars.includes(stars) ? query.stars.filter((s) => s !== stars) : [...query.stars, stars] });
  const topicLabel = counted?.find((t) => t.id === query.topic)?.label;
  const applied: { label: string; clear: Partial<ReviewQuery> }[] = [
    ...[...query.stars].sort((a, b) => b - a).map((s) => ({ label: `${s} ${s === 1 ? "star" : "stars"}`, clear: { stars: query.stars.filter((x) => x !== s) } })),
    ...(query.verifiedOnly ? [{ label: "Verified only", clear: { verifiedOnly: false } }] : []),
    ...(query.withReplies ? [{ label: "With replies", clear: { withReplies: false } }] : []),
    ...(query.posted !== "all" ? [{ label: POSTED_LABEL[query.posted], clear: { posted: "all" as const } }] : []),
    ...(topicLabel ? [{ label: topicLabel, clear: { topic: undefined } }] : []),
    ...(query.search.trim() ? [{ label: `“${query.search.trim()}”`, clear: { search: "" } }] : []),
  ];
  const filters = { query, onChange: change, summary, counts, resultCount: shown.length };
  const offerFilters = reviews.length > FEW;
  const testersOnly = reviews.every((review) => review.labels.includes("tester"));
  const count = (n: number) => `${n.toLocaleString("en-US")} ${n === 1 ? "review" : "reviews"}`;
  const ratingSummary = <RatingSummary summary={summary} selected={query.stars} onSelectStars={toggleStars} scoreHref={scoreHref} action={writeAction} />;
  const panel = offerFilters ? <ReviewFilters {...filters} className="hidden lg:block" /> : null;
  const side =
    aiSummary || counted?.length || aside ? (
      <div className="grid content-start gap-6">
        {aiSummary ? <AiReviewSummary summary={aiSummary} reviews={reviews} /> : null}
        {counted?.length ? <ReviewTopics topics={counted} selected={query.topic} onSelect={(topic) => change({ ...query, topic })} /> : null}
        {aside}
      </div>
    ) : null;
  const title = (
    <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
      {heading}
    </h2>
  );

  if (reviews.length === 0)
    return (
      <section ref={sectionRef} id={id} aria-labelledby={`${id}-heading`} className={cn("grid scroll-mt-8 gap-10", className)}>
        {title}
        <EmptyState title="No reviews yet" icon={MessageSquareText} action={writeAction} className="border-t border-line">
          {writeAction ? <p>Used it? Yours would be the first.</p> : null}
        </EmptyState>
      </section>
    );

  return (
    <section ref={sectionRef} id={id} aria-labelledby={`${id}-heading`} className={cn("grid scroll-mt-8 gap-10", className)}>
      {title}
      {side ? (
        <div className={COLUMNS}>
          {ratingSummary}
          {side}
        </div>
      ) : null}
      <div className={COLUMNS}>
        {side ? (
          panel
        ) : (
          <div className="grid content-start gap-10">
            {ratingSummary}
            {panel}
          </div>
        )}
        <div className="min-w-0 lg:col-start-2">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
            <p role="status" data-numeric className="m-0 t-ui text-fg">
              {shown.length === reviews.length ? count(reviews.length) : `${shown.length.toLocaleString("en-US")} of ${count(reviews.length)}`}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {offerFilters ? <ReviewFilters {...filters} variant="drawer" className="lg:hidden" /> : null}
              <ReviewSort value={query.sort} onValueChange={(sort) => change({ ...query, sort })} />
            </div>
          </div>
          {applied.length ? (
            <ul aria-label="Filters applied" className="m-0 flex list-none flex-wrap items-center gap-2 p-0 pb-4">
              {applied.map((filter) => (
                <li key={filter.label}>
                  <Chip label={filter.label} onRemove={() => change({ ...query, ...filter.clear })} />
                </li>
              ))}
              <li>
                <Button emphasis="quiet" onClick={() => change({ ...ALL_REVIEWS, sort: query.sort })}>
                  Clear all
                </Button>
              </li>
            </ul>
          ) : null}
          {shown.length ? (
            <div>
              {shown.slice(0, limit).map((review) => (
                <ReviewCard key={review.id} review={review} now={now} labelsHref={labelsHref} reportHref={reportHref} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reviews match these filters"
              action={
                <Button onClick={() => change({ ...ALL_REVIEWS, sort: query.sort })} disabled={filterCount(query) === 0}>
                  Clear filters
                </Button>
              }
              className="border-t border-line"
            >
              <p>Try fewer filters, or reviews from any date.</p>
            </EmptyState>
          )}
          {shown.length > limit ? (
            <div className="border-t border-line pt-6">
              <Button onClick={showMore}>Show {Math.min(pageSize, shown.length - limit)} more reviews</Button>
            </div>
          ) : null}
          <p className="m-0 mt-6 border-t border-line pt-4 t-caption text-fg-muted">
            We show every review, whatever its rating, and brands can’t pay to remove or move one.
            {testersOnly ? null : " Most relevant puts the reviews most marked useful first."}
            {labelsHref ? (
              <>
                {" "}
                <a href={labelsHref} className="kit-focus kit-link rounded-ctl">
                  How we label reviews
                </a>
              </>
            ) : null}
          </p>
        </div>
      </div>
    </section>
  );
}
