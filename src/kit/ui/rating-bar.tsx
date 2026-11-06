import type { MouseEventHandler } from "react";

import { cn } from "@/lib/cn";

import { Meter } from "./meter";

export interface RatingBarProps {
  /** Which rating the row counts. */
  stars: 1 | 2 | 3 | 4 | 5;
  /** How many reviews gave it. */
  count: number;
  /** How many reviews there are in all; the bar is the share. */
  total: number;
  /** A filter that is a link: the list of reviews with this rating. */
  href?: string;
  /** A filter in the page: called when the reader picks the row; pair with `selected`. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** The list is showing this rating: the row is marked and announced as pressed. */
  selected?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * One row of a rating’s spread: “5 stars”, a bar for its share, and the
 * percentage. With `href` or `onClick` the row filters the reviews to that
 * rating, so a reader can go straight to the 1-star reviews.
 *
 * **Use it for** the five rows under an average (`RatingSummary` composes
 * them). **Not for** a score’s parts (`Meter`, `Scorecard`) or anything that
 * is not a count of ratings.
 *
 * @summary One row of a rating’s spread (“5 stars, 63%”) that can filter the reviews.
 * @import import { RatingBar } from "@/kit/ui";
 */
export function RatingBar({ stars, count, total, href, onClick, selected, className }: RatingBarProps) {
  const share = total > 0 ? count / total : 0;
  const label = `${stars} ${stars === 1 ? "star" : "stars"}`;
  const body = (
    <>
      <span className={cn("t-small", selected ? "font-semibold text-fg" : "text-fg-body")}>{label}</span>
      <span className="sr-only">
        : {count.toLocaleString("en-US")} {count === 1 ? "review" : "reviews"},
      </span>
      <Meter value={share} className="h-2" />
      <span data-numeric className="text-right t-caption text-fg-muted">
        {Math.round(share * 100)}%
      </span>
    </>
  );
  const row = cn(
    "grid min-h-9 w-full grid-cols-[4.25rem_minmax(0,1fr)_2.75rem] items-center gap-3 rounded-ctl px-2 text-left",
    selected && "bg-well",
    (href || onClick) && "kit-focus cursor-pointer transition-colors duration-(--dur) ease-(--ease) hover:bg-well",
    className,
  );
  if (onClick)
    return (
      <button type="button" onClick={onClick} aria-pressed={Boolean(selected)} className={row}>
        {body}
      </button>
    );
  if (href)
    return (
      <a href={href} className={cn(row, "no-underline")}>
        {body}
      </a>
    );
  return (
    <div className={row}>
      {body}
    </div>
  );
}
