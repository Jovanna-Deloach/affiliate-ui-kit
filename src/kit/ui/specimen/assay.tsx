import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";
import { typeset } from "@/kit/lib/typeset";
import type { Measurements } from "@/kit/types";

import { ResultMark } from "../marks";
import { type Detail, SpecimenFrame, r2, seeded, stroke } from "./frame";

/**
 * SUPPLEMENT ASSAY — the certificate of analysis as a data graphic: every
 * HPLC run overlaid on the acceptance window (95–110% of the label claim),
 * the measured dose against its window, heavy metals in parts per billion
 * against their limits, and the remaining checks. Drawn from the lab’s
 * numbers, so no two products share it.
 */

type Assay = Extract<Measurements, { kind: "assay" }>;
const NB = " ";
const RESULT_WORD = { pass: "Pass", caution: "Near limit", fail: "Fail" } as const;

/**
 * The chromatogram in a 100 × h box: runs, window, 100% line. Every stroke is
 * non-scaling, so the card variant can stretch to any box (time runs along x;
 * stretching it distorts nothing). The apex dot is drawn only where the box
 * keeps its ratio.
 */
function Chromatogram({ m, seed, w = 100, h = 40, pad = 4, apex: showApex = true }: { m: Assay; seed: string; w?: number; h?: number; pad?: number; apex?: boolean }) {
  const rand = seeded(seed);
  const x0 = pad;
  const x1 = w - pad;
  const base = h - pad;
  const height = (h - pad * 2) * 0.78;
  const mu = x0 + (x1 - x0) * 0.32;
  const y = (share: number) => base - height * (share / 100);
  const gauss = (x: number, m0: number, sd: number) => Math.exp(-((x - m0) ** 2) / (2 * sd * sd));
  const phases = m.runs.map(() => [rand() * Math.PI * 2, rand() * Math.PI * 2] as const);
  const trace = (run: number, i: number) => {
    const [p1, p2] = phases[i]!;
    const shift = i * 0.35;
    const pts: string[] = [];
    for (let x = x0; x <= x1 + 1e-6; x += 0.25) {
      const minors = m.impurities.reduce((acc, amp, k) => acc + height * amp * gauss(x, x0 + (x1 - x0) * (0.55 + k * 0.13) + shift, 0.8), 0);
      const noise = 0.08 * Math.sin(x * 1.9 + p1) + 0.05 * Math.sin(x * 3.3 + p2);
      pts.push(`${r2(x)},${r2(Math.min(base, base - (height * (run / 100) * gauss(x, mu + shift, 1.15) + minors + noise + 0.2)))}`);
    }
    return pts.join(" ");
  };
  const mean = m.runs.reduce((a, b) => a + b, 0) / m.runs.length;
  const apex: [number, number] = [mu, y(mean) - 0.2];
  return (
    <>
      <rect x={x0} y={r2(y(110))} width={r2(x1 - x0)} height={r2(y(95) - y(110))} className="fill-accent-category" fillOpacity={0.12} stroke="none" />
      <line x1={x0} y1={r2(y(100))} x2={x1} y2={r2(y(100))} strokeDasharray="2 2" className="text-fg-muted" {...stroke.hair} />
      <polyline points={`${x0},${base} ${x1},${base}`} className="text-fg-muted" {...stroke.hair} />
      {m.runs.map((run, i) => (
        <polyline
          key={i}
          points={trace(run, i)}
          className="text-accent-category"
          strokeOpacity={i === 0 ? 1 : 0.7}
          strokeDasharray={i === 0 ? undefined : "1.6 1.2"}
          vectorEffect="non-scaling-stroke"
          strokeWidth={i === 0 ? 1.25 : 1}
        />
      ))}
      {showApex && <circle cx={r2(apex[0])} cy={r2(apex[1])} r={0.9} className="fill-accent-category" stroke="none" />}
    </>
  );
}

function Gauge({ share, tone }: { share: number; tone: "pass" | "caution" | "fail" }) {
  const fill = { pass: "bg-pass", caution: "bg-warn", fail: "bg-fail" }[tone];
  return (
    <span aria-hidden="true" className="relative block h-1.5 overflow-hidden rounded-full bg-paper">
      <span className={cn("absolute inset-y-0 left-0", fill)} style={{ width: `${Math.max(2, Math.min(100, share))}%` }} />
    </span>
  );
}

const unit = (m: Assay, v: number) => `${v.toFixed(2)}${NB}${m.claim.unit}`;

/** The measured dose on its acceptance window (4.75–5.50 g), with the window’s limits beneath. */
function ClaimBar({ m, labels = "always" }: { m: Assay; labels?: "always" | "wide" }) {
  const span = m.claim.high - m.claim.low;
  const lo = m.claim.low - span * 0.6;
  const hi = m.claim.high + span * 0.6;
  const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
  return (
    <>
      <div aria-hidden="true" className="relative mt-2 h-2 rounded-full bg-paper">
        <span className="absolute inset-y-0 rounded-full bg-accent-category/20" style={{ left: `${at(m.claim.low)}%`, width: `${at(m.claim.high) - at(m.claim.low)}%` }} />
        <span className="absolute -top-1 h-4 w-0.5 rounded-full bg-fg" style={{ left: `calc(${at(m.claim.measured)}% - 1px)` }} />
      </div>
      <div
        className={cn("mt-1 justify-between t-caption text-fg-muted", labels === "always" ? "flex" : "hidden @[13rem]:flex")}
        style={{ paddingLeft: `${at(m.claim.low) - 4}%`, paddingRight: `${100 - at(m.claim.high) - 4}%` }}
      >
        <span data-numeric>{unit(m, m.claim.low)}</span>
        <span data-numeric>{unit(m, m.claim.high)}</span>
      </div>
    </>
  );
}

export function assayHash(m: Assay) {
  const json = JSON.stringify(m);
  let h = 2166136261;
  for (let i = 0; i < json.length; i++) h = Math.imul(h ^ json.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
}

export interface AssayGraphicProps {
  measurements: Assay;
  productId: string;
  name: string;
  detail?: Detail;
  className?: string;
}

export function AssayGraphic({ measurements: m, productId, name, detail = "full", className }: AssayGraphicProps) {
  const hash = assayHash(m);
  const seed = `${productId}:${hash}`;
  const mean = m.runs.reduce((a, b) => a + b, 0) / m.runs.length;
  const label = typeset(`${name}: HPLC assay at ${mean.toFixed(1)}% of the label claim across ${m.runs.length} runs, inside the 95–110% acceptance window`);

  if (detail === "card") {
    // Fills the verdict card's well: certificate header (when there is room),
    // the chromatogram, the result and its window. No frame of its own: the
    // well it sits in is the container.
    return (
      <div
        data-slot="specimen"
        data-detail="card"
        data-specimen-hash={hash}
        data-product-id={productId}
        className={cn("@container kit-grid size-full overflow-hidden rounded-media bg-well", className)}
      >
        <div className="flex h-full flex-col justify-between gap-3 p-3 @[13rem]:p-5">
          <div className="hidden items-start justify-between gap-3 @[13rem]:flex">
            <p className="m-0 min-w-0">
              <span className="block t-caption font-semibold text-fg">Certificate of analysis</span>
              <span className="block t-caption text-fg-muted">Batch {m.batch}</span>
            </p>
            <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" className="shrink-0 text-pass" />
          </div>
          {/* The chart takes all the room the well has, in any shape of well. */}
          <div className="relative min-h-16 flex-1">
            <svg
              viewBox="0 0 100 90"
              preserveAspectRatio="none"
              role="img"
              aria-label={label}
              className="absolute inset-0 size-full text-fg-muted"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Chromatogram m={m} seed={seed} h={90} apex={false} />
            </svg>
          </div>
          <div>
            <p className="m-0 flex flex-wrap items-baseline justify-between gap-x-2">
              <span data-numeric className="t-figure-table text-fg @[13rem]:t-figure-xl">
                {mean.toFixed(1)}%
              </span>
              <span className="t-caption text-fg-muted">of label claim</span>
            </p>
            <ClaimBar m={m} labels="wide" />
          </div>
        </div>
      </div>
    );
  }

  if (detail === "thumb") {
    return (
      <SpecimenFrame w={60} h={60} detail={detail} hash={hash} productId={productId} label={label} tone="ink" className={className}>
        <g transform="translate(4 10) scale(0.52)">
          <Chromatogram m={m} seed={seed} w={100} h={76} />
        </g>
      </SpecimenFrame>
    );
  }

  const rows: ReactNode[] = m.metals.map((metal) => {
    const share = (metal.ppb / metal.limitPpb) * 100;
    const tone = share > 100 ? "fail" : share >= 50 ? "caution" : "pass";
    return (
      <div key={metal.label} className="contents">
        <dt className="t-small text-fg">{metal.label}</dt>
        <dd className="m-0 self-center">
          <Gauge share={share} tone={tone} />
        </dd>
        <dd data-numeric className="m-0 text-right whitespace-nowrap t-small">
          <span className="t-figure text-fg">{metal.ppb.toLocaleString("en-US")}</span>
          <span className="text-fg-muted">
            {NB}of {metal.limitPpb.toLocaleString("en-US")}
            {NB}ppb
          </span>
        </dd>
      </div>
    );
  });

  return (
    <div
      data-slot="specimen"
      data-detail="full"
      data-specimen-hash={hash}
      data-product-id={productId}
      className={cn("kit-grid rounded-media border border-line bg-well p-5", className)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="m-0 t-ui font-semibold text-fg">Certificate of analysis</p>
          <p className="m-0 mt-0.5 t-caption text-fg-muted">
            Batch {m.batch}, assayed <time dateTime={m.assayedAt}>{formatDateLong(m.assayedAt)}</time>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line bg-paper py-1 pr-2.5 pl-2 t-caption font-medium text-fg">
          <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" className="text-pass" />
          ISO 17025 lab
        </span>
      </div>

      <figure className="m-0 mt-4">
        <div className="relative">
          <svg viewBox="0 0 100 40" role="img" aria-label={label} className="block h-auto w-full text-fg-muted" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <Chromatogram m={m} seed={seed} />
          </svg>
          <p className="absolute top-[38%] right-1 m-0 text-right">
            <span data-numeric className="block t-figure-table text-fg">
              {mean.toFixed(1)}%
            </span>
            <span className="block t-caption text-fg-muted">mean of {m.runs.length} runs</span>
          </p>
        </div>
        <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 t-caption text-fg-muted">
          {m.runs.map((run, i) => (
            <span key={i} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className={cn("w-4 border-t-2 border-accent-category", i > 0 && "border-dashed opacity-70")} />
              Run {i + 1}: <span data-numeric className="text-fg">{run.toFixed(1)}%</span>
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-2.5 w-4 rounded-ctl bg-accent-category/15" />
            Acceptance window, 95–110%
          </span>
        </figcaption>
      </figure>

      <div className="mt-4 border-t border-line pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="t-small text-fg">{m.claim.label}</span>
          <span data-numeric className="t-small t-figure text-fg">
            {unit(m, m.claim.measured)}
          </span>
        </div>
        <ClaimBar m={m} />
      </div>

      <dl className="m-0 mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-x-4 gap-y-2.5 border-t border-line pt-4">{rows}</dl>

      <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
        {m.checks.map((c) => (
          <li key={c.label} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper py-1 pr-1 pl-3 t-caption text-fg">
            <span>
              {c.label} <span data-numeric className="font-medium">{c.value}</span>
            </span>
            <ResultMark status={c.status}>{RESULT_WORD[c.status]}</ResultMark>
          </li>
        ))}
      </ul>
    </div>
  );
}
