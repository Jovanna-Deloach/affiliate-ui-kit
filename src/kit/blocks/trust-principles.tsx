import { ShieldCheck } from "lucide-react";

import { cn } from "@/lib/cn";

export interface TrustPrinciple {
  /** The promise, in a few words: “Every review stays up”. */
  title: string;
  /** One or two sentences on what it means in practice. */
  body: string;
  /** Where it is explained in full. */
  href?: string;
}

export interface TrustPrinciplesProps {
  /** The heading (default “How we keep reviews honest”). */
  heading?: string;
  /** Three to six promises, in the order a doubtful reader asks about them. */
  items: TrustPrinciple[];
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The site's promises about how it tests, how it is paid and how it handles
 * reviews, each in a sentence or two with a link to the detail: the answer
 * to a reader who wonders whether any of it can be trusted.
 *
 * **Use it for** the end of a review section, an about page, or a footer
 * band. **Not for** a brand's record (`TrustSignals`), the commission
 * disclosure (that has its own place: the byline, every buy box, the
 * footer), or a method (`MethodologyAccordion`).
 *
 * @summary The site's promises on testing, money and reviews, each with a link.
 * @import import { TrustPrinciples } from "@/kit/blocks";
 */
export function TrustPrinciples({ heading = "How we keep reviews honest", items, className }: TrustPrinciplesProps) {
  return (
    <section aria-label={heading} className={cn("grid gap-6", className)}>
      <h2 className="m-0 t-title text-fg">{heading}</h2>
      <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.title} className="grid content-start gap-2 border-t border-line pt-4">
            <p className="m-0 flex items-start gap-2 t-ui font-semibold text-fg">
              <ShieldCheck aria-hidden="true" size={18} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent-category-ink" />
              {item.title}
            </p>
            <p className="m-0 t-small text-fg-body">{item.body}</p>
            {item.href ? (
              <a href={item.href} aria-label={`${item.title}: how it works`} className="kit-focus kit-link justify-self-start rounded-ctl t-small text-fg">
                How it works
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
