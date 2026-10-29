import * as Progress from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatScore } from "@/lib/format";
import type { SubScoreItem } from "@/types/affiliate";

/**
 * <ScoreMeter />
 * ---------------------------------------------------------------------------
 * Composite rating (tabular-nums) + weighted sub-score bars on Radix Progress.
 *
 *   --text-metric / --font-mono / --weight-metric   composite numeral voice
 *   --size-meter                                     bar thickness
 *   --color-meter-track / --color-meter-fill         bar ink
 *   --radius-badge                                   bar / segment corners
 *   --duration-reveal / --ease-spring                one-shot fill entrance
 *
 * Mobbin anatomy (Turo + Tripadvisor rating breakdowns, Etsy radial rings,
 * RTINGS scorecards): composite numeral stays large; sub-scores are a
 * three-column grid — label | bar | value — that collapses to label-over-bar
 * at 375 px. Weights, when shown, read as "× 0.30" in the mono voice.
 *
 * 21st.dev physics: circular-progress ring (dasharray/offset) reduced to
 * `pathLength=100` + the `meter-ring` / `meter-fill` @starting-style
 * transitions in mechanics.css. No framer, no state — Server Component.
 */

const meterVariants = cva("@container flex min-w-0 flex-col", {
  variants: {
    visual: {
      "segmented-bar": "gap-row-pad",
      "minimal-fraction": "gap-cluster-gap",
      "radial-ring": "gap-row-pad",
      "tabular-row": "gap-0",
    },
  },
  defaultVariants: { visual: "segmented-bar" },
});

export interface ScoreMeterProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof meterVariants> {
  score: number;
  maxScore?: number;
  /** Composite label, e.g. "Overall" or "Lab score". */
  label?: ReactNode;
  subScores?: SubScoreItem[];
  /** Print each sub-score weight ("× 0.30"). */
  showWeights?: boolean;
  /** Number of segments for `segmented-bar`. */
  segments?: number;
  decimals?: number;
}

export function ScoreMeter({
  score,
  maxScore = 10,
  label = "Overall",
  subScores,
  showWeights = false,
  segments = 10,
  decimals = 1,
  visual = "segmented-bar",
  className,
  ...props
}: ScoreMeterProps) {
  const pct = clampPct((score / maxScore) * 100);
  const valueText = `${formatScore(score, decimals)} out of ${maxScore}`;

  return (
    <div
      data-slot="score-meter"
      data-visual={visual}
      className={cn(meterVariants({ visual }), className)}
      {...props}
    >
      {visual === "radial-ring" ? (
        // Ring beside its label; stacks when the container is narrower than 14rem (2-up 375 tiles).
        <div className="flex flex-col gap-cluster-gap @min-[14rem]:flex-row @min-[14rem]:items-center @min-[14rem]:gap-row-pad">
          <RadialRing pct={pct} valueText={valueText}>
            <span className="type-metric">{formatScore(score, decimals)}</span>
          </RadialRing>
          <div className="flex min-w-0 flex-col gap-[0.25em]">
            <span className="type-eyebrow truncate text-muted">{label}</span>
            <span className="type-label-mono whitespace-nowrap text-muted">out of {maxScore}</span>
          </div>
        </div>
      ) : visual === "tabular-row" ? (
        <MeterRow
          label={label}
          pct={pct}
          value={formatScore(score, decimals)}
          valueText={valueText}
          emphasis
        />
      ) : (
        <div className="flex min-w-0 flex-col gap-cluster-gap">
          <div className="flex items-baseline justify-between gap-cluster-gap">
            <span className="type-eyebrow text-muted">{label}</span>
            <span className="flex items-baseline gap-[0.3em]">
              <span className="type-metric">{formatScore(score, decimals)}</span>
              <span className="type-label-mono text-muted">/ {maxScore}</span>
            </span>
          </div>
          {visual === "segmented-bar" && (
            <SegmentedBar pct={pct} segments={segments} valueText={valueText} />
          )}
        </div>
      )}

      {subScores && subScores.length > 0 && (
        <dl
          data-slot="sub-scores"
          className={cn(
            "m-0 flex min-w-0 flex-col",
            visual === "minimal-fraction" ? "flex-row flex-wrap gap-x-row-pad gap-y-[0.35em]" : "gap-[0.5em]",
            visual === "tabular-row" && "gap-0",
          )}
        >
          {subScores.map((s) => {
            const max = s.maxScore ?? maxScore;
            const subPct = clampPct((s.score / max) * 100);
            const text = `${formatScore(s.score, decimals)} out of ${max}`;
            if (visual === "minimal-fraction") {
              return (
                <div key={s.label} className="flex items-baseline gap-[0.4em]">
                  <dt className="type-label-mono text-muted">{s.label}</dt>
                  <dd className="m-0 font-mono text-sm font-weight-metric tabular-nums">
                    {formatScore(s.score, decimals)}
                  </dd>
                </div>
              );
            }
            return (
              <MeterRow
                key={s.label}
                label={s.label}
                pct={subPct}
                value={formatScore(s.score, decimals)}
                valueText={text}
                weight={showWeights ? s.weight : undefined}
                asDefinition
              />
            );
          })}
        </dl>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

function clampPct(n: number) {
  return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
}

function SegmentedBar({
  pct,
  segments,
  valueText,
}: {
  pct: number;
  segments: number;
  valueText: string;
}) {
  const filled = (pct / 100) * segments;
  return (
    <Progress.Root
      value={pct}
      max={100}
      getValueLabel={() => valueText}
      data-slot="segmented-bar"
      className="flex h-meter w-full gap-[2px]"
    >
      {Array.from({ length: segments }, (_, i) => {
        const fill = clampPct((filled - i) * 100);
        return (
          <span
            key={i}
            className="relative h-full min-w-0 flex-1 overflow-hidden rounded-badge bg-meter-track"
          >
            <Progress.Indicator
              className="meter-fill absolute inset-y-0 left-0 bg-meter-fill"
              style={{ "--pct": fill } as CSSProperties}
            />
          </span>
        );
      })}
    </Progress.Root>
  );
}

function MeterRow({
  label,
  pct,
  value,
  valueText,
  weight,
  emphasis = false,
  asDefinition = false,
}: {
  label: ReactNode;
  pct: number;
  value: string;
  valueText: string;
  weight?: number;
  emphasis?: boolean;
  asDefinition?: boolean;
}) {
  const Label = asDefinition ? "dt" : "span";
  const Value = asDefinition ? "dd" : "span";
  return (
    <div
      data-slot="meter-row"
      className={cn("@container min-w-0", emphasis && "border-b-surface-w border-border pb-[0.6em] mb-[0.6em]")}
    >
     <div
      className={cn(
        "grid min-w-0 items-center gap-x-cluster-gap gap-y-[0.25em]",
        "grid-cols-[minmax(0,1fr)_auto] @sm:grid-cols-[minmax(6rem,0.4fr)_minmax(0,1fr)_auto]",
      )}
     >
      <Label
        className={cn(
          "min-w-0 truncate",
          emphasis ? "type-eyebrow text-muted" : "text-sm text-muted",
        )}
      >
        {label}
        {weight !== undefined && (
          <span className="type-label-mono ml-[0.6em] text-muted">× {weight.toFixed(2)}</span>
        )}
      </Label>
      <Value
        className={cn(
          "m-0 justify-self-end tabular-nums",
          emphasis ? "type-metric" : "font-mono text-sm font-weight-metric",
        )}
      >
        {value}
      </Value>
      <Progress.Root
        value={pct}
        max={100}
        getValueLabel={() => valueText}
        className="col-span-2 h-meter w-full overflow-hidden rounded-badge bg-meter-track @sm:col-span-1 @sm:col-start-2 @sm:row-start-1"
      >
        <Progress.Indicator
          className="meter-fill h-full rounded-badge bg-meter-fill"
          style={{ "--pct": pct } as CSSProperties}
        />
      </Progress.Root>
     </div>
    </div>
  );
}

function RadialRing({
  pct,
  valueText,
  children,
}: {
  pct: number;
  valueText: string;
  children: ReactNode;
}) {
  return (
    <Progress.Root
      value={pct}
      max={100}
      getValueLabel={() => valueText}
      data-slot="radial-ring"
      className="relative grid size-[calc(var(--size-seal)*1.1)] shrink-0 place-items-center"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx={50} cy={50} r={45} fill="none" stroke="var(--color-meter-track)" strokeWidth={6} />
        <circle
          cx={50}
          cy={50}
          r={45}
          fill="none"
          stroke="var(--color-meter-fill)"
          strokeWidth={6}
          strokeLinecap="butt"
          pathLength={100}
          className="meter-ring"
          style={{ "--pct": pct } as CSSProperties}
        />
      </svg>
      <Progress.Indicator asChild>
        <span className="relative">{children}</span>
      </Progress.Indicator>
    </Progress.Root>
  );
}

export { meterVariants as scoreMeterVariants };
