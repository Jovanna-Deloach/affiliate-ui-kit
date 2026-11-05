import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * Shared drawing kit for technical specimens.
 *
 * Drawings are authored in millimetre-like viewBox units and stroked with
 * `vector-effect: non-scaling-stroke`, so every line stays a true 1px at any
 * size. Labels are HTML laid over the drawing (positioned in viewBox
 * percentages), so they stay at the UI caption size on a phone and on a
 * desktop instead of scaling with the drawing.
 */

export type Detail = "full" | "card" | "thumb";

export const r2 = (n: number) => Math.round(n * 100) / 100;

/** Point on a dial: radius r at `deg` degrees clockwise from twelve o’clock. */
export function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [r2(cx + r * Math.sin(a)), r2(cy - r * Math.cos(a))];
}

export const pts = (list: [number, number][]) => list.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" ");

/** A smooth path through points (Catmull–Rom converted to cubic Béziers). */
export function smooth(points: [number, number][], { closed = false, tension = 1 } = {}): string {
  if (points.length < 2) return "";
  const p = closed ? [points[points.length - 1]!, ...points, points[0]!, points[1]!] : [points[0]!, ...points, points[points.length - 1]!];
  let d = `M${r2(p[1]![0])},${r2(p[1]![1])}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1]!;
    const [x1, y1] = p[i]!;
    const [x2, y2] = p[i + 1]!;
    const [x3, y3] = p[i + 2]!;
    const c1x = x1 + ((x2 - x0) / 6) * tension;
    const c1y = y1 + ((y2 - y0) / 6) * tension;
    const c2x = x2 - ((x3 - x1) / 6) * tension;
    const c2y = y2 - ((y3 - y1) / 6) * tension;
    d += ` C${r2(c1x)},${r2(c1y)} ${r2(c2x)},${r2(c2y)} ${r2(x2)},${r2(y2)}`;
  }
  return closed ? `${d} Z` : d;
}

/** Deterministic pseudo-random sequence, seeded from a string (no Math.random: server and client agree). */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

// vector-effect does not inherit: spread these on every stroked element, never on a <g>.
const HAIR = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 1 };
const LINE = { vectorEffect: "non-scaling-stroke" as const, strokeWidth: 1.25 };
export const stroke = { hair: HAIR, line: LINE };

/** Architectural dimension line: thin rule with 45° ticks at both ends. */
export function Dimension({ x1, y1, x2, y2, tick = 1.1 }: { x1: number; y1: number; x2: number; y2: number; tick?: number }) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const tx = ((ux + uy) / Math.SQRT2) * tick;
  const ty = ((uy - ux) / Math.SQRT2) * tick;
  return (
    <g className="text-fg-muted">
      <line x1={r2(x1)} y1={r2(y1)} x2={r2(x2)} y2={r2(y2)} {...HAIR} />
      <line x1={r2(x1 - tx)} y1={r2(y1 - ty)} x2={r2(x1 + tx)} y2={r2(y1 + ty)} {...HAIR} />
      <line x1={r2(x2 - tx)} y1={r2(y2 - ty)} x2={r2(x2 + tx)} y2={r2(y2 + ty)} {...HAIR} />
    </g>
  );
}

/** Extension / projection line, lighter than the dimension it serves. */
export function Extension({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return (
    <line
      x1={r2(x1)}
      y1={r2(y1)}
      x2={r2(x2)}
      y2={r2(y2)}
      className="text-fg-muted"
      strokeOpacity={dashed ? 0.45 : 0.7}
      strokeDasharray={dashed ? "3 2" : undefined}
      {...HAIR}
    />
  );
}

export interface Callout {
  /** Anchor point, in viewBox units. */
  x: number;
  y: number;
  align?: "start" | "center" | "end";
  valign?: "top" | "middle" | "bottom";
  text: string;
  /** Optional second line, set smaller and muted. */
  sub?: string;
  /** Figure voice (ink, medium) instead of muted. */
  strong?: boolean;
  /** Lay the label on a patch of the well colour, breaking the line behind it. */
  knockout?: boolean;
}

const TX = { start: "0%", center: "-50%", end: "-100%" } as const;
const TY = { top: "0%", middle: "-50%", bottom: "-100%" } as const;
const ALIGN = { start: "justify-items-start text-left", center: "justify-items-center text-center", end: "justify-items-end text-right" } as const;

function CalloutLabel({ c, w, h }: { c: Callout; w: number; h: number }) {
  const style: CSSProperties = {
    left: `${r2((c.x / w) * 100)}%`,
    top: `${r2((c.y / h) * 100)}%`,
    transform: `translate(${TX[c.align ?? "center"]}, ${TY[c.valign ?? "middle"]})`,
  };
  return (
    <span
      className={cn(
        "pointer-events-none absolute grid whitespace-nowrap t-caption leading-none",
        ALIGN[c.align ?? "center"],
        c.strong ? "font-medium text-fg" : "text-fg-muted",
        c.knockout && "bg-well px-1 py-0.5",
      )}
      style={style}
    >
      <span>{c.text}</span>
      {c.sub && <span className="mt-1 text-fg-muted">{c.sub}</span>}
    </span>
  );
}

export interface FrameProps {
  w: number;
  h: number;
  detail: Detail;
  hash: string;
  productId: string;
  /** What the drawing shows, for screen readers. */
  label: string;
  callouts?: Callout[];
  children: ReactNode;
  className?: string;
}

/**
 * The plate a drawing sits on: the theme's well, the theme's media radius.
 * The plate may be wider than the drawing (a capped height on a wide
 * column); the drawing and its labels stay centred together at their own
 * aspect ratio, so labels never drift from the lines they name.
 */
export function SpecimenFrame({ w, h, detail, hash, productId, label, callouts = [], children, className }: FrameProps) {
  const ratio = `${w} / ${h}`;
  return (
    <div
      data-slot="specimen"
      data-detail={detail}
      data-specimen-hash={hash}
      data-product-id={productId}
      className={cn("relative w-full overflow-hidden rounded-media bg-well text-fg", className)}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 flex justify-center">
        <div className="relative h-full" style={{ aspectRatio: ratio }}>
          <svg
            viewBox={`0 0 ${w} ${h}`}
            role="img"
            aria-label={label}
            className="absolute inset-0 size-full"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {children}
          </svg>
          {callouts.map((c) => (
            <CalloutLabel key={`${c.x}-${c.y}-${c.text}`} c={c} w={w} h={h} />
          ))}
        </div>
      </div>
    </div>
  );
}
