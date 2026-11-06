import { cn } from "@/lib/cn";
import { VerdictCard } from "@/kit/components";
import type { Pick } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

/**
 * The answer, above the fold, as an asymmetric bento on the toned ground.
 *
 *   ┌ 7 columns ─────────────────────────┐ ┌ 5 columns ─────────────┐
 *   │ VerdictCard, feature                │ │ VerdictCard, compact   │
 *   │                                     │ ├────────────────────────┤
 *   │                                     │ │ VerdictCard, compact   │
 *   └─────────────────────────────────────┘ └────────────────────────┘
 *
 * Three cards at most: picks 4+ are in the comparison table, not in a box
 * of leftovers. One pick: the feature card spans the width (`wide`). Two:
 * the compact card stands beside it with its photograph on top
 * (`stacked`). The hero says why (verdict); compact cards say who (best
 * for); neither repeats the deep dive. One filled button, on the hero.
 */
export interface QuickVerdictBentoProps {
  picks: Pick[];
  jumpLabel: string;
  attribution?: AffiliateAttribution;
  heading?: string;
  className?: string;
}

export function QuickVerdictBento({ picks, jumpLabel, attribution, heading = "Our picks at a glance", className }: QuickVerdictBentoProps) {
  const [hero, ...rest] = picks;
  if (!hero) return null;
  const stack = rest.slice(0, 2);
  return (
    <section data-slot="quick-verdict" aria-labelledby="quick-verdict-heading" className={cn("@container", className)}>
      <h2 id="quick-verdict-heading" className="sr-only">
        {heading}
      </h2>
      <div className={cn("grid gap-4", stack.length > 0 && "@4xl:grid-cols-12")}>
        <VerdictCard
          pick={hero}
          jumpLabel={jumpLabel}
          attribution={attribution}
          wide={stack.length === 0}
          className={cn(stack.length > 0 && "@4xl:col-span-7", stack.length === 2 && "@4xl:row-span-2")}
        />
        {stack.map((pick) => (
          <VerdictCard key={pick.product.id} variant="compact" pick={pick} jumpLabel={jumpLabel} attribution={attribution} stacked={stack.length === 1} className="@4xl:col-span-5" />
        ))}
      </div>
    </section>
  );
}
