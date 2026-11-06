"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/cn";

export interface ReadMoreProps {
  /** Plain text; a blank line starts a new paragraph. */
  text: string;
  /** Lines shown before “See more” (default 4). */
  lines?: 3 | 4 | 6;
  /** Text shorter than this many characters is shown whole, with no button (default 320). */
  threshold?: number;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

const CLAMP = { 3: "line-clamp-3", 4: "line-clamp-4", 6: "line-clamp-6" } as const;

/**
 * Long text cut to a few lines, with “See more” to open it in place. The
 * whole text is always in the page, so search engines and find-in-page reach
 * it; only its height is held back.
 *
 * **Use it for** a review’s body, a long reply, a brand’s description.
 * **Not for** a section a reader opens on demand (`Disclosure`) or anything
 * a reader needs in order to decide (show it whole).
 *
 * @summary Long text cut to a few lines, with See more; the whole text stays in the page.
 * @import import { ReadMore } from "@/kit/ui";
 */
export function ReadMore({ text, lines = 4, threshold = 320, className }: ReadMoreProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const paragraphs = text.split(/\n\s*\n/).filter(Boolean);
  const long = text.length > threshold;
  return (
    <div className={cn("grid justify-items-start gap-2", className)}>
      <div id={id} className="grid gap-3 t-body text-fg-body">
        {long && !open ? <p className={cn("m-0", CLAMP[lines])}>{paragraphs.join(" ")}</p> : paragraphs.map((p, i) => <p key={i} className="m-0">{p}</p>)}
      </div>
      {long ? (
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} className="kit-focus kit-link cursor-pointer rounded-ctl t-small text-fg">
          {open ? "See less" : "See more"}
        </button>
      ) : null}
    </div>
  );
}
