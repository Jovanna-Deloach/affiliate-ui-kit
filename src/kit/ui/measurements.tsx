import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { typeset } from "@/kit/lib/typeset";
import type { Measurements } from "@/kit/types";

/**
 * Bench and lab measurements as data graphics. Geometry here is data (a
 * stack wedge drawn to scale, bars against a test average), never a
 * drawing of the product.
 */

type Timing = Extract<Measurements, { kind: "timing" }>;
type Biomech = Extract<Measurements, { kind: "biomech" }>;
const NB = " ";
const signed = (v: number, digits = 1) => `${v > 0 ? "+" : v < 0 ? "−" : "±"}${Math.abs(v).toFixed(digits)}`;

function Module({ id, title, aside, children, className }: { id: string; title: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section data-slot="measurements" aria-labelledby={id} className={cn("@container overflow-hidden rounded-box border border-line bg-paper", className)}>
      {/* The aside drops under the title when both do not fit, instead of each wrapping in half. */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 border-b border-line px-5 py-3">
        <h3 id={id} className="m-0 t-ui font-semibold text-fg">
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

/** Watches: rate in six positions, diverging from zero, over the chronometer tolerance band. */
export function TimingStrip({ m, id }: { m: Timing; id: string }) {
  const lo = -6;
  const hi = 12;
  const at = (v: number) => ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * 100;
  const zero = at(0);
  const mean = m.positions.reduce((a, p) => a + p.rate, 0) / m.positions.length;
  const anyOut = m.positions.some((p) => p.rate < m.tolerance[0] || p.rate > m.tolerance[1]);
  return (
    <Module
      id={id}
      title="Timing in six positions"
      aside={
        <p className="m-0 t-small text-fg-muted">
          Mean{" "}
          <span data-numeric className="t-figure text-fg">
            {signed(mean)}
            {NB}s/day
          </span>
        </p>
      }
    >
      <dl className="m-0 grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)_2.75rem] items-center gap-x-3 gap-y-2.5 px-5 py-4">
        {m.positions.map((p) => {
          const out = p.rate < m.tolerance[0] || p.rate > m.tolerance[1];
          return (
            <div key={p.label} className="contents">
              <dt className="t-small text-fg-muted">{p.label}</dt>
              <dd aria-hidden="true" className="relative m-0 h-3">
                <span className="absolute inset-y-0 bg-pass-soft" style={{ left: `${at(m.tolerance[0])}%`, width: `${at(m.tolerance[1]) - at(m.tolerance[0])}%` }} />
                <span className="absolute inset-y-0 w-px bg-fg-muted" style={{ left: `${zero}%` }} />
                <span
                  className={cn("absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full", out ? "bg-warn" : "bg-meter")}
                  style={p.rate >= 0 ? { left: `${zero}%`, width: `${at(p.rate) - zero}%` } : { left: `${at(p.rate)}%`, width: `${zero - at(p.rate)}%` }}
                />
              </dd>
              <dd data-numeric className="m-0 text-right t-small t-figure text-fg">
                {signed(p.rate)}
              </dd>
            </div>
          );
        })}
      </dl>
      <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 border-t border-line px-5 py-3 t-caption text-fg-muted">
        <li className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-4 bg-pass-soft" />
          Tolerance {signed(m.tolerance[0], 0)} to {signed(m.tolerance[1], 0)}
          {NB}s/day
        </li>
        {anyOut && (
          <li className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-4 rounded-full bg-warn" />
            Outside tolerance
          </li>
        )}
      </ul>
    </Module>
  );
}

function Versus({ label, value, display, average, averageLabel, max, better }: { label: string; value: number; display: string; average: number; averageLabel: string; max: number; better: "higher" | "lower" }) {
  const at = (v: number) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`;
  const ahead = better === "higher" ? value >= average : value <= average;
  return (
    <div className="flex flex-col bg-paper p-4">
      <p className="m-0 t-small text-fg-muted">{label}</p>
      <p className="m-0 mt-1 flex flex-wrap items-baseline justify-between gap-x-2">
        <span data-numeric className="t-figure-table text-fg">
          {display}
        </span>
        <span className="t-caption text-fg-muted">{averageLabel}</span>
      </p>
      <div aria-hidden="true" className="mt-auto pt-3">
        <div className="relative h-1.5 rounded-full bg-well">
          <span className={cn("absolute inset-y-0 left-0 rounded-full", ahead ? "bg-meter" : "bg-fg-muted")} style={{ width: at(value) }} />
          <span className="absolute -top-1 h-3.5 w-0.5 rounded-full bg-fg" style={{ left: at(average) }} />
        </div>
      </div>
    </div>
  );
}

/** Running shoes: stack and drop to scale, energy return, rebound lost and weight against the test average. */
export function BiomechMatrix({ m, id }: { m: Biomech; id: string }) {
  const drop = m.heelMm - m.forefootMm;
  const scale = 0.8;
  const base = 37;
  const hh = m.heelMm * scale;
  const fh = m.forefootMm * scale;
  return (
    <Module id={id} title="Cushioning and energy return" aside={<p className="m-0 t-small text-fg-muted">Against the test average</p>}>
      <div className="grid gap-px bg-line @sm:grid-cols-2">
        <div className="flex flex-col gap-2 bg-paper p-4">
          <p className="m-0 t-small text-fg-muted">Stack and drop</p>
          <svg viewBox="0 0 100 40" role="img" aria-label={typeset(`Stack ${m.heelMm} mm at the heel and ${m.forefootMm} mm at the forefoot, ${drop} mm drop`)} className="block h-auto w-full text-accent-category" fill="none" stroke="currentColor">
            <polygon points={`6,${base} 6,${base - hh} 94,${base - fh} 94,${base}`} className="fill-accent-category-soft" vectorEffect="non-scaling-stroke" strokeWidth={1} />
            <line x1="2" y1={base} x2="98" y2={base} className="text-fg-muted" vectorEffect="non-scaling-stroke" strokeWidth={0.75} />
            <line x1="6" y1={base - hh} x2="94" y2={base - hh} className="text-fg-muted" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" strokeWidth={0.75} />
          </svg>
          <div className="flex justify-between t-caption text-fg-muted">
            <span>
              Heel <span data-numeric className="text-fg">{m.heelMm}{NB}mm</span>
            </span>
            <span>
              <span data-numeric className="text-fg">{drop}{NB}mm</span> drop
            </span>
            <span>
              Fore <span data-numeric className="text-fg">{m.forefootMm}{NB}mm</span>
            </span>
          </div>
        </div>
        <Versus label="Energy return" value={m.energyReturn} display={`${m.energyReturn}%`} average={m.energyAverage} averageLabel={`Average ${m.energyAverage}%`} max={100} better="higher" />
        <Versus label={`Rebound lost at 300${NB}miles`} value={m.reboundLoss} display={`−${m.reboundLoss}%`} average={m.reboundAverage} averageLabel={`Average −${m.reboundAverage}%`} max={35} better="lower" />
        <Versus label="Weight, one shoe" value={m.weightOz} display={`${m.weightOz.toFixed(1)}${NB}oz`} average={m.weightAverage} averageLabel={`Average ${m.weightAverage.toFixed(1)}${NB}oz`} max={13} better="lower" />
      </div>
    </Module>
  );
}
