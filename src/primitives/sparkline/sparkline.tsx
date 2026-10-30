import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * <Sparkline />
 * ---------------------------------------------------------------------------
 * A price series as one hairline polyline with an end dot — the Uniswap /
 * Perplexity watchlist glyph, sanitized: no axes, no fill, no runtime.
 * Pure SVG from the server; tone comes from the series' direction unless
 * overridden. Sized by `--size-sparkline` × `--size-sparkline-h`; the
 * stroke is the hairline emphasis width so it matches the kit's rules.
 *
 *   --status-positive-ink   a fall (a price that dropped is good news)
 *   --status-caution-ink    a rise
 *   --ink-tertiary          flat
 */
export interface SparklineProps extends Omit<ComponentProps<"svg">, "children" | "values"> {
  values: number[];
  tone?: "auto" | "positive" | "caution" | "neutral";
  /** Accessible description; omit to hide from assistive tech (when the figures sit beside it). */
  label?: string;
}

const W = 80;
const H = 24;
const PAD = 2;

export function Sparkline({ values, tone = "auto", label, className, ...props }: SparklineProps) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = values.map((v, i) => {
    const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (v - min) / span) * (H - PAD * 2);
    return [Number(x.toFixed(2)), Number(y.toFixed(2))] as const;
  });
  const first = values[0]!;
  const last = values[values.length - 1]!;
  const resolved = tone === "auto" ? (last < first ? "positive" : last > first ? "caution" : "neutral") : tone;
  const end = points[points.length - 1]!;
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-slot="sparkline"
      data-tone={resolved}
      className={cn(
        "h-sparkline-h w-sparkline shrink-0 overflow-visible",
        resolved === "positive" && "text-positive-ink",
        resolved === "caution" && "text-caution-ink",
        resolved === "neutral" && "text-ink-tertiary",
        className,
      )}
      {...props}
    >
      <polyline
        points={points.map(([x, y]) => `${x},${y}`).join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={end[0]} cy={end[1]} r="2" fill="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
