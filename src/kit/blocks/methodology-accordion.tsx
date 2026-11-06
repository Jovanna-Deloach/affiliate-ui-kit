import { Plus } from "lucide-react";

import { cn } from "@/lib/cn";
import type { RoundupGuide } from "@/kit/types";

/**
 * How the testing was done, as an elevated card on the ground. Heading and
 * summary on the left; the protocol as native disclosures on the right
 * (no script; collapsed steps stay in the document for search engines).
 * The figures live in the header’s testing card, so they are not repeated
 * here. Step numbers are editorial index numerals in the mono voice: the
 * protocol is a sequence.
 */
export interface MethodologyAccordionProps {
  methodology: RoundupGuide["methodology"];
  id?: string;
  className?: string;
}

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
                <details className="kit-details" open={i === 0}>
                  <summary className="kit-focus flex min-h-14 items-center justify-between gap-6 rounded-ctl py-3 t-ui text-fg">
                    <span className="grid grid-cols-[2rem_minmax(0,1fr)] items-baseline gap-2">
                      <span data-numeric className="t-micro text-fg-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-semibold">{step.title}</span>
                    </span>
                    <Plus data-slot="toggle-icon" size={18} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-fg-muted" />
                  </summary>
                  <p className="m-0 max-w-measure pb-5 pl-10 t-body text-fg-body">{step.body}</p>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
