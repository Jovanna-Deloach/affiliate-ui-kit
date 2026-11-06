import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { Measurements } from "@/kit/types";
import { badgeStyles, Eyebrow, Meter, Sep } from "@/kit/ui";

/*
 * What the bench or the lab measured, as compact telemetry inside the
 * scorecard. Never a chart in place of the product: the photograph shows
 * the object, these rows show the numbers. One block per category; `Telemetry`
 * picks it from a pick’s measurements. `AssayBadge` is the lab’s verdict,
 * set on the photograph.
 */

export type Timing = Extract<Measurements, { kind: "timing" }>;
export type Assay = Extract<Measurements, { kind: "assay" }>;
export type Biomech = Extract<Measurements, { kind: "biomech" }>;
const NB = " ";
const signed = (v: number, digits = 1) => `${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(v).toFixed(digits)}`;
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

function Block({ label, detail, aside, children }: { label: string; detail?: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <div data-slot="telemetry" className="mt-5 border-t border-line pt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Eyebrow items={detail ? [label, detail] : [label]} />
        {aside}
      </div>
      {children}
    </div>
  );
}

export interface ChronometerStripProps {
  /** Timing measurements (`kind: "timing"`): the rate in each position and the tolerance band. */
  measurements: Timing;
}

/**
 * Watches: the rate in six positions as ticks on one line, over the
 * chronometer tolerance band in the category accent, with a scale and the
 * mean. A position outside the band is set in the warning tone and counted.
 *
 * @summary Watch timing: six positions over the chronometer band, with the mean.
 * @import import { ChronometerStrip } from "@/kit/components";
 */
export function ChronometerStrip({ measurements: m }: ChronometerStripProps) {
  const lo = -6;
  const hi = 12;
  const at = (v: number) => `${((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * 100}%`;
  const outside = (rate: number) => rate < m.tolerance[0] || rate > m.tolerance[1];
  const avg = mean(m.positions.map((p) => p.rate));
  const out = m.positions.filter((p) => outside(p.rate)).length;
  return (
    <Block
      label="Chronometer"
      detail={`${m.positions.length} positions`}
      aside={
        <p className="m-0 t-small text-fg-muted">
          Mean{" "}
          <span data-numeric className="t-figure text-fg">
            {signed(avg)}
            {NB}s/day
          </span>
        </p>
      }
    >
      <div aria-hidden="true" className="relative mt-4 h-5">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line-strong" />
        <span className="absolute inset-y-0.5 rounded-ctl bg-telemetry/25" style={{ left: at(m.tolerance[0]), width: `calc(${at(m.tolerance[1])} - ${at(m.tolerance[0])})` }} />
        <span className="absolute inset-y-0 w-px bg-fg-muted" style={{ left: at(0) }} />
        {m.positions.map((p) => (
          <span
            key={p.label}
            className={cn("absolute top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full", outside(p.rate) ? "bg-warn" : "bg-meter")}
            style={{ left: at(p.rate) }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="relative mt-1 h-4 t-micro-sm text-fg-muted">
        {[m.tolerance[0], 0, m.tolerance[1]].map((v) => (
          <span key={v} data-numeric className="absolute top-0 -translate-x-1/2" style={{ left: at(v) }}>
            {v === 0 ? "0" : signed(v, 0)}
          </span>
        ))}
      </div>
      <p className="m-0 mt-2 t-caption text-fg-muted">
        {out === 0 ? `All ${m.positions.length} inside` : <span className="text-warn">{`${out} of ${m.positions.length} outside`}</span>} the {signed(m.tolerance[0], 0)} to {signed(m.tolerance[1], 0)}
        {NB}s/day band
      </p>
    </Block>
  );
}

function Row({ label, value, max, mark, tone, figure }: { label: string; value: number; max: number; mark?: number; tone: "telemetry" | "warn" | "fail" | "muted"; figure: ReactNode }) {
  return (
    <div className="contents">
      <dt className="t-small text-fg-muted">{label}</dt>
      <dd className="m-0">
        <Meter value={value} max={max} mark={mark} tone={tone} />
      </dd>
      <dd data-numeric className="m-0 text-right whitespace-nowrap t-small">
        {figure}
      </dd>
    </div>
  );
}

const rows = "m-0 mt-3 grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5";

export interface MetalRowsProps {
  /** Assay measurements (`kind: "assay"`): each metal in ppb against its limit. */
  measurements: Assay;
}

/**
 * Supplements: heavy metals as a share of each limit, lower is better. The
 * bar turns to the warning tone from half the limit and to fail above it;
 * the figure beside it prints the ppb and the limit.
 *
 * @summary Heavy metals in ppb, each as a share of its limit.
 * @import import { MetalRows } from "@/kit/components";
 */
export function MetalRows({ measurements: m }: MetalRowsProps) {
  return (
    <Block label="Heavy metals" detail="ppb" aside={<p className="m-0 t-caption text-fg-muted">Bar: share of the limit</p>}>
      <dl className={rows}>
        {m.metals.map((metal) => {
          const share = metal.ppb / metal.limitPpb;
          return (
            <Row
              key={metal.label}
              label={metal.label}
              value={metal.ppb}
              max={metal.limitPpb}
              tone={share > 1 ? "fail" : share >= 0.5 ? "warn" : "telemetry"}
              figure={
                <>
                  <span className={cn("t-figure", share > 1 ? "text-fail" : "text-fg")}>{metal.ppb.toLocaleString("en-US")}</span>
                  <span className="text-fg-muted">
                    {NB}/ {metal.limitPpb.toLocaleString("en-US")}
                  </span>
                </>
              }
            />
          );
        })}
      </dl>
    </Block>
  );
}

export interface BenchRowsProps {
  /** Bench measurements (`kind: "biomech"`): energy return, rebound loss, weight and stack, with the test averages. */
  measurements: Biomech;
}

/**
 * Running shoes: energy return, loss at 300 miles and weight against the
 * test average (the tick on each meter), muted when worse than average, then
 * the stack and drop.
 *
 * @summary Running-shoe bench results against the test average.
 * @import import { BenchRows } from "@/kit/components";
 */
export function BenchRows({ measurements: m }: BenchRowsProps) {
  const drop = m.heelMm - m.forefootMm;
  return (
    <Block label="Bench tests" detail="vs. test average">
      <dl className={rows}>
        <Row label="Energy return" value={m.energyReturn} max={100} mark={m.energyAverage} tone={m.energyReturn >= m.energyAverage ? "telemetry" : "muted"} figure={<span className="t-figure text-fg">{m.energyReturn}%</span>} />
        <Row
          label={`Loss at 300${NB}mi`}
          value={m.reboundLoss}
          max={35}
          mark={m.reboundAverage}
          tone={m.reboundLoss <= m.reboundAverage ? "telemetry" : "muted"}
          figure={<span className="t-figure text-fg">−{m.reboundLoss}%</span>}
        />
        <Row
          label="Weight"
          value={m.weightOz}
          max={13}
          mark={m.weightAverage}
          tone={m.weightOz <= m.weightAverage ? "telemetry" : "muted"}
          figure={
            <span className="t-figure text-fg">
              {m.weightOz.toFixed(1)}
              {NB}oz
            </span>
          }
        />
      </dl>
      <p className="m-0 mt-3 t-caption text-fg-muted">
        Stack{" "}
        <span data-numeric className="text-fg">
          {m.heelMm} / {m.forefootMm}
          {NB}mm
        </span>
        , drop{" "}
        <span data-numeric className="text-fg">
          {drop}
          {NB}mm
        </span>
      </p>
    </Block>
  );
}

export interface TelemetryProps {
  /** A pick’s measurements; `kind` (`timing`, `assay`, `biomech`) picks the block. */
  measurements: Measurements;
}

/**
 * What the bench or the lab measured, as compact rows inside a `Scorecard`:
 * the right block for the measurements’ kind. Watches get the chronometer
 * strip, supplements the heavy-metal rows, running shoes the bench rows.
 *
 * **Use it for** the numbers under a review’s score, as the scorecard’s
 * children. **Not for** a chart in place of the product’s photograph, or a
 * comparison across products (`ComparisonMatrix`).
 *
 * @summary The category’s measurements under a score: timing, heavy metals or bench results.
 * @import import { Telemetry } from "@/kit/components";
 */
export function Telemetry({ measurements }: TelemetryProps) {
  if (measurements.kind === "timing") return <ChronometerStrip measurements={measurements} />;
  if (measurements.kind === "assay") return <MetalRows measurements={measurements} />;
  return <BenchRows measurements={measurements} />;
}

export interface AssayBadgeProps {
  /** Assay measurements (`kind: "assay"`): the runs give the label claim; checks, metals and claim give the verdict. */
  measurements: Assay;
  /** Position it on the photograph: `absolute bottom-4 left-4`. */
  className?: string;
}

/**
 * The lab’s verdict on the photograph: a frosted stamp, “ISO 17025 · 100.4%
 * label claim · Pass”. It passes only when no check fails, every metal is
 * within its limit and the claim is between 95% and 110%. Inside a frame
 * under 24rem wide the accreditation is left to screen readers, so the stamp
 * stays on one line.
 *
 * **Use it for** a lab-tested supplement’s review photograph, as an overlay
 * of `PickMedia`. **Not for** products without an assay or for a result in a
 * table (`ResultMark`).
 *
 * @summary The lab’s pass or fail stamp on a supplement’s photograph.
 * @import import { AssayBadge } from "@/kit/components";
 */
export function AssayBadge({ measurements: m, className }: AssayBadgeProps) {
  const claim = mean(m.runs);
  const pass = m.checks.every((c) => c.status !== "fail") && m.metals.every((x) => x.ppb <= x.limitPpb) && claim >= 95 && claim <= 110;
  return (
    <p data-slot="assay-badge" className={cn("m-0", badgeStyles({ variant: "frosted", size: "sm" }), "gap-0", className)}>
      <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" className="mr-1.5 shrink-0 text-accent-category-ink" />
      <span className="sr-only @sm:not-sr-only">
        ISO 17025
        <Sep />
      </span>
      <span data-numeric>{claim.toFixed(1)}%</span>
      {NB}label claim
      <Sep />
      <span className={pass ? "text-pass" : "text-fail"}>{pass ? "Pass" : "Fail"}</span>
    </p>
  );
}
