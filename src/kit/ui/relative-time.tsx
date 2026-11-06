import { relativeTime } from "@/kit/lib/reviews";
import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";

export interface RelativeTimeProps {
  /** The moment (ISO): when a review or reply was posted. */
  date: string;
  /** The moment to count from; pin it in stories and tests so the words stay put (default: now). */
  now?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * How long ago something happened, as people say it (“3 hours ago”,
 * “yesterday”, “last month”), with the exact date in its `<time>` element
 * and on hover.
 *
 * **Use it for** when a review, reply or alert was posted. **Not for** a date
 * a reader acts on or compares (a test date, a certification’s expiry: write
 * the date), or when prices were checked (`OfferCard` writes the date).
 *
 * @summary How long ago (“3 hours ago”), with the exact date in the markup.
 * @import import { RelativeTime } from "@/kit/ui";
 */
export function RelativeTime({ date, now, className }: RelativeTimeProps) {
  return (
    <time dateTime={date} title={formatDateLong(date)} suppressHydrationWarning className={cn("t-caption text-fg-muted", className)}>
      {relativeTime(date, now)}
    </time>
  );
}
