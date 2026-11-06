import { SearchX, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface SkeletonProps {
  /** `text` lines of type (default) · `block` a card or photograph, sized by `className` · `circle` an avatar. */
  shape?: "text" | "block" | "circle";
  /** For `text`: how many lines; the last is shorter. */
  lines?: number;
  /** Placement and size: margin, width, height (`h-40` for a block, `size-10` for a circle). */
  className?: string;
}

/**
 * Gray shapes where content is loading, so the page keeps its layout. They
 * pulse gently, and hold still when the reader prefers reduced motion.
 * Hidden from screen readers: announce the wait in the list’s own label.
 *
 * **Use it for** reviews, results or prices that arrive after the page.
 * **Not for** content that is already in the page (render it), or a list
 * with nothing in it (`EmptyState`).
 *
 * @summary Gray placeholder shapes while content loads: lines, blocks, circles.
 * @import import { Skeleton } from "@/kit/ui";
 */
export function Skeleton({ shape = "text", lines = 1, className }: SkeletonProps) {
  const pulse = "bg-well motion-safe:animate-pulse";
  if (shape === "circle") return <span aria-hidden="true" className={cn("block size-10 rounded-full", pulse, className)} />;
  if (shape === "block") return <span aria-hidden="true" className={cn("block h-40 w-full rounded-box", pulse, className)} />;
  return (
    <span aria-hidden="true" className={cn("grid gap-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <span key={i} className={cn("block h-3 rounded-full", pulse, i === lines - 1 && lines > 1 ? "w-3/5" : "w-full")} />
      ))}
    </span>
  );
}

export interface EmptyStateProps {
  /** What is missing, plainly: “No reviews match these filters”. */
  title: string;
  /** Why, and what to try: “Try fewer filters, or all dates.” */
  children?: ReactNode;
  /** The way out: a `Button` (“Clear filters”). */
  action?: ReactNode;
  /** An icon in place of the default (no results). */
  icon?: LucideIcon;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What a list says when it has nothing to show: an icon, what is missing,
 * why, and one way out. Centered in the space the list would take.
 *
 * **Use it for** no reviews yet, no results for these filters, nothing
 * saved, no alerts set. **Not for** an error (`Alert`, tone `danger`) or
 * content that is loading (`Skeleton`).
 *
 * @summary What an empty list says: what is missing, why, and one way out.
 * @import import { EmptyState } from "@/kit/ui";
 */
export function EmptyState({ title, children, action, icon: Icon = SearchX, className }: EmptyStateProps) {
  return (
    <div className={cn("grid justify-items-center gap-3 px-6 py-12 text-center", className)}>
      <span className="grid size-12 place-items-center rounded-full bg-well text-fg-muted">
        <Icon aria-hidden="true" size={22} strokeWidth={1.75} />
      </span>
      <p className="m-0 t-name text-fg">{title}</p>
      {children ? <div className="max-w-sm t-small text-fg-muted [&_p]:m-0">{children}</div> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
