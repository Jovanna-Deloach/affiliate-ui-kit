import { cn } from "@/lib/cn";

export interface ReadingProgressProps {
  /** Placement only: under a sticky header, `top-16`. The look comes from the theme. */
  className?: string;
}

/**
 * A 2px bar across the top of the window, in the section’s color, that
 * fills as the reader scrolls through the page. The page’s own scroll draws
 * it in CSS (a scroll timeline), with no script; browsers without scroll
 * timelines show nothing. Decorative: hidden from screen readers.
 *
 * **Use it for** a long guide or report, once per page. **Not for** a
 * product page or a short article, or for loading or a step in a form.
 *
 * @summary A thin bar that fills as the reader scrolls, drawn by CSS with no script.
 * @import import { ReadingProgress } from "@/kit/ui";
 */
export function ReadingProgress({ className }: ReadingProgressProps) {
  return <div aria-hidden="true" data-slot="reading-progress" className={cn("kit-progress pointer-events-none fixed inset-x-0 top-0 z-40 h-0.5 bg-accent-category", className)} />;
}
