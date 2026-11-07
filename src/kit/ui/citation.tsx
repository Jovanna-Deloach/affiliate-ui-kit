import { citationId, referenceId } from "@/kit/lib/evidence";
import { cn } from "@/lib/cn";

export interface CitationProps {
  /** The source’s number in the `ReferenceList`. */
  n: number;
  /** The source’s `Reference.id`: the citation links to its entry, `#ref-{id}`. */
  to: string;
  /** Which citation of this source it is, when the text cites it again (2, 3…), so every anchor stays unique. Default 1: the one the list links back to. */
  occurrence?: number;
  /** Placement only: margin. The look comes from the theme. */
  className?: string;
}

/**
 * A numbered citation in running text, “[3]”, raised, that jumps to its
 * source in the `ReferenceList`; the list links back to each source’s first
 * citation. Screen readers hear “Reference 3”.
 *
 * **Use it for** every claim that rests on a study or a report, right after
 * the claim. **Not for** a link readers follow to read on (a plain link), or
 * an aside that explains (put it in the sentence).
 *
 * @summary A numbered citation, [3], that jumps to its source and back.
 * @import import { Citation } from "@/kit/ui";
 */
export function Citation({ n, to, occurrence = 1, className }: CitationProps) {
  return (
    <sup className={cn("leading-none", className)}>
      <a id={citationId(to, occurrence)} href={`#${referenceId(to)}`} className="kit-focus scroll-mt-24 rounded-ctl t-caption leading-none font-semibold text-accent no-underline hover:underline">
        <span className="sr-only">Reference </span>
        <span aria-hidden="true">[</span>
        {n}
        <span aria-hidden="true">]</span>
      </a>
    </sup>
  );
}
