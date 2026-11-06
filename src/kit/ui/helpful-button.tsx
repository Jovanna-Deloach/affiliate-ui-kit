"use client";

import { ThumbsUp } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";

export interface HelpfulButtonProps {
  /** How many readers have marked it useful, before this reader. */
  count?: number;
  /** This reader has already marked it (from their account or this device). */
  defaultMarked?: boolean;
  /** Called when the reader marks or unmarks it, to save the vote. */
  onMark?: (marked: boolean) => void;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * “Useful”, with how many readers said so: a toggle, announced as pressed
 * once the reader marks it, and counted at once. Votes feed “Most relevant”,
 * never the rating.
 *
 * **Use it for** each review and each answer to a question. **Not for**
 * rating the product (`RatingInput`) or a whole page (`HelpfulPrompt`).
 *
 * @summary “Useful” with its count: a toggle on each review.
 * @import import { HelpfulButton } from "@/kit/ui";
 */
export function HelpfulButton({ count = 0, defaultMarked = false, onMark, className }: HelpfulButtonProps) {
  const [marked, setMarked] = useState(defaultMarked);
  const shown = count + (marked === defaultMarked ? 0 : marked ? 1 : -1);
  return (
    <button
      type="button"
      aria-pressed={marked}
      onClick={() => {
        setMarked(!marked);
        onMark?.(!marked);
      }}
      className={cn(
        "kit-focus inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 t-small transition-colors duration-(--dur) ease-(--ease)",
        marked ? "border-fg bg-fg text-paper" : "border-line-strong bg-paper text-fg hover:border-fg",
        className,
      )}
    >
      <ThumbsUp aria-hidden="true" size={14} strokeWidth={1.75} />
      Useful
      {shown > 0 ? (
        <span data-numeric className={cn("t-caption", marked ? "text-paper/80" : "text-fg-muted")}>
          {shown.toLocaleString("en-US")}
        </span>
      ) : null}
    </button>
  );
}
