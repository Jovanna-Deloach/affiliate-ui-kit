import { Star } from "lucide-react";

import { cn } from "@/lib/cn";

const SIZES = { sm: 14, md: 18, lg: 24 } as const;

function Stars({ size, className }: { size: number; className?: string }) {
  return (
    <span className={cn("flex gap-0.5", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={size} strokeWidth={0} fill="currentColor" className="shrink-0" />
      ))}
    </span>
  );
}

export interface StarRatingProps {
  /** The rating, 0 to 5; fractions fill part of a star (4.4 fills four and two-fifths). */
  value: number;
  /** `sm` 14px stars, in a review card · `md` 18px (default) · `lg` 24px, beside a big average. */
  size?: keyof typeof SIZES;
  /** Print the number after the stars (“4.4”), for an average. */
  showValue?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Five stars filled to a rating, in ink on gray, read out as “4.4 out of 5
 * stars”. The number is the fact; the stars help the eye, so an average
 * shows its number too (`showValue`).
 *
 * **Use it for** a review's rating and a product's average. **Not for** the
 * site's own score (`Scorecard`, out of 10), a letter grade, or picking a
 * rating in a form (`RatingInput`).
 *
 * @summary Five stars filled to a rating, read out with its number.
 * @import import { StarRating } from "@/kit/ui";
 */
export function StarRating({ value, size = "md", showValue, className }: StarRatingProps) {
  const rating = Math.min(5, Math.max(0, value));
  const px = SIZES[size];
  return (
    <span role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`} className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative inline-flex" aria-hidden="true">
        <Stars size={px} className="text-line-strong" />
        <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${(rating / 5) * 100}%` }}>
          <Stars size={px} className="w-max text-fg" />
        </span>
      </span>
      {showValue ? (
        <span aria-hidden="true" data-numeric className="t-ui font-semibold text-fg">
          {rating.toFixed(1)}
        </span>
      ) : null}
    </span>
  );
}
