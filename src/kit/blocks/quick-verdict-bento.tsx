import { cn } from "@/lib/cn";
import { VerdictCard } from "@/kit/components";
import type { Pick } from "@/kit/types";
import type { AffiliateAttribution } from "@/types/affiliate";

export interface QuickVerdictBentoProps {
  /** The picks in order, the lead pick first. Only the first three are shown; picks 4+ belong in the comparison. */
  picks: Pick[];
  /** Each card’s jump to its deep dive: “Read the full review”. */
  jumpLabel: string;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** The section’s heading, read by screen readers only. Default “Our picks at a glance”. */
  heading?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The answer above the fold, as an asymmetric bento: the lead pick’s feature
 * card on seven columns, picks 2 and 3 as compact cards on five. One pick:
 * the feature card spans the width. Two: the compact card stands beside it
 * with its photograph on top. The feature card says why (its `verdict`),
 * compact cards say who (`bestFor`); neither repeats the deep dive. One
 * filled button, on the lead pick.
 *
 * **Use it for** the first section after the article header on a roundup,
 * a head-to-head or a single-product page. **Not for** more than three
 * picks (the comparison carries the rest) or a catalogue of every piece
 * (`AlsoGreatRail`).
 *
 * @summary The answer above the fold: the lead pick’s feature card beside up to two compact cards.
 * @import import { QuickVerdictBento } from "@/kit/blocks";
 */
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
