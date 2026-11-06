import { cn } from "@/lib/cn";
import { lowerFirst } from "@/kit/lib/text";
import type { Person } from "@/kit/types";
import { Avatar, Badge } from "@/kit/ui";

export interface PullQuoteProps {
  /** The quote, without quotation marks: the kit sets them, hanging the opening one. */
  text: string;
  /** Who said it: name, and optionally role and portrait. The page’s tester must cover the page’s category. */
  person: Pick<Person, "name" | "role" | "avatar">;
  /** What the tester did to earn the quote: “64 days on the wrist”, “160 miles logged”. */
  proof?: string;
  /** Cap it at the reading measure: `max-w-measure`. */
  className?: string;
}

/**
 * A tester’s words, unboxed: a 2px rule in the action colour, the quote in
 * the display serif italic with its opening mark hung into the margin, then
 * the tester (portrait or initials, name, role) and the proof they earned
 * the right to say it, as an outline badge.
 *
 * **Use it for** one quote from someone who used the product, in a review.
 * **Not for** a reader review, a testimonial without a named tester, or a
 * heading. One per deep dive.
 *
 * @summary A named tester’s quote, with the proof they earned it (“160 miles logged”).
 * @import import { PullQuote } from "@/kit/components";
 */
export function PullQuote({ text, person, proof, className }: PullQuoteProps) {
  return (
    <figure data-slot="pull-quote" className={cn("m-0 border-l-2 border-accent pl-5", className)}>
      <blockquote className="m-0 t-quote text-fg">
        <p className="m-0">
          <span className="kit-hang">“</span>
          {text}”
        </p>
      </blockquote>
      <figcaption className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <Avatar person={person} size="sm" />
        <span className="t-small text-fg-muted">
          <span className="font-semibold text-fg">{person.name}</span>
          {person.role && <>, {lowerFirst(person.role)}</>}
        </span>
        {proof && (
          <Badge variant="outline" size="md">
            {proof}
          </Badge>
        )}
      </figcaption>
    </figure>
  );
}
