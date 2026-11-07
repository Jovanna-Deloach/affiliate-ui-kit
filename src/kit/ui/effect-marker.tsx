import { ArrowDownUp, Minus, TrendingDown, TrendingUp } from "lucide-react";

import { effectWords } from "@/kit/lib/evidence";
import type { Effect, EffectSize } from "@/kit/types";
import { cn } from "@/lib/cn";

const ICON = { increase: TrendingUp, decrease: TrendingDown, none: Minus, mixed: ArrowDownUp } as const;

export interface EffectMarkerProps {
  /** Which way the outcome moved: `increase`, `decrease`, `none`, or `mixed` (both ways across studies). */
  effect: Effect;
  /** How much: `small`, `moderate` or `large`. Leave out for `none` and `mixed`. */
  size?: EffectSize;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Which way an outcome moved in the research, as an icon and words:
 * “Moderate increase”, “Small decrease”, “No effect”, “Mixed results”. Set
 * in ink, not in a pass or fail tone: whether a rise is good depends on the
 * outcome, and the grade beside it says how sure the research is.
 *
 * **Use it for** an outcome’s effect in the evidence table and on a study
 * card. **Not for** how strong the evidence is (`GradeBadge`), or a lab
 * result (`ResultMark`).
 *
 * @summary Which way an outcome moved, and how much, as an icon and words.
 * @import import { EffectMarker } from "@/kit/ui";
 */
export function EffectMarker({ effect, size, className }: EffectMarkerProps) {
  const Icon = ICON[effect];
  return (
    <span className={cn("inline-flex items-center gap-1.5 t-small text-fg", className)}>
      <Icon aria-hidden="true" size={16} strokeWidth={2} className="shrink-0 text-fg-muted" />
      {effectWords(effect, size)}
    </span>
  );
}
