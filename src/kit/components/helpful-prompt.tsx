"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface HelpfulPromptProps {
  /** The question, about the page itself (default “Was this page helpful?”). */
  question?: string;
  /** Called once, with the reader’s answer, for your analytics. */
  onAnswer?: (helpful: boolean) => void;
  /** Where a reader who answered No can say what was missing (a feedback form or email). */
  feedbackHref?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A one-tap question at the end of a page, between hairlines: Yes or No,
 * then a thank-you in its place (and, after No, a link to say what was
 * missing). It asks about the page, never about a product.
 *
 * **Use it for** the end of a guide, an ingredient page or a help article.
 * **Not for** rating a product (a review), or a review’s own Useful count.
 *
 * @summary “Was this page helpful?” Yes or No, then a thank-you; ends a page.
 * @import import { HelpfulPrompt } from "@/kit/components";
 */
export function HelpfulPrompt({ question = "Was this page helpful?", onAnswer, feedbackHref, className }: HelpfulPromptProps) {
  const id = useId();
  const [answer, setAnswer] = useState<boolean | null>(null);
  const reply = (helpful: boolean) => {
    setAnswer(helpful);
    onAnswer?.(helpful);
  };
  return (
    <section aria-labelledby={id} className={cn("flex min-h-18 flex-wrap items-center justify-between gap-x-6 gap-y-3 border-y border-line py-4", className)}>
      <p id={id} className="m-0 t-ui font-semibold text-fg">
        {question}
      </p>
      {answer === null ? (
        <div className="flex gap-2">
          <Button onClick={() => reply(true)}>
            <ThumbsUp aria-hidden="true" size={16} strokeWidth={1.75} />
            Yes
          </Button>
          <Button onClick={() => reply(false)}>
            <ThumbsDown aria-hidden="true" size={16} strokeWidth={1.75} />
            No
          </Button>
        </div>
      ) : (
        <p role="status" className="m-0 t-small text-fg-muted">
          Thanks for telling us.
          {!answer && feedbackHref ? (
            <>
              {" "}
              <a href={feedbackHref} className="kit-focus kit-link rounded-ctl text-fg">
                Tell us what was missing
              </a>
              .
            </>
          ) : null}
        </p>
      )}
    </section>
  );
}
