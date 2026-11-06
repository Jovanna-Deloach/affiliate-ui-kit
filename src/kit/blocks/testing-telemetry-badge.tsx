import { cn } from "@/lib/cn";
import type { RoundupGuide } from "@/kit/types";
import { Eyebrow, JumpLink } from "@/kit/ui";

export interface TestingTelemetryBadgeProps {
  /** The figures (`stats`: a value set large and the label that completes it, three is the norm) and the `reference` sentence. */
  telemetry: RoundupGuide["telemetry"];
  /** The card’s label. Default “How we tested”. */
  heading?: string;
  /** The method section’s anchor. Default `#methodology`. */
  methodHref?: string;
  /** The jump’s label. Default “Read the full method”. */
  methodLabel?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The testing summary card: what was tested, how much, against what
 * reference. A micro-caps label, the figures in the display serif, the
 * reference sentence, and a jump to the full method further down the page.
 *
 * **Use it for** the article header (`EditorialArticleHeader` includes it)
 * or the top of a lab page. **Not for** a product’s own results
 * (`Scorecard`) or the method itself (`MethodologyAccordion`); its figures
 * are not repeated there.
 *
 * @summary The testing summary card: how much was tested, against what, with a jump to the method.
 * @import import { TestingTelemetryBadge } from "@/kit/blocks";
 */
export function TestingTelemetryBadge({ telemetry, heading = "How we tested", methodHref = "#methodology", methodLabel = "Read the full method", className }: TestingTelemetryBadgeProps) {
  return (
    <aside data-slot="testing-summary" aria-labelledby="testing-summary-heading" className={cn("@container kit-card p-6", className)}>
      <Eyebrow as="h2" id="testing-summary-heading">
        {heading}
      </Eyebrow>
      <dl className="m-0 mt-5 grid gap-x-4 gap-y-5 @2xs:grid-cols-3">
        {telemetry.stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1">
            <dt className="order-last t-small text-fg-muted">{stat.label}</dt>
            <dd data-numeric className="m-0 t-stat text-fg">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <p className="m-0 mt-6 border-t border-line pt-4 t-small text-fg-body">{telemetry.reference}</p>
      <JumpLink href={methodHref} className="mt-1">
        {methodLabel}
      </JumpLink>
    </aside>
  );
}
