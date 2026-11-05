import type { ReactNode } from "react";

import { typeset } from "@/kit/lib/typeset";
import type { SupplementSpecimen } from "@/kit/types";

import { type Callout, type Detail, Extension, pts, r2, seeded, stroke } from "./frame";

/**
 * SUPPLEMENT — the container in elevation (sized by net weight) beside the
 * product’s own HPLC trace: the main peak’s height is the measured share of
 * the label claim against a dashed 100% line, with the minor peaks the lab
 * actually found. A failing product looks different because it measured
 * differently.
 */

const NB = " ";
const LAYOUT = {
  full: { w: 100, h: 75, cx: 25, base: 56, scale: 1, plot: { x0: 53, x1: 94, base: 52, height: 30 } },
  card: { w: 72, h: 54, cx: 19, base: 43, scale: 0.74, plot: { x0: 38, x1: 68, base: 40, height: 24 } },
  thumb: { w: 52, h: 52, cx: 26, base: 44, scale: 0.92, plot: undefined },
} as const;

const FORM_WORD = {
  "wide-tub": "tub",
  "micronised-pouch": "resealable pouch",
  "capsule-bottle": "capsule bottle",
  "gummy-jar": "gummy jar",
} as const;

export const weightLabel = (g: number) => (g >= 1000 ? `${g / 1000}${NB}kg` : `${g}${NB}g`);

function container(s: SupplementSpecimen, cx: number, base: number, k: number, detail: Detail, rand: () => number): ReactNode {
  const sz = Math.min(1.3, Math.max(0.74, Math.cbrt(s.netWeight / 500))) * k;
  const ridges = (x0: number, x1: number, y0: number, y1: number, step: number) =>
    detail === "thumb"
      ? null
      : Array.from({ length: Math.max(0, Math.floor((x1 - x0) / step)) }, (_, i) => x0 + step * (i + 0.5)).map((x) => (
          <line key={x} x1={r2(x)} y1={r2(y0)} x2={r2(x)} y2={r2(y1)} className="text-fg-muted" strokeOpacity={0.6} {...stroke.hair} />
        ));
  const panel = (x: number, y: number, w: number, h: number) =>
    detail === "thumb" ? null : (
      <g className="text-fg-muted">
        <rect x={r2(x)} y={r2(y)} width={r2(w)} height={r2(h)} {...stroke.hair} />
        {[0.25, 0.45, 0.65, 0.82].map((t) => (
          <line key={t} x1={r2(x + w * 0.14)} y1={r2(y + h * t)} x2={r2(x + w * (t === 0.82 ? 0.55 : 0.86))} y2={r2(y + h * t)} {...stroke.hair} />
        ))}
      </g>
    );

  if (s.formFactor === "wide-tub") {
    const bw = 32 * sz;
    const bh = 27 * sz;
    const lh = 6.5 * sz;
    const lw = bw + 1.8 * sz;
    const l = cx - bw / 2;
    const r = cx + bw / 2;
    const top = base - bh;
    return (
      <g>
        <path d={`M${r2(l)},${r2(top)} L${r2(l)},${r2(base - 2)} Q${r2(l)},${r2(base)} ${r2(l + 2)},${r2(base)} L${r2(r - 2)},${r2(base)} Q${r2(r)},${r2(base)} ${r2(r)},${r2(base - 2)} L${r2(r)},${r2(top)} Z`} className="fill-paper" {...stroke.line} />
        <line x1={r2(l)} y1={r2(base - bh * 0.8)} x2={r2(r)} y2={r2(base - bh * 0.8)} {...stroke.hair} />
        <line x1={r2(l)} y1={r2(base - bh * 0.2)} x2={r2(r)} y2={r2(base - bh * 0.2)} {...stroke.hair} />
        {panel(cx + bw * 0.1, base - bh * 0.72, bw * 0.3, bh * 0.44)}
        {detail !== "thumb" && <rect x={r2(l + bw * 0.12)} y={r2(base - bh * 0.6)} width={r2(bw * 0.3)} height={r2(bh * 0.13)} fill="currentColor" fillOpacity={0.14} stroke="none" />}
        <rect x={r2(cx - lw / 2)} y={r2(top - lh)} width={r2(lw)} height={r2(lh)} rx={0.9} className="fill-paper" {...stroke.line} />
        {ridges(cx - lw / 2 + 1, cx + lw / 2 - 1, top - lh + 1, top - 1, 1.5)}
      </g>
    );
  }

  if (s.formFactor === "micronised-pouch") {
    const pw = 30 * sz;
    const tw = 27 * sz;
    const ph = 41 * sz;
    const top = base - ph;
    const mid = base - ph * 0.5;
    const win = { x: cx - 6.5 * sz, y: base - 15 * sz, w: 13 * sz, h: 7 * sz };
    const dots = Array.from({ length: detail === "thumb" ? 0 : 34 }, () => [win.x + 1 + rand() * (win.w - 2), win.y + win.h * 0.35 + rand() * (win.h * 0.6 - 1)] as const);
    return (
      <g>
        <path
          d={`M${r2(cx - tw / 2)},${r2(top)} L${r2(cx + tw / 2)},${r2(top)} Q${r2(cx + pw / 2 + 0.8)},${r2(mid)} ${r2(cx + pw / 2)},${r2(base - 1.2)} Q${r2(cx + pw / 2)},${r2(base)} ${r2(cx + pw / 2 - 1.2)},${r2(base)} L${r2(cx - pw / 2 + 1.2)},${r2(base)} Q${r2(cx - pw / 2)},${r2(base)} ${r2(cx - pw / 2)},${r2(base - 1.2)} Q${r2(cx - pw / 2 - 0.8)},${r2(mid)} ${r2(cx - tw / 2)},${r2(top)} Z`}
          className="fill-paper"
          {...stroke.line}
        />
        <line x1={r2(cx - tw / 2)} y1={r2(top + 3.6 * sz)} x2={r2(cx + tw / 2)} y2={r2(top + 3.6 * sz)} {...stroke.hair} />
        {ridges(cx - tw / 2 + 0.6, cx + tw / 2 - 0.6, top + 0.6, top + 3.2 * sz, 1.2)}
        {detail !== "thumb" && (
          <line x1={r2(cx - tw / 2 + 1)} y1={r2(top + 6 * sz)} x2={r2(cx + tw / 2 - 1)} y2={r2(top + 6 * sz)} strokeDasharray="3 2" className="text-fg-muted" {...stroke.hair} />
        )}
        <polygon points={pts([[cx - tw / 2 - 0.2, top + 2], [cx - tw / 2 + 1.2, top + 2.6], [cx - tw / 2 - 0.1, top + 3.2]])} className="fill-well" {...stroke.hair} />
        <path d={`M${r2(cx - pw / 2 + 1.2)},${r2(base - 1)} Q${r2(cx)},${r2(base - 5 * sz)} ${r2(cx + pw / 2 - 1.2)},${r2(base - 1)}`} className="text-fg-muted" {...stroke.hair} />
        {panel(cx - 9 * sz, top + 9 * sz, 18 * sz, 10 * sz)}
        <rect x={r2(win.x)} y={r2(win.y)} width={r2(win.w)} height={r2(win.h)} rx={1.4} fill="currentColor" fillOpacity={0.05} {...stroke.hair} />
        {dots.map(([x, y]) => (
          <circle key={`${r2(x)}-${r2(y)}`} cx={r2(x)} cy={r2(y)} r={0.28} fill="currentColor" fillOpacity={0.45} stroke="none" />
        ))}
      </g>
    );
  }

  if (s.formFactor === "capsule-bottle") {
    const bw = 22 * sz;
    const bh = 27 * sz;
    const nw = 13 * sz;
    const cw = 15 * sz;
    const ch = 7 * sz;
    const shoulder = base - bh;
    const neckTop = shoulder - 6.5 * sz;
    const l = cx - bw / 2;
    const r = cx + bw / 2;
    const capX = cx + bw / 2 + 5.5 * sz;
    const capY = base - 3.2 * sz;
    const cl = 10 * sz;
    const cr = 2 * sz;
    return (
      <g>
        <path
          d={`M${r2(l)},${r2(base - 1.5)} L${r2(l)},${r2(shoulder)} Q${r2(l)},${r2(shoulder - 4 * sz)} ${r2(cx - nw / 2)},${r2(shoulder - 4.5 * sz)} L${r2(cx - nw / 2)},${r2(neckTop)} L${r2(cx + nw / 2)},${r2(neckTop)} L${r2(cx + nw / 2)},${r2(shoulder - 4.5 * sz)} Q${r2(r)},${r2(shoulder - 4 * sz)} ${r2(r)},${r2(shoulder)} L${r2(r)},${r2(base - 1.5)} Q${r2(r)},${r2(base)} ${r2(r - 1.5)},${r2(base)} L${r2(l + 1.5)},${r2(base)} Q${r2(l)},${r2(base)} ${r2(l)},${r2(base - 1.5)} Z`}
          className="fill-paper"
          {...stroke.line}
        />
        <line x1={r2(l)} y1={r2(base - bh * 0.82)} x2={r2(r)} y2={r2(base - bh * 0.82)} {...stroke.hair} />
        <line x1={r2(l)} y1={r2(base - bh * 0.18)} x2={r2(r)} y2={r2(base - bh * 0.18)} {...stroke.hair} />
        {panel(cx - bw * 0.3, base - bh * 0.7, bw * 0.6, bh * 0.4)}
        <rect x={r2(cx - cw / 2)} y={r2(neckTop - ch)} width={r2(cw)} height={r2(ch)} rx={0.8} className="fill-paper" {...stroke.line} />
        {ridges(cx - cw / 2 + 0.8, cx + cw / 2 - 0.8, neckTop - ch + 0.9, neckTop - 0.9, 1.3)}
        {detail !== "thumb" && (
          <g transform={`rotate(-18 ${r2(capX)} ${r2(capY)})`}>
            <rect x={r2(capX - cl / 2)} y={r2(capY - cr)} width={r2(cl)} height={r2(cr * 2)} rx={r2(cr)} className="fill-paper" {...stroke.line} />
            <path d={`M${r2(capX)},${r2(capY - cr)} L${r2(capX + cl / 2 - cr)},${r2(capY - cr)} A${r2(cr)},${r2(cr)} 0 0 1 ${r2(capX + cl / 2 - cr)},${r2(capY + cr)} L${r2(capX)},${r2(capY + cr)} Z`} fill="currentColor" fillOpacity={0.12} stroke="none" />
            <line x1={r2(capX)} y1={r2(capY - cr)} x2={r2(capX)} y2={r2(capY + cr)} {...stroke.hair} />
          </g>
        )}
      </g>
    );
  }

  // gummy jar
  const jw = 30 * sz;
  const jh = 24 * sz;
  const cw = 27 * sz;
  const ch = 7 * sz;
  const top = base - jh;
  const gummies = Array.from({ length: detail === "thumb" ? 4 : 7 }, (_, i) => ({
    x: cx - jw * 0.36 + (i % 4) * jw * 0.23 + rand() * 1.4,
    y: base - 4 * sz - Math.floor(i / 4) * 4.6 * sz - rand() * 1.2,
    a: Math.round(rand() * 60 - 30),
  }));
  return (
    <g>
      <rect x={r2(cx - jw / 2)} y={r2(top)} width={r2(jw)} height={r2(jh)} rx={r2(4.5 * sz)} className="fill-paper" {...stroke.line} />
      {gummies.map((g) => (
        <rect
          key={`${r2(g.x)}-${r2(g.y)}`}
          x={r2(g.x - 2.1 * sz)}
          y={r2(g.y - 1.7 * sz)}
          width={r2(4.2 * sz)}
          height={r2(3.4 * sz)}
          rx={r2(1.4 * sz)}
          transform={`rotate(${g.a} ${r2(g.x)} ${r2(g.y)})`}
          fill="currentColor"
          fillOpacity={0.12}
          className="text-fg"
          {...stroke.hair}
        />
      ))}
      <line x1={r2(cx - jw / 2)} y1={r2(top + jh * 0.16)} x2={r2(cx + jw / 2)} y2={r2(top + jh * 0.16)} {...stroke.hair} />
      <line x1={r2(cx - jw / 2)} y1={r2(top + jh * 0.48)} x2={r2(cx + jw / 2)} y2={r2(top + jh * 0.48)} {...stroke.hair} />
      {panel(cx - jw * 0.28, top + jh * 0.2, jw * 0.56, jh * 0.24)}
      <rect x={r2(cx - cw / 2)} y={r2(top - ch)} width={r2(cw)} height={r2(ch)} rx={1} className="fill-paper" {...stroke.line} />
      {ridges(cx - cw / 2 + 1, cx + cw / 2 - 1, top - ch + 1, top - 1, 1.5)}
    </g>
  );
}

export function supplementDrawing(s: SupplementSpecimen, detail: Detail, name: string, seed: string) {
  const L = LAYOUT[detail];
  const rand = seeded(seed);
  const full = detail === "full";
  const callouts: Callout[] = [];
  const parts: ReactNode[] = [];

  parts.push(<line key="ground" x1={r2(L.cx - 22 * L.scale)} y1={L.base} x2={r2(L.cx + 22 * L.scale)} y2={L.base} className="text-fg-muted" {...stroke.hair} />);
  parts.push(<g key="container">{container(s, L.cx, L.base, L.scale, detail, rand)}</g>);
  if (full) callouts.push({ x: L.cx, y: L.base + 2.2, valign: "top", text: weightLabel(s.netWeight), strong: true, sub: "net weight" });

  if (L.plot) {
    const { x0, x1, base, height } = L.plot;
    const W = x1 - x0;
    const mu = x0 + W * 0.3;
    const peak = height * (s.assayScore / 100);
    const minors = s.impurities.map((amp, i) => ({ mu: x0 + W * (0.52 + i * 0.14), amp: height * amp }));
    const p1 = rand() * Math.PI * 2;
    const p2 = rand() * Math.PI * 2;
    const g = (x: number, m: number, sd: number) => Math.exp(-((x - m) ** 2) / (2 * sd * sd));
    const trace: [number, number][] = [];
    for (let x = x0; x <= x1 + 1e-6; x += 0.25) {
      const noise = 0.1 * Math.sin(x * 1.7 + p1) + 0.06 * Math.sin(x * 3.1 + p2);
      const y = base - (peak * g(x, mu, 1.25) + minors.reduce((acc, m) => acc + m.amp * g(x, m.mu, 0.9), 0) + noise + 0.25);
      trace.push([x, Math.min(base, y)]);
    }
    const line = `M${trace.map(([x, y]) => `${r2(x)},${r2(y)}`).join(" L")}`;
    const apex: [number, number] = [mu, base - peak - 0.25];
    const ref = base - height;
    parts.push(
      <g key="plot">
        <polyline points={pts([[x0, ref - 8], [x0, base], [x1 + 1, base]])} className="text-fg-muted" {...stroke.hair} />
        {Array.from({ length: 7 }, (_, i) => x0 + (W / 6) * i).map((x) => (
          <line key={x} x1={r2(x)} y1={base} x2={r2(x)} y2={r2(base + 0.9)} className="text-fg-muted" {...stroke.hair} />
        ))}
        <line x1={x0} y1={r2(ref)} x2={x1} y2={r2(ref)} strokeDasharray="3 2.5" className="text-fg-muted" {...stroke.hair} />
        <path d={`${line} L${x1},${base} L${x0},${base} Z`} className="fill-accent-category" fillOpacity={0.1} stroke="none" />
        <path d={line} className="text-accent-category" {...stroke.line} />
        <circle cx={r2(apex[0])} cy={r2(apex[1])} r={0.75} className="fill-accent-category" stroke="none" />
        {full && <Extension x1={apex[0] + 0.8} y1={apex[1] - 0.8} x2={apex[0] + 4.4} y2={apex[1] - 5.2} />}
      </g>,
    );
    if (full) {
      callouts.push(
        { x: x0 + 1, y: ref - 0.8, align: "start", valign: "bottom", text: "100%" },
        { x: apex[0] + 5.2, y: apex[1] - 5.6, align: "start", text: `${s.assayScore.toFixed(1)}%`, sub: "of label claim", strong: true },
        { x: x0 + W / 2, y: base + 2.2, valign: "top", text: "Retention time" },
      );
    }
  }

  const label = typeset(`${name}: ${weightLabel(s.netWeight)} ${FORM_WORD[s.formFactor]}; HPLC assay at ${s.assayScore.toFixed(1)}% of the label claim`);
  return { w: L.w, h: L.h, svg: <>{parts}</>, callouts, label };
}
