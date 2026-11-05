import type { ReactNode } from "react";

import { typeset } from "@/kit/lib/typeset";
import type { ShoeSpecimen } from "@/kit/types";

import { type Callout, type Detail, Dimension, r2, smooth, stroke } from "./frame";

/**
 * RUNNING SHOE — lateral elevation at true proportion (a US 10 is 290 mm
 * long), with the stack measured at the heel and the forefoot, the drop
 * between them, the plate if there is one, and the toe spring.
 */

const NB = " ";
const LENGTH_MM = 290;
const LAYOUT = {
  full: { w: 100, h: 75, hx: 19, len: 72, ground: 53 },
  card: { w: 72, h: 46, hx: 6, len: 60, ground: 37 },
  thumb: { w: 52, h: 52, hx: 5, len: 42, ground: 36 },
} as const;
const PLATE_WORD = { carbon: "carbon plate", nylon: "nylon plate", none: "no plate" } as const;

export function shoeDrawing(s: ShoeSpecimen, detail: Detail, name: string) {
  const { w, h, hx, len, ground: gy } = LAYOUT[detail];
  const full = detail === "full";
  const k = len / LENGTH_MM;
  const hs = s.heelStackMm * k;
  const fs = s.forefootStackMm * k;
  const tx = hx + len;
  const lift = (2.2 + 5.5 * s.rocker) * (len / 72);
  const u = len * 0.27;
  const X = (t: number) => hx + len * t;

  /* midsole: flat under heel and midfoot, toe spring at the front, a rounded nose */
  const ms: [number, number][] = [
    [hx + 0.4, gy - hs + 0.2],
    [X(0.25), gy - hs * 0.985],
    [X(0.55), gy - (hs * 0.45 + fs * 0.55)],
    [X(0.76), gy - fs - 0.1],
    [X(0.9), gy - fs * 0.78 - lift * 0.62],
    [tx - 0.6, gy - lift - fs * 0.38],
    [tx + 0.2, gy - lift - fs * 0.16],
    [tx - 1.4, gy - lift + 0.25],
    [X(0.84), gy - lift * 0.3],
    [X(0.66), gy],
    [hx + 4, gy],
    [hx + 1.1, gy - 0.6],
    [hx - 0.15, gy - hs * 0.5],
  ];
  const midsole = smooth(ms, { closed: true, tension: 0.85 });

  /* upper: heel counter, collar, tongue, throat, toe box */
  const U: [number, number][] = [
    [hx + 1.4, gy - hs + 1],
    [hx - 0.7, gy - hs - 0.3 * u],
    [hx + 0.1, gy - hs - 0.72 * u],
    [X(0.06), gy - hs - 0.9 * u],
    [X(0.17), gy - hs - 0.77 * u],
    [X(0.27), gy - hs - 1.0 * u],
    [X(0.33), gy - hs - 0.93 * u],
    [X(0.6), gy - fs - 0.56 * u],
    [X(0.78), gy - fs - 0.42 * u - lift * 0.2],
    [X(0.92), gy - fs * 0.8 - 0.28 * u - lift * 0.55],
    [tx - 0.6, gy - lift - fs * 0.5],
    [X(0.62), gy - fs * 0.8],
    [X(0.2), gy - hs * 0.8],
  ];
  const upper = smooth(U, { closed: true, tension: 0.85 });
  const F = U[6]!;
  const G = U[7]!;
  const H = U[8]!;
  const I = U[9]!;
  const C = U[3]!;
  const D = U[4]!;
  const E = U[5]!;

  const lerp = (p: [number, number], q: [number, number], t: number): [number, number] => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t];
  const throatLen = Math.hypot(G[0] - F[0], G[1] - F[1]);
  const nrm: [number, number] = [-(G[1] - F[1]) / throatLen, (G[0] - F[0]) / throatLen];
  const eyelets = detail === "thumb" ? [] : [0.12, 0.28, 0.44, 0.6, 0.76, 0.9].map((t) => lerp(F, G, t));
  const scale = len / 72;

  const texture: ReactNode[] = [];
  if (detail !== "thumb") {
    const vamp = (off: number): [number, number][] =>
      [lerp(F, G, 0.55), G, H, lerp(H, I, 0.55)].map(([x, y], i) => [x + nrm[0] * off * scale * (1 - i * 0.2), y + nrm[1] * off * scale * (1 - i * 0.2)] as [number, number]);
    if (s.upper === "knit")
      [2.2, 4.4, 6.6].forEach((off) => texture.push(<path key={off} d={smooth(vamp(off))} className="text-fg" strokeOpacity={0.22} {...stroke.hair} />));
    else if (s.upper === "mesh")
      [2.4, 4.8].forEach((off) => texture.push(<path key={off} d={smooth(vamp(off))} className="text-fg" strokeOpacity={0.45} strokeDasharray="0.5 3" {...stroke.hair} />));
    else {
      texture.push(<path key="seam" d={smooth([lerp(D, E, 0.35), [X(0.28), gy - hs - 0.35 * u], [X(0.4), gy - (hs + fs) / 2 - 0.6]])} className="text-fg" strokeOpacity={0.35} {...stroke.hair} />);
      texture.push(<path key="cap" d={smooth([[X(0.79), gy - fs - 0.1], [X(0.85), gy - fs - 0.26 * u], [X(0.95), gy - fs * 0.6 - lift * 0.6]])} className="text-fg" strokeOpacity={0.35} {...stroke.hair} />);
    }
  }

  const plate =
    s.plate === "none"
      ? null
      : smooth([
          [hx + 2.6, gy - hs * 0.42],
          [X(0.4), gy - ((hs + fs) / 2) * 0.42],
          [X(0.7), gy - fs * 0.42],
          [X(0.9), gy - lift * 0.55 - fs * 0.38],
        ]);
  const plateDash = s.plate === "carbon" ? "5 2" : "1.5 2";

  const xh = X(0.12);
  const xf = X(0.74);
  const drop = s.heelStackMm - s.forefootStackMm;
  const callouts: Callout[] = full
    ? [
        { x: xh, y: gy + 2.4, valign: "top", text: `Heel ${s.heelStackMm}${NB}mm`, strong: true },
        { x: (xh + xf) / 2, y: gy + 2.4, valign: "top", text: `${drop}${NB}mm drop` },
        { x: xf, y: gy + 2.4, valign: "top", text: `Forefoot ${s.forefootStackMm}${NB}mm`, strong: true },
        { x: 92, y: 14, align: "end", valign: "top", text: `${s.weightOz.toFixed(1)}${NB}oz`, sub: "one shoe, US men’s 10", strong: true },
        ...(s.plate === "none" ? [] : [{ x: 14.8, y: 17, align: "start" as const, text: s.plate === "carbon" ? "Carbon plate" : "Nylon plate" }]),
      ]
    : [];

  const svg = (
    <>
      <line x1={full ? 6 : hx - 3} y1={gy} x2={full ? 94 : tx + 3} y2={gy} className="text-fg-muted" {...stroke.hair} />
      <path d={upper} className="fill-paper" {...stroke.line} />
      {texture}
      {eyelets.map(([x, y]) => (
        <g key={`${r2(x)}`}>
          <line x1={r2(x + nrm[0] * 0.2)} y1={r2(y + nrm[1] * 0.2)} x2={r2(x - nrm[0] * 1.9)} y2={r2(y - nrm[1] * 1.9)} {...stroke.hair} />
          <circle cx={r2(x + nrm[0] * 1)} cy={r2(y + nrm[1] * 1)} r={0.42} {...stroke.hair} />
        </g>
      ))}
      {detail !== "thumb" && <path d={`M${r2(C[0])},${r2(C[1])} q-1.7,-1 -0.5,-2.7`} {...stroke.hair} />}
      <path d={midsole} className="fill-paper" {...stroke.line} />
      <path d={midsole} fill="currentColor" fillOpacity={0.06} stroke="none" />
      {detail !== "thumb" && (
        <path d={smooth([[hx + 2.2, gy - hs * 0.55], [X(0.3), gy - hs * 0.5], [X(0.52), gy - (hs + fs) * 0.24]])} className="text-fg-muted" strokeOpacity={0.6} {...stroke.hair} />
      )}
      <path d={smooth([[hx + 4, gy - 0.95 * scale], [X(0.66), gy - 0.95 * scale], [X(0.84), gy - lift * 0.3 - 0.95 * scale], [tx - 1.8, gy - lift + 0.25 - 0.6 * scale]])} className="text-fg-muted" {...stroke.hair} />
      {detail !== "thumb" &&
        [0.2, 0.32, 0.46, 0.58].map((t) => <line key={t} x1={r2(X(t))} y1={r2(gy - 0.95 * scale)} x2={r2(X(t))} y2={gy} className="text-fg-muted" {...stroke.hair} />)}
      {plate && <path d={plate} className="text-accent-category" strokeDasharray={plateDash} {...stroke.line} />}
      {full && (
        <g>
          <Dimension x1={xh} y1={gy} x2={xh} y2={gy - hs} tick={0.9} />
          <Dimension x1={xf} y1={gy} x2={xf} y2={gy - fs} tick={0.9} />
          {plate && <line x1={7} y1={17} x2={13} y2={17} className="text-accent-category" strokeDasharray={plateDash} {...stroke.line} />}
        </g>
      )}
    </>
  );

  const label = typeset(
    `${name}: ${s.heelStackMm} mm heel and ${s.forefootStackMm} mm forefoot stack, ${drop} mm drop, ${s.weightOz.toFixed(1)} oz, ${PLATE_WORD[s.plate]}`,
  );
  return { w, h, svg, callouts, label };
}
