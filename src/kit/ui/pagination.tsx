import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/cn";

/** The pages to show: the first, the last, and one either side of the current, with gaps. */
export function pageWindow(page: number, pageCount: number): (number | "gap")[] {
  const pages = new Set([1, pageCount, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pageCount));
  const sorted = [...pages].sort((a, b) => a - b);
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1]! > 1 ? (["gap", p] as const) : [p]));
}

export interface PaginationProps {
  /** The page shown, from 1. */
  page: number;
  /** How many pages there are. */
  pageCount: number;
  /** The address of a page: `(page) => "?page=" + page`. Every page is a real link, so search engines follow them. */
  href: (page: number) => string;
  /** What is paged, for screen readers: “Review pages”. */
  label?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

const step =
  "kit-focus inline-flex min-h-11 items-center gap-1 rounded-ctl px-3 t-ui text-fg no-underline transition-colors duration-(--dur) ease-(--ease) hover:bg-well";

/**
 * Previous, page numbers and Next, as plain links: the first and last page,
 * and one either side of the current, with gaps between. On a phone it
 * shrinks to Previous, “Page 3 of 20” and Next.
 *
 * **Use it for** long lists a reader moves through: reviews, a full
 * category ranking, search results. **Not for** a short list (show it all),
 * or a list that grows in place (a `Button`: “Show 20 more reviews”).
 *
 * @summary Previous, page numbers and Next, as crawlable links; compact on phones.
 * @import import { Pagination } from "@/kit/ui";
 */
export function Pagination({ page, pageCount, href, label = "Pages", className }: PaginationProps) {
  if (pageCount <= 1) return null;
  const first = page <= 1;
  const last = page >= pageCount;
  return (
    <nav aria-label={label} className={className}>
      <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-1 p-0">
        <li>
          {first ? (
            <span aria-disabled="true" className={cn(step, "cursor-default text-fg-muted opacity-50 hover:bg-transparent")}>
              <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.75} />
              Previous
            </span>
          ) : (
            <a href={href(page - 1)} rel="prev" className={step}>
              <ChevronLeft aria-hidden="true" size={18} strokeWidth={1.75} />
              Previous
            </a>
          )}
        </li>
        {pageWindow(page, pageCount).map((p, i) =>
          p === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="hidden px-1 t-ui text-fg-muted sm:block">
              …
            </li>
          ) : (
            <li key={p} className="hidden sm:block">
              <a
                href={href(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                data-numeric
                className={cn(step, "min-w-11 justify-center px-2", p === page && "bg-fg text-paper hover:bg-fg")}
              >
                {p}
              </a>
            </li>
          ),
        )}
        <li data-numeric className="px-2 t-small text-fg-muted sm:hidden">
          Page {page} of {pageCount}
        </li>
        <li>
          {last ? (
            <span aria-disabled="true" className={cn(step, "cursor-default text-fg-muted opacity-50 hover:bg-transparent")}>
              Next
              <ChevronRight aria-hidden="true" size={18} strokeWidth={1.75} />
            </span>
          ) : (
            <a href={href(page + 1)} rel="next" className={step}>
              Next
              <ChevronRight aria-hidden="true" size={18} strokeWidth={1.75} />
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}
