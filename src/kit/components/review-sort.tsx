import type { ReviewQuery } from "@/kit/types";
import { Select } from "@/kit/ui";

const ORDERS: { value: ReviewQuery["sort"]; label: string }[] = [
  { value: "recent", label: "Most recent" },
  { value: "relevant", label: "Most relevant" },
  { value: "highest", label: "Highest rated" },
  { value: "lowest", label: "Lowest rated" },
];

export interface ReviewSortProps {
  /** The order, when the page keeps the state (with `onValueChange`); default Most recent. */
  value?: ReviewQuery["sort"];
  /** Called with the order the reader picks. */
  onValueChange?: (sort: ReviewQuery["sort"]) => void;
  /** The field’s name in a plain form (default `sort`). */
  name?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The order of a review list: Most recent (the default, so the newest
 * reviews are never hidden), Most relevant (most marked useful, then newest:
 * say so on the page), Highest rated and Lowest rated.
 *
 * **Use it for** above every review list. **Not for** other lists (`Select`
 * with their own orders).
 *
 * @summary Sort reviews: Most recent first, then relevant, highest, lowest.
 * @import import { ReviewSort } from "@/kit/components";
 */
export function ReviewSort({ value, onValueChange, name = "sort", className }: ReviewSortProps) {
  return (
    <Select
      label="Sort"
      inline
      name={name}
      options={ORDERS}
      {...(value === undefined ? { defaultValue: "recent" } : { value })}
      onChange={onValueChange ? (event) => onValueChange(event.target.value as ReviewQuery["sort"]) : undefined}
      className={className}
    />
  );
}
