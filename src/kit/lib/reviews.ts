import type { RatingSummary, Review, ReviewQuery } from "@/kit/types";

/** Every review, newest first: what a review list shows before the reader asks for anything. */
export const ALL_REVIEWS: ReviewQuery = { stars: [], verifiedOnly: false, withReplies: false, posted: "all", search: "", sort: "recent" };

/** The word readers use for an average: Excellent (4.5 and up), Great, Average, Poor, Bad (under 2). */
export function ratingWord(average: number): string {
  if (average >= 4.5) return "Excellent";
  if (average >= 4) return "Great";
  if (average >= 3) return "Average";
  if (average >= 2) return "Poor";
  return "Bad";
}

const DAY = 86_400_000;
const WINDOW = { "30d": 30, "3m": 91, "6m": 182, "12m": 365 } as const;

/** The summary of a set of reviews: average, count, the last 12 months and the spread. */
export function summarize(reviews: readonly Review[], now: Date | string = new Date()): RatingSummary {
  const at = new Date(now).getTime();
  const distribution: RatingSummary["distribution"] = [0, 0, 0, 0, 0];
  for (const review of reviews) distribution[review.rating - 1] = (distribution[review.rating - 1] ?? 0) + 1;
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: reviews.length ? Math.round((total / reviews.length) * 10) / 10 : 0,
    count: reviews.length,
    recentCount: reviews.filter((review) => at - Date.parse(review.postedAt) <= 365 * DAY).length,
    distribution,
  };
}

const ORDER: Record<ReviewQuery["sort"], (a: Review, b: Review) => number> = {
  recent: (a, b) => Date.parse(b.postedAt) - Date.parse(a.postedAt),
  relevant: (a, b) => (b.useful ?? 0) - (a.useful ?? 0) || ORDER.recent(a, b),
  highest: (a, b) => b.rating - a.rating || ORDER.recent(a, b),
  lowest: (a, b) => a.rating - b.rating || ORDER.recent(a, b),
};

/**
 * The reviews a query asks for, in its order. “Most relevant” is the most
 * marked useful first, then the newest; say so on the page.
 */
export function filterReviews(reviews: readonly Review[], query: ReviewQuery, now: Date | string = new Date()): Review[] {
  const at = new Date(now).getTime();
  const since = query.posted === "all" ? -Infinity : at - WINDOW[query.posted] * DAY;
  const words = query.search.trim().toLowerCase();
  return reviews
    .filter(
      (review) =>
        (query.stars.length === 0 || query.stars.includes(review.rating)) &&
        (!query.verifiedOnly || review.labels.includes("verified")) &&
        (!query.withReplies || Boolean(review.reply)) &&
        Date.parse(review.postedAt) >= since &&
        (!query.topic || Boolean(review.topics?.includes(query.topic))) &&
        (!words || `${review.title} ${review.body}`.toLowerCase().includes(words)),
    )
    .sort(ORDER[query.sort]);
}

const RELATIVE = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
const STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * DAY],
  ["month", 30 * DAY],
  ["week", 7 * DAY],
  ["day", DAY],
  ["hour", 3_600_000],
  ["minute", 60_000],
];

/** “3 hours ago”, “yesterday”, “last month”: how long ago a date was, as people say it. */
export function relativeTime(iso: string, now: Date | string = new Date()): string {
  const diff = Date.parse(iso) - new Date(now).getTime();
  for (const [unit, size] of STEPS) if (Math.abs(diff) >= size) return RELATIVE.format(Math.round(diff / size), unit);
  return "just now";
}
