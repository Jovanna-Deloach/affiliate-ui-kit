import * as Progress from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatScore } from "@/lib/format";
import type { SubScoreItem } from "@/types/affiliate";

/**
 * <ScoreMeter />
 * ---------------------------------------------------------------------------
 * Composite rating with Figure-Ground separation between the VERDICT and
 * the EVIDENCE:
 *
 *   ┌──────────────────────────────────────────────┐
 *   │ recessed verdict zone (--surface-recessed)    │  hero numeral in the
 *   │ 9.2  OVERALL SCORE · Exceptional · Top 5%     │  display voice +
 *   │ ▮▮▮▮▮▮▮▮▮▯  master gauge (10 blocks)          │  segmented gauge
 *   ├──────────────────────────────────────────────┤  hairline
 *   │ evidence zone (--surface-primary)             │  110px | 1fr | 36px
 *   │ Cushioning   ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬  9.6     │  recessed wells,
 *   │ Stability    ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬     8.7     │  ink/80 fill
 *   └──────────────────────────────────────────────┘
 *
 *   --keyline-subscore / --keyline-value   evidence grid tracks
 *   --size-track / --size-track-hero       well thickness (8px) / gauge (10px)
 *   --meter-fill / --meter-track           subordinate ink
 *   --text-hero-metric + --font-display    the verdict numeral
 *
 * Visuals
 *   scorecard   two-zone card (default)
 *   radial      verdict as a ring beside its label — asides, tiles
 *   inline-bar  96px proportion bar + numeral — ranked lists
 *   compact     numeral + "/ 10" lockup — captions, dense cells
 *
 * Every numeral is formatScore()'d ("9.0", never "9"). Server Component;
 * Radix Progress carries the ARIA, mechanics.css animates the fill.
 */

const meterVariants = cva("min-w-0", {
  variants: {
    visual: {
      scorecard: "w-full overflow-hidden rounded-container border border-hairline bg-surface shadow-surface",
      radial: "flex flex-wrap items-center gap-x-stack gap-y-cluster",
      "inline-bar": "flex items-center gap-cluster",
      compact: "flex items-baseline gap-hairline",
    },
  },
  defaultVariants: { visual: "scorecard" },
});

export interface ScoreMeterProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof meterVariants> {
  score: number;
  maxScore?: number;
  /** Composite label, e.g. "Overall score" or "Lab score". */
  label?: ReactNode;
  /** Verdict copy ("Exceptional · Top 5%"); derived from the score when omitted. */
  verdict?: ReactNode;
  subScores?: SubScoreItem[];
  /** Print each sub-score weight ("× 0.30"). */
  showWeights?: boolean;
  /** Number of blocks in the master gauge. */
  segments?: number;
  decimals?: number;
}

export function ScoreMeter({
  score,
  maxScore = 10,
  label = "Overall score",
  verdict,
  subScores,
  showWeights = false,
  segments = 10,
  decimals = 1,
  visual = "scorecard",
  className,
  ...props
}: ScoreMeterProps) {
  const pct = clampPct((score / maxScore) * 100);
  const numeral = formatScore(score, decimals);
  const valueText = `${numeral} out of ${maxScore}`;
  const verdictText = verdict ?? verdictFor(pct);
  const resolvedVisual = visual ?? "scorecard";

  return (
    <div
      data-slot="score-meter"
      data-visual={resolvedVisual}
      className={cn(meterVariants({ visual: resolvedVisual }), className)}
      {...props}
    >
      {resolvedVisual === "inline-bar" ? (
        <>
          {label && <span className="type-eyebrow min-w-0 truncate text-ink-tertiary">{label}</span>}
          <Track pct={pct} valueText={valueText} className="w-inline-meter" />
          <span className="type-metric w-value shrink-0 text-right text-body-sm text-ink">{numeral}</span>
        </>
      ) : resolvedVisual === "compact" ? (
        <>
          <span className="type-metric text-title text-ink">{numeral}</span>
          <span className="text-caption tabular-nums text-ink-tertiary">/ {maxScore}</span>
          {label && <span className="ml-hairline type-eyebrow text-ink-tertiary">{label}</span>}
        </>
      ) : resolvedVisual === "radial" ? (
        <>
          <RadialRing pct={pct} valueText={valueText}>
            <span className="type-hero-metric [font-size:var(--text-title)]">{numeral}</span>
          </RadialRing>
          <div className="flex min-w-0 flex-col gap-hairline">
            <span className="type-eyebrow truncate text-ink-tertiary">{label}</span>
            <span className="text-body-sm text-ink-secondary">{verdictText}</span>
          </div>
        </>
      ) : (
        <>
          {/* Verdict zone — figure */}
          <div data-slot="verdict-zone" className="flex flex-col gap-stack border-b border-hairline bg-recessed p-well">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-end gap-x-stack">
              <span className="flex items-baseline gap-[0.3em]">
                <span className="type-hero-metric text-ink">{numeral}</span>
                <span className="text-caption tabular-nums text-ink-tertiary">/ {maxScore}</span>
              </span>
              <div className="flex min-w-0 flex-col gap-hairline pb-[0.15em]">
                <span className="type-eyebrow truncate text-ink-tertiary">{label}</span>
                <span className="truncate text-body-sm text-ink-secondary">{verdictText}</span>
              </div>
            </div>
            <MasterGauge pct={pct} segments={segments} valueText={valueText} />
          </div>

          {/* Evidence zone — ground */}
          {subScores && subScores.length > 0 && (
            <dl data-slot="evidence-zone" className="m-0 flex flex-col gap-cluster p-well">
              {subScores.map((s) => {
                const max = s.maxScore ?? maxScore;
                const subPct = clampPct((s.score / max) * 100);
                return (
                  <div
                    key={s.label}
                    data-slot="sub-score"
                    className="grid grid-cols-[var(--keyline-subscore)_minmax(0,1fr)_var(--keyline-value)] items-center gap-x-stack"
                  >
                    <dt className="flex min-w-0 items-baseline gap-[0.5em] text-body-sm text-ink-secondary">
                      <span className="min-w-0 truncate">{s.label}</span>
                      {showWeights && s.weight !== undefined && (
                        <span className="shrink-0 text-caption tabular-nums text-ink-tertiary">× {s.weight.toFixed(2)}</span>
                      )}
                    </dt>
                    <Track pct={subPct} valueText={`${formatScore(s.score, decimals)} out of ${max}`} />
                    <dd className="type-metric m-0 text-right text-body-sm text-ink">{formatScore(s.score, decimals)}</dd>
                  </div>
                );
              })}
            </dl>
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
}

export function verdictFor(pct: number): string {
  if (pct >= 92) return "Exceptional · Top 5%";
  if (pct >= 85) return "Excellent · Top 15%";
  if (pct >= 75) return "Very good";
  if (pct >= 60) return "Good";
  if (pct >= 45) return "Fair";
  return "Below average";
}

/** Recessed well + ink/80 fill — the subordinate evidence voice. */
function Track({ pct, valueText, className }: { pct: number; valueText: string; className?: string }) {
  return (
    <Progress.Root
      value={pct}
      max={100}
      getValueLabel={() => valueText}
      className={cn("h-track shrink-0 overflow-hidden rounded-pill bg-meter-track", className)}
    >
      <Progress.Indicator className="meter-fill h-full rounded-pill bg-meter-fill" style={{ "--pct": pct } as CSSProperties} />
    </Progress.Root>
  );
}

/** Ten-block master gauge — the verdict voice, thicker and solid ink. */
function MasterGauge({ pct, segments, valueText }: { pct: number; segments: number; valueText: string }) {
  const filled = (pct / 100) * segments;
  return (
    <Progress.Root
      value={pct}
      max={100}
      getValueLabel={() => valueText}
      data-slot="master-gauge"
      className="flex h-track-hero w-full gap-hairline"
    >
      {Array.from({ length: segments }, (_, i) => {
        const fill = clampPct((filled - i) * 100);
        return (
          <span key={i} className="relative h-full min-w-0 flex-1 overflow-hidden rounded-pill bg-meter-track">
            <Progress.Indicator className="meter-fill absolute inset-y-0 left-0 bg-ink" style={{ "--pct": fill } as CSSProperties} />
          </span>
        );
      })}
    </Progress.Root>
  );
}

function RadialRing({ pct, valueText, children }: { pct: number; valueText: string; children: ReactNode }) {
  return (
    <Progress.Root
      value={pct}
      max={100}
      getValueLabel={() => valueText}
      data-slot="radial-ring"
      className="relative grid size-ring shrink-0 place-items-center"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx={50} cy={50} r={45} fill="none" stroke="var(--meter-track)" strokeWidth={6} />
        <circle
          cx={50}
          cy={50}
          r={45}
          fill="none"
          stroke="var(--ink-primary)"
          strokeWidth={6}
          strokeLinecap="butt"
          pathLength={100}
          className="meter-ring"
          style={{ "--pct": pct } as CSSProperties}
        />
      </svg>
      <Progress.Indicator asChild>
        <span className="relative text-ink">{children}</span>
      </Progress.Indicator>
    </Progress.Root>
  );
}

export { meterVariants as scoreMeterVariants };
