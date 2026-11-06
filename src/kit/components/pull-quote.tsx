import { cn } from "@/lib/cn";
import { lowerFirst } from "@/kit/lib/text";
import type { Person } from "@/kit/types";
import { Avatar, Badge } from "@/kit/ui";

/**
 * A tester’s words, unboxed: a 2px rule in the action colour, 20px of air,
 * the quote in the display serif italic (1.25rem) with its opening mark
 * hung into the margin, then the tester — portrait or initials, name, role
 * — and the proof they earned the right to say it, as an outline badge
 * (“160 miles logged”). Set it no wider than the reading measure.
 */
export interface PullQuoteProps {
  /** The quote, without quotation marks. */
  text: string;
  person: Pick<Person, "name" | "role" | "avatar">;
  /** What the tester did to earn the quote: “64 days on the wrist”. */
  proof?: string;
  className?: string;
}

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
