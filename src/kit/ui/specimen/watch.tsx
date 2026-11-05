import type { ReactNode } from "react";

import { typeset } from "@/kit/lib/typeset";
import type { WatchSpecimen } from "@/kit/types";

import { type Callout, type Detail, Dimension, Extension, polar, pts, r2, stroke } from "./frame";

/**
 * WATCH — front elevation and side profile at one constant millimetre
 * scale, so a 36 mm field watch is visibly smaller than a 40 mm GMT on the
 * same page. Dial layout, bezel, hands and strap are drawn from the
 * specimen; nothing is shared artwork.
 */

// Every layout keeps at least ~14% clear margin: nothing touches the plate edge.
// `card` is portrait, for verdict-card wells: the strap runs to the 15%
// margin line and ends in a break, so the plate is full without cropping.
const LAYOUT: Record<Detail, { w: number; h: number; cx: number; cy: number; strapTo?: number }> = {
  full: { w: 124, h: 93, cx: 57.3, cy: 46.4 },
  card: { w: 62, h: 86, cx: 29.85, cy: 43, strapTo: 0.15 },
  thumb: { w: 72, h: 72, cx: 35, cy: 36 },
};
const PROFILE_DX = 33;
const STUB = 3.5;
const NB = " ";
const mm = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)}${NB}mm`;

const BEZEL = { "diver-bezel": 3.4, gmt: 3, "dress-subdial": 1.1, "field-arabic": 1.5 } as const;
const STRAP_WORD = { bracelet: "on a steel bracelet", leather: "on a leather strap", nato: "on a fabric strap" } as const;
// 10:09:36 — the hands frame the dial instead of covering it.
const HOUR = (10 + 9.6 / 60) * 30;
const MINUTE = 9.6 * 6;
const SECOND = 36 * 6;

export function watchDrawing(s: WatchSpecimen, detail: Detail, name: string) {
  const { w, h, cx, cy, strapTo } = LAYOUT[detail];
  const full = detail === "full";
  const thumb = detail === "thumb";
  const R = s.caseDiameterMm / 2;
  const L = s.lugToLugMm;
  const T = s.thicknessMm;
  const LW = s.lugWidthMm;
  const dark = s.dialTone === "dark";
  // Dial furniture and hands are inked; case, strap and dimensions are drafting lines.
  const ink = "text-fg";
  const rb = R - BEZEL[s.complicationType];
  const rd = rb - (BEZEL[s.complicationType] > 2 ? 0.5 : 0.3);
  const P = (r: number, deg: number) => polar(cx, cy, r, deg);

  /* -- geometry helpers ---------------------------------------------------- */
  const bar = (r1: number, r2_: number, a: number, wd: number, ox = cx, oy = cy) => {
    const [x1, y1] = polar(ox, oy, r1, a);
    const [x2, y2] = polar(ox, oy, r2_, a);
    const rad = (a * Math.PI) / 180;
    const nx = (Math.cos(rad) * wd) / 2;
    const ny = (Math.sin(rad) * wd) / 2;
    return pts([
      [x1 - nx, y1 - ny],
      [x2 - nx, y2 - ny],
      [x2 + nx, y2 + ny],
      [x1 + nx, y1 + ny],
    ]);
  };
  const local = (a: number) => {
    const rad = (a * Math.PI) / 180;
    const u = [Math.sin(rad), -Math.cos(rad)] as const;
    const v = [Math.cos(rad), Math.sin(rad)] as const;
    return (along: number, across: number, ox = cx, oy = cy): [number, number] => [ox + u[0] * along + v[0] * across, oy + u[1] * along + v[1] * across];
  };
  const hand = (a: number, len: number, wd: number, tail: number, shape: "sword" | "leaf" | "pencil") => {
    const p = local(a);
    if (shape === "leaf")
      return pts([p(-tail * 0.5, 0), p(len * 0.1, -wd * 0.16), p(len * 0.5, -wd / 2), p(len, 0), p(len * 0.5, wd / 2), p(len * 0.1, wd * 0.16)]);
    if (shape === "pencil") return pts([p(-tail, -wd / 2), p(len - wd * 1.3, -wd / 2), p(len, 0), p(len - wd * 1.3, wd / 2), p(-tail, wd / 2)]);
    return pts([p(-tail, -wd * 0.32), p(0, -wd / 2), p(len - wd * 1.5, -wd / 2), p(len, 0), p(len - wd * 1.5, wd / 2), p(0, wd / 2), p(-tail, wd * 0.32)]);
  };
  const ring = (ro: number, ri: number, a0: number, a1: number) => {
    const [ax, ay] = P(ro, a0);
    const [bx, by] = P(ro, a1);
    const [c1, d1] = P(ri, a1);
    const [e1, f1] = P(ri, a0);
    return `M${ax},${ay} A${r2(ro)},${r2(ro)} 0 0 1 ${bx},${by} L${c1},${d1} A${r2(ri)},${r2(ri)} 0 0 0 ${e1},${f1} Z`;
  };

  /* -- strap ---------------------------------------------------------------- */
  // Straps always end in a break line inside the plate: the watch is never cropped.
  const topEnd = strapTo ? Math.min(cy - L / 2 - STUB, h * strapTo) : cy - L / 2 - STUB;
  const botEnd = strapTo ? Math.max(cy + L / 2 + STUB, h * (1 - strapTo)) : cy + L / 2 + STUB;
  const strap = (dir: -1 | 1) => {
    const y0 = cy + dir * (R - 1.5);
    const y1 = dir < 0 ? topEnd : botEnd;
    const taper = s.strapType === "nato" ? 1 : s.strapType === "bracelet" ? 0.94 : 0.88;
    const half0 = LW / 2;
    const half1 = half0 * (1 - (1 - taper) * Math.min(1, Math.abs(y1 - y0) / 24));
    const halfAt = (y: number) => half0 + (half1 - half0) * ((y - y0) / (y1 - y0));
    const end: [number, number][] = [
      [cx - half1, y1],
      [cx - half1 * 0.26, y1],
      [cx - half1 * 0.09, y1 - dir * 1.2],
      [cx + half1 * 0.09, y1 + dir * 1.2],
      [cx + half1 * 0.26, y1],
      [cx + half1, y1],
    ];
    const outline = pts([[cx - half0, y0], ...end, [cx + half0, y0]]);
    const stop = y1 - dir * 1.6;
    const details: ReactNode[] = [];
    if (s.strapType === "bracelet") {
      const split = 0.34;
      details.push(
        <line key="l" x1={r2(cx - half0 * split)} y1={r2(y0)} x2={r2(cx - half1 * split)} y2={r2(stop)} {...stroke.hair} />,
        <line key="r" x1={r2(cx + half0 * split)} y1={r2(y0)} x2={r2(cx + half1 * split)} y2={r2(stop)} {...stroke.hair} />,
      );
      for (let k = 0, y = cy + dir * (R + 0.6); dir * (stop - y) > 0.4; k++, y += dir * 1.6) {
        const hw = halfAt(y);
        if (k % 2 === 0) details.push(<line key={`c${k}`} x1={r2(cx - hw * split)} y1={r2(y)} x2={r2(cx + hw * split)} y2={r2(y)} {...stroke.hair} />);
        else
          details.push(
            <line key={`o${k}a`} x1={r2(cx - hw)} y1={r2(y)} x2={r2(cx - hw * split)} y2={r2(y)} {...stroke.hair} />,
            <line key={`o${k}b`} x1={r2(cx + hw * split)} y1={r2(y)} x2={r2(cx + hw)} y2={r2(y)} {...stroke.hair} />,
          );
      }
    } else if (s.strapType === "leather") {
      const yA = cy + dir * (R + 0.4);
      details.push(
        <polyline
          key="stitch"
          points={pts([
            [cx - halfAt(stop) + 1, stop],
            [cx - halfAt(yA) + 1, yA],
          ])}
          strokeDasharray="2.5 2"
          className="text-fg-muted"
          {...stroke.hair}
        />,
        <polyline
          key="stitch-r"
          points={pts([
            [cx + halfAt(stop) - 1, stop],
            [cx + halfAt(yA) - 1, yA],
          ])}
          strokeDasharray="2.5 2"
          className="text-fg-muted"
          {...stroke.hair}
        />,
      );
    } else {
      const band = half0 * 0.32;
      details.push(
        <rect key="band" x={r2(cx - band)} y={r2(Math.min(y0, stop))} width={r2(band * 2)} height={r2(Math.abs(stop - y0))} fill="currentColor" fillOpacity={0.08} stroke="none" />,
        <line key="a" x1={r2(cx - band)} y1={r2(y0)} x2={r2(cx - band)} y2={r2(stop)} {...stroke.hair} className="text-fg-muted" />,
        <line key="b" x1={r2(cx + band)} y1={r2(y0)} x2={r2(cx + band)} y2={r2(stop)} {...stroke.hair} className="text-fg-muted" />,
      );
    }
    return (
      <g key={dir}>
        <polygon points={outline} className="fill-paper" {...stroke.line} />
        {details}
      </g>
    );
  };

  /* -- lugs and crown --------------------------------------------------------- */
  const lug = (sx: -1 | 1, sy: -1 | 1) => {
    const xi = cx + sx * (LW / 2);
    const xo = cx + sx * (LW / 2 + 2.4);
    const yb = cy + sy * (R - 4);
    const yt = cy + sy * (L / 2);
    const k = 0.8;
    return (
      <path
        key={`${sx}${sy}`}
        d={`M${r2(xi)},${r2(yb)} L${r2(xi)},${r2(yt - sy * k)} Q${r2(xi)},${r2(yt)} ${r2(xi + sx * k)},${r2(yt)} L${r2(xo - sx * k)},${r2(yt)} Q${r2(xo)},${r2(yt)} ${r2(xo)},${r2(yt - sy * k)} L${r2(xo)},${r2(yb)} Z`}
        className="fill-paper"
        {...stroke.line}
      />
    );
  };
  const crownH = s.complicationType === "diver-bezel" ? 2.6 : 2.2;

  /* -- dial furniture --------------------------------------------------------- */
  const furniture: ReactNode[] = [];
  const hours = Array.from({ length: 12 }, (_, i) => i * 30);
  if (!thumb && (s.complicationType === "gmt" || s.complicationType === "field-arabic")) {
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const [x1, y1] = P(rd - 1, i * 6);
      const [x2, y2] = P(rd - 0.45, i * 6);
      furniture.push(<line key={`m${i}`} x1={x1} y1={y1} x2={x2} y2={y2} className={ink} strokeOpacity={0.55} {...stroke.hair} />);
    }
  }
  if (s.complicationType === "gmt") {
    for (const a of hours) {
      if (a === 90 && s.date) continue;
      if (a === 0) {
        furniture.push(<polygon key="h0a" points={bar(rd - 4.8, rd - 1.3, -2.6, 1)} className={`${ink} fill-current`} stroke="none" />);
        furniture.push(<polygon key="h0b" points={bar(rd - 4.8, rd - 1.3, 2.6, 1)} className={`${ink} fill-current`} stroke="none" />);
      } else furniture.push(<polygon key={`h${a}`} points={bar(rd - 4.6, rd - 1.3, a, 1)} className={`${ink} fill-current`} stroke="none" />);
    }
  } else if (s.complicationType === "dress-subdial") {
    for (const a of hours) {
      if (a === 180) continue;
      if (a === 0) {
        furniture.push(<polygon key="h0a" points={bar(rd - 4.6, rd - 1, -2, 0.55)} className={`${ink} fill-current`} stroke="none" />);
        furniture.push(<polygon key="h0b" points={bar(rd - 4.6, rd - 1, 2, 0.55)} className={`${ink} fill-current`} stroke="none" />);
      } else furniture.push(<polygon key={`h${a}`} points={bar(rd - 4.2, rd - 1, a, 0.55)} className={`${ink} fill-current`} stroke="none" />);
    }
  } else if (s.complicationType === "diver-bezel") {
    for (const a of hours) {
      if (a === 0) furniture.push(<polygon key="h0" points={pts([P(rd - 1.1, -7.5), P(rd - 1.1, 7.5), P(rd - 5.2, 0)])} className={`${ink} fill-current`} stroke="none" />);
      else if (a === 90 && s.date) continue;
      else if (a % 90 === 0) furniture.push(<polygon key={`h${a}`} points={bar(rd - 5, rd - 1.2, a, 1.8)} className={`${ink} fill-current`} stroke="none" />);
      else {
        const [x, y] = P(rd - 2.7, a);
        furniture.push(<circle key={`h${a}`} cx={x} cy={y} r={1.2} className={`${ink} fill-current`} stroke="none" />);
      }
    }
  } else {
    for (const a of hours) {
      if (a % 90 === 0) {
        const [x, y] = P(rd - 5.3, a);
        furniture.push(
          <text key={`n${a}`} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={3.8} fontWeight={600} stroke="none" className={`${ink} fill-current font-ui`}>
            {a === 0 ? 12 : a / 30}
          </text>,
        );
      } else furniture.push(<polygon key={`h${a}`} points={bar(rd - 2.5, rd - 0.45, a, 0.6)} className={`${ink} fill-current`} stroke="none" />);
    }
  }

  const sub = s.complicationType === "dress-subdial" ? { x: cx, y: cy + rd * 0.47, r: rd * 0.26 } : undefined;
  const date = s.date && (s.complicationType === "gmt" || s.complicationType === "diver-bezel");

  /* -- hands ------------------------------------------------------------------ */
  const shape = s.complicationType === "dress-subdial" ? "leaf" : s.complicationType === "field-arabic" ? "pencil" : "sword";
  const broad = s.complicationType === "diver-bezel" ? 1.25 : 1;
  const sec = local(SECOND);
  const gmt = local(150);

  /* -- profile (full detail) ---------------------------------------------------- */
  const x0 = cx + PROFILE_DX;
  const bezelT = (s.complicationType === "diver-bezel" ? 0.22 : 0.16) * T;
  const x1 = x0 + 0.07 * T;
  const x2 = x1 + bezelT;
  const x3 = x2 + 0.5 * T;
  const hc = 0.8 * R;
  const hb = 0.96 * R;
  const hk = 0.84 * R;
  // A lug seen from the side: a horn that rises from the mid-case and curves toward the wrist.
  const profileLug = (sy: -1 | 1) => {
    const Y = (d: number) => r2(cy + sy * d);
    const tip = L / 2;
    return `M${r2(x2 + 0.05 * T)},${Y(R - 1)} C${r2(x2 + 0.05 * T)},${Y(R + 1.5)} ${r2(x2 + 0.16 * T)},${Y(tip - 0.6)} ${r2(x2 + 0.34 * T)},${Y(tip)} L${r2(x3 + 0.04 * T)},${Y(tip - 0.2)} Q${r2(x3 + 0.14 * T)},${Y(tip - 0.4)} ${r2(x3 + 0.12 * T)},${Y(tip - 1.6)} L${r2(x3 + 0.03 * T)},${Y(R - 1)} Z`;
  };
  const yD = cy - L / 2 - STUB - 3.6;
  const xL = cx - R - 5.2;
  const yT = cy + L / 2 + 3.2;

  const callouts: Callout[] = full
    ? [
        { x: cx, y: yD, text: `Ø${NB}${mm(s.caseDiameterMm)}`, knockout: true, strong: true },
        { x: xL - 1.5, y: cy, align: "end", text: mm(L), strong: true },
        { x: x0 + T / 2, y: yT + 1.9, valign: "top", text: mm(T), strong: true },
      ]
    : [];

  const label = typeset(`${name}: ${s.caseDiameterMm} mm case, ${L} mm lug to lug, ${T} mm thick, ${STRAP_WORD[s.strapType]}`);

  const svg = (
    <>
      {full && (
        <g>
          <Extension x1={cx + LW / 2 + 3.4} y1={cy - L / 2} x2={x2 + 0.34 * T - 1} y2={cy - L / 2} dashed />
          <Extension x1={cx + LW / 2 + 3.4} y1={cy + L / 2} x2={x2 + 0.34 * T - 1} y2={cy + L / 2} dashed />
        </g>
      )}
      {strap(-1)}
      {strap(1)}
      {lug(-1, -1)}
      {lug(1, -1)}
      {lug(-1, 1)}
      {lug(1, 1)}
      <rect x={r2(cx + R - 1)} y={r2(cy - crownH)} width={r2(3.3)} height={r2(crownH * 2)} rx={0.5} className="fill-paper" {...stroke.line} />
      {!thumb &&
        [0.6, 1.2, 1.8].map((dx) => <line key={dx} x1={r2(cx + R + dx)} y1={r2(cy - crownH + 0.5)} x2={r2(cx + R + dx)} y2={r2(cy + crownH - 0.5)} className="text-fg-muted" {...stroke.hair} />)}
      <circle cx={cx} cy={cy} r={r2(R)} className="fill-paper" {...stroke.line} />
      {s.complicationType === "gmt" && <path d={ring(R - 0.4, rb, -90, 90)} fill="currentColor" fillOpacity={0.1} stroke="none" />}
      <circle cx={cx} cy={cy} r={r2(rb)} {...stroke.hair} />
      {s.complicationType === "diver-bezel" &&
        Array.from({ length: 60 }, (_, i) => i)
          .filter((i) => i !== 0 && (!thumb || i % 5 === 0))
          .map((i) => {
            const [ax, ay] = P(rb + 0.7, i * 6);
            const [bx, by] = P(rb + (i % 5 === 0 ? 2.3 : 1.3), i * 6);
            return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} {...stroke.hair} />;
          })}
      {s.complicationType === "diver-bezel" && <polygon points={pts([P(rb + 0.5, 0), P(R - 0.6, -4.6), P(R - 0.6, 4.6)])} className="fill-accent-category text-accent-category" {...stroke.hair} />}
      {s.complicationType === "gmt" &&
        Array.from({ length: 24 }, (_, i) => i)
          .filter((i) => i !== 0)
          .map((i) => {
            const [ax, ay] = P(rb + 0.6, i * 15);
            const [bx, by] = P(rb + (i % 3 === 0 ? 2.1 : 1.4), i * 15);
            return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} {...stroke.hair} />;
          })}
      {s.complicationType === "gmt" && <polygon points={pts([P(rb + 0.5, 0), P(R - 0.6, -4), P(R - 0.6, 4)])} className="fill-current" stroke="none" />}
      <circle cx={cx} cy={cy} r={r2(rd)} className="fill-paper" strokeOpacity={0.6} {...stroke.hair} />
      {dark && <circle cx={cx} cy={cy} r={r2(rd)} fill="currentColor" fillOpacity={0.09} stroke="none" className="text-fg" />}
      {furniture}
      {sub && (
        <g className={ink}>
          <circle cx={r2(sub.x)} cy={r2(sub.y)} r={r2(sub.r)} strokeOpacity={0.6} {...stroke.hair} />
          {!thumb &&
            Array.from({ length: 12 }, (_, i) => {
              const [ax, ay] = polar(sub.x, sub.y, sub.r - 0.9, i * 30);
              const [bx, by] = polar(sub.x, sub.y, sub.r - 0.3, i * 30);
              return <line key={i} x1={ax} y1={ay} x2={bx} y2={by} strokeOpacity={0.6} {...stroke.hair} />;
            })}
          <line x1={r2(sub.x)} y1={r2(sub.y)} x2={polar(sub.x, sub.y, sub.r * 0.78, 220)[0]} y2={polar(sub.x, sub.y, sub.r * 0.78, 220)[1]} className="text-accent-category" {...stroke.line} />
          <circle cx={r2(sub.x)} cy={r2(sub.y)} r={0.45} className="fill-current" stroke="none" />
        </g>
      )}
      {date && (
        <g>
          <rect x={r2(cx + rd - 6.6)} y={r2(cy - 1.5)} width={4} height={3} className="fill-paper text-fg-muted" {...stroke.hair} />
          {!thumb && (
            <text x={r2(cx + rd - 4.6)} y={r2(cy + 0.1)} textAnchor="middle" dominantBaseline="central" fontSize={2.1} stroke="none" className="fill-fg font-ui">
              28
            </text>
          )}
        </g>
      )}
      <g className={ink}>
        <polygon points={hand(HOUR, rd * 0.56, 1.8 * broad, 2.2, shape)} className="fill-current" stroke="none" />
        <polygon points={hand(MINUTE, rd * 0.84, 1.3 * broad, 2.6, shape)} className="fill-current" stroke="none" />
      </g>
      {s.complicationType === "gmt" && (
        <g className="text-accent-category">
          <line x1={cx} y1={cy} x2={r2(gmt(rd * 0.86 - 2.2, 0)[0])} y2={r2(gmt(rd * 0.86 - 2.2, 0)[1])} {...stroke.line} />
          <polygon points={pts([gmt(rd * 0.86, 0), gmt(rd * 0.86 - 2.6, -1.1), gmt(rd * 0.86 - 2.6, 1.1)])} className="fill-current" stroke="none" />
        </g>
      )}
      {s.complicationType !== "dress-subdial" && (
        <g className="text-accent-category">
          <line x1={r2(sec(-rd * 0.18, 0)[0])} y1={r2(sec(-rd * 0.18, 0)[1])} x2={r2(sec(rd * 0.9, 0)[0])} y2={r2(sec(rd * 0.9, 0)[1])} {...stroke.hair} />
          <circle cx={r2(sec(-rd * 0.12, 0)[0])} cy={r2(sec(-rd * 0.12, 0)[1])} r={0.7} className="fill-current" stroke="none" />
        </g>
      )}
      <circle cx={cx} cy={cy} r={0.9} className={`${ink} fill-current`} stroke="none" />

      {full && (
        <g>
          {/* side profile, crystal facing the front view */}
          <path d={profileLug(-1)} className="fill-paper" {...stroke.line} />
          <path d={profileLug(1)} className="fill-paper" {...stroke.line} />
          <rect x={r2(x3)} y={r2(cy - hk)} width={r2(x0 + T - x3)} height={r2(hk * 2)} rx={1.2} className="fill-paper" {...stroke.line} />
          <rect x={r2(x2)} y={r2(cy - R)} width={r2(x3 - x2)} height={r2(R * 2)} className="fill-paper" {...stroke.line} />
          <line x1={r2(x2 + (x3 - x2) * 0.18)} y1={r2(cy - R + 0.4)} x2={r2(x2 + (x3 - x2) * 0.18)} y2={r2(cy + R - 0.4)} className="text-fg-muted" {...stroke.hair} />
          <rect x={r2(x1)} y={r2(cy - hb)} width={r2(x2 - x1)} height={r2(hb * 2)} className="fill-paper" {...stroke.line} />
          {s.complicationType === "diver-bezel" &&
            Array.from({ length: Math.floor((hb * 2) / 1.3) }, (_, i) => cy - hb + 0.65 + i * 1.3).map((y) => (
              <line key={y} x1={r2(x1)} y1={r2(y)} x2={r2(x2)} y2={r2(y)} className="text-fg-muted" {...stroke.hair} />
            ))}
          <rect x={r2(x0)} y={r2(cy - hc)} width={r2(x1 - x0)} height={r2(hc * 2)} fill="currentColor" fillOpacity={0.06} {...stroke.line} />
          <circle cx={r2((x2 + x3) / 2)} cy={cy} r={2.2} className="fill-paper" {...stroke.line} />
          <circle cx={r2((x2 + x3) / 2)} cy={cy} r={1.4} {...stroke.hair} />

          {/* dimensions */}
          <Extension x1={cx - R} y1={cy - 3.2} x2={cx - R} y2={yD - 1.3} />
          <Extension x1={cx + R} y1={cy - 3.2} x2={cx + R} y2={yD - 1.3} />
          <Dimension x1={cx - R} y1={yD} x2={cx + R} y2={yD} />
          <Extension x1={cx - LW / 2 - 3.2} y1={cy - L / 2} x2={xL - 1.3} y2={cy - L / 2} />
          <Extension x1={cx - LW / 2 - 3.2} y1={cy + L / 2} x2={xL - 1.3} y2={cy + L / 2} />
          <Dimension x1={xL} y1={cy - L / 2} x2={xL} y2={cy + L / 2} />
          <Extension x1={x0} y1={cy + hc + 1.2} x2={x0} y2={yT + 1.3} />
          <Extension x1={x0 + T} y1={cy + hk + 1.2} x2={x0 + T} y2={yT + 1.3} />
          <Dimension x1={x0} y1={yT} x2={x0 + T} y2={yT} />
        </g>
      )}
    </>
  );

  return { w, h, svg, callouts, label };
}
