import { cn } from "@/lib/cn";
import type { RoundupGuide } from "@/kit/types";
import { Eyebrow, JumpLink } from "@/kit/ui";

/**
 * The testing summary card in the article header: what was tested, how
 * much, against what reference. A micro-caps label, the figures in the
 * display serif (hero figures), the reference sentence, and a link to the
 * full method further down the page.
 */
export interface TestingTelemetryBadgeProps {
  telemetry: RoundupGuide["telemetry"];
  heading?: string;
  methodHref?: string;
  methodLabel?: string;
  className?: string;
}

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
