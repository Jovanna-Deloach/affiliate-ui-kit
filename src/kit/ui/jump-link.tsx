import { ArrowDown } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface JumpLinkProps {
  /** The in-page target: `#review-halden-meridian-40-gmt`, `#methodology`. */
  href: string;
  /** What the reader gets there, in sentence case: “Read the full review”, “Read the full method”. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A jump to somewhere further down the same page, with a down-arrow icon
 * (never a glyph in the label) that nudges on hover. A 44px target.
 *
 * **Use it for** a verdict card’s link to its deep dive, the testing card’s
 * link to the method. **Not for** a link that leaves the page (a plain link,
 * or a `Buy*` primitive for a retailer).
 *
 * @summary A link to a section further down the same page, with a down arrow.
 * @import import { JumpLink } from "@/kit/ui";
 */
export function JumpLink({ href, children, className }: JumpLinkProps) {
  return (
    <a href={href} data-slot="jump-link" className={cn("kit-focus group inline-flex min-h-11 items-center gap-1.5 self-start rounded-ctl t-ui text-fg", className)}>
      <span className="kit-link">{children}</span>
      <ArrowDown size="1em" strokeWidth={1.75} aria-hidden="true" className="transition-transform duration-(--dur) ease-(--ease) group-hover:translate-y-0.5" />
    </a>
  );
}
