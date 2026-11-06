import { cn } from "@/lib/cn";
import type { RoundupGuide } from "@/kit/types";
import { Disclosure, DisclosureIcon, DisclosureSummary, Eyebrow } from "@/kit/ui";

export interface MethodologyAccordionProps {
  /** The method: a `heading` that says something, a `summary`, and the `steps` in order (title and body). */
  methodology: RoundupGuide["methodology"];
  /** The section’s anchor, the target of the testing card’s jump. Default `methodology`. */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * How the testing was done, as a card: the heading and summary on the left,
 * the protocol as numbered native disclosures on the right, the first one
 * open (no script; closed steps stay in the page for search engines). The
 * figures live in the header’s testing card, so they are not repeated here.
 *
 * **Use it for** the method section near the end of every review page.
 * **Not for** the testing summary (`TestingTelemetryBadge`) or a list of
 * questions and answers about products.
 *
 * @summary How the testing was done: heading, summary and numbered steps that open on demand.
 * @import import { MethodologyAccordion } from "@/kit/blocks";
 */
export function MethodologyAccordion({ methodology, id = "methodology", className }: MethodologyAccordionProps) {
  return (
    <section id={id} data-slot="methodology" aria-labelledby={`${id}-heading`} className={cn("kit-well scroll-mt-8", className)}>
      <div className="@container kit-card p-6 md:p-10">
        <div className="grid items-start gap-10 @4xl:grid-cols-12 @4xl:gap-x-12">
          <div className="@4xl:col-span-4">
            <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
              {methodology.heading}
            </h2>
            <p className="m-0 mt-4 max-w-measure t-body text-fg-body">{methodology.summary}</p>
          </div>
          <ol className="m-0 list-none p-0 @4xl:col-span-7 @4xl:col-start-6">
            {methodology.steps.map((step, i) => (
              <li key={step.title} className="border-b border-line first:border-t">
                <Disclosure open={i === 0}>
                  <DisclosureSummary className="min-h-14 gap-6 rounded-ctl py-3 t-ui text-fg">
                    <span className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-2">
                      <Eyebrow as="span" data-numeric>
                        {String(i + 1).padStart(2, "0")}
                      </Eyebrow>
                      <span className="font-semibold">{step.title}</span>
                    </span>
                    <DisclosureIcon />
                  </DisclosureSummary>
                  <p className="m-0 max-w-measure pb-5 pl-10 t-body text-fg-body">{step.body}</p>
                </Disclosure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
