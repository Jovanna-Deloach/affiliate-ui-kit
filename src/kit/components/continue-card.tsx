import type { ReactNode } from "react";

import type { ReaderItem } from "@/kit/types";
import { Meter, RelativeTime } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface ContinueCardProps {
  /** A guide the reader started: its title and address, how far they read (0 to 1), the section they reached, and when. */
  item: ReaderItem;
  /** The moment “read 2 days ago” counts from; pin it in stories and tests (default: now). */
  now?: string;
  /** Beside the date: a button that takes the guide off the reader’s list. */
  action?: ReactNode;
  /** The title’s heading level: `h3` under a section’s `h2` (default). */
  as?: "h2" | "h3" | "h4";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A guide the reader started and did not finish: its title, a bar for how
 * far they got with the share in words, the section they stopped at, and a
 * link that takes them back to that section. The whole card is the link.
 *
 * **Use it for** unfinished guides in Pick up where you left off and on an
 * account’s history page. **Not for** a product the reader looked at
 * (`ProductCard`) or a guide they have not opened.
 *
 * @summary A guide the reader started: how far they got and where to pick it up.
 * @import import { ContinueCard } from "@/kit/components";
 */
export function ContinueCard({ item, now, action, as: Heading = "h3", className }: ContinueCardProps) {
  const progress = Math.min(1, Math.max(0, item.progress ?? 0));
  const percent = Math.round(progress * 100);
  return (
    <article className={cn("kit-card relative grid content-start gap-3 p-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="m-0 t-caption text-fg-muted">
          Read <RelativeTime date={item.at} now={now} />
        </p>
        {action ? <div className="relative z-10 -my-2 -mr-2">{action}</div> : null}
      </div>
      <Heading className="m-0 t-name-sm text-fg">{item.title}</Heading>
      <div className="grid gap-1.5">
        <Meter value={progress} tone="telemetry" className="h-1" />
        <p data-numeric className="m-0 t-caption text-fg-muted">
          {percent}% read{item.section ? `, up to “${item.section.title}”` : ""}
        </p>
      </div>
      <a
        href={item.section?.href ?? item.href}
        className="kit-focus kit-link justify-self-start rounded-ctl t-ui text-fg after:absolute after:inset-0 after:rounded-box"
      >
        Continue reading<span className="sr-only">: {item.title}</span>
      </a>
    </article>
  );
}
