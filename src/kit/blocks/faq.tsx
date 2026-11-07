import { faqStructuredData } from "@/kit/lib/evidence";
import type { FaqItem } from "@/kit/types";
import { Disclosure, DisclosureIcon, DisclosureSummary } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface FaqProps {
  /** The questions readers ask, each with its answer as paragraphs of plain text. */
  items: FaqItem[];
  /** The heading (default “Questions people ask”). */
  heading?: string;
  /** Print the questions as schema.org FAQPage structured data (default true). One FAQ a page carries it. */
  structuredData?: boolean;
  /** An anchor, unique on the page (default `faq`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Questions readers ask, each a row that opens to its answer (native
 * `<details>`: no script, and closed answers stay in the page for search
 * engines). The questions are `h3` headings inside their rows. The same
 * questions and answers go into the page as FAQPage structured data, once.
 *
 * **Use it for** the questions a supplement’s or a guide’s readers ask, near
 * the end of the page, answered in a paragraph or two each. **Not for** the
 * method (`MethodologyAccordion`), readers’ reviews (`ReviewsSection`), or
 * anything a reader needs before deciding: say that on the page.
 *
 * @summary Questions and answers that open on demand, with FAQ structured data.
 * @import import { Faq } from "@/kit/blocks";
 */
export function Faq({ items, heading = "Questions people ask", structuredData = true, id = "faq", className }: FaqProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("grid scroll-mt-8 gap-4", className)}>
      <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
        {heading}
      </h2>
      <div className="border-t border-line">
        {items.map((item) => (
          <Disclosure key={item.question} className="border-b border-line">
            <DisclosureSummary className="min-h-14 gap-6 rounded-ctl py-3">
              <h3 className="m-0 t-ui font-semibold text-fg">{item.question}</h3>
              <DisclosureIcon />
            </DisclosureSummary>
            <div className="grid max-w-measure gap-3 pb-5">
              {item.answer.map((paragraph) => (
                <p key={paragraph} className="m-0 t-body text-fg-body">
                  {paragraph}
                </p>
              ))}
            </div>
          </Disclosure>
        ))}
      </div>
      {structuredData ? (
        <script
          type="application/ld+json"
          // The answers are the site’s own copy; escaping “<” keeps them from closing the script.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData(items)).replace(/</g, "\\u003c") }}
        />
      ) : null}
    </section>
  );
}
