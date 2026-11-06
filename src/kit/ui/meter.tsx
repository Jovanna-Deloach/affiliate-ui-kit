import { cn } from "@/lib/cn";

/**
 * A 6px meter: how much of something, at a glance. Decorative by design —
 * the figure it stands for is always printed beside it — so it is hidden
 * from screen readers.
 *
 *   continuous  a pill-ended fill on the track; any value above zero shows
 *               at least a sliver, so “16 of 100 ppb” never reads as empty
 *   mark        a 2px tick for a reference value (the test average)
 *   segments    the track split into n segments, the part-filled one
 *               clipped, never shrunk (the composite score’s ten)
 *
 * Tones: `meter` (ink, scores), `telemetry` (the category accent), `warn`,
 * `fail`, `muted` (below the reference).
 */
export interface MeterProps {
  value: number;
  /** The value that fills the track. */
  max?: number;
  /** A reference value drawn as a tick, on the same scale as `value`. */
  mark?: number;
  tone?: "meter" | "telemetry" | "warn" | "fail" | "muted";
  /** Split the track into this many equal segments. */
  segments?: number;
  className?: string;
}

const FILL = {
  meter: "bg-meter",
  telemetry: "bg-telemetry",
  warn: "bg-warn",
  fail: "bg-fail",
  muted: "bg-fg-muted",
} as const;

const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function Meter({ value, max = 1, mark, tone = "meter", segments, className }: MeterProps) {
  const share = max > 0 ? clamp(value / max) : 0;
  if (segments && segments > 1) {
    const filled = share * segments;
    return (
      <span data-slot="meter" aria-hidden="true" className={cn("grid gap-1", className)} style={{ gridTemplateColumns: `repeat(${segments}, minmax(0, 1fr))` }}>
        {Array.from({ length: segments }, (_, i) => (
          <span key={i} className="relative h-1.5 overflow-hidden rounded-full bg-line">
            <span className={cn("absolute inset-y-0 left-0", FILL[tone])} style={{ width: `${clamp(filled - i) * 100}%` }} />
          </span>
        ))}
      </span>
    );
  }
  const width = value > 0 ? Math.max(0.02, share) : 0;
  return (
    <span data-slot="meter" aria-hidden="true" className={cn("relative block h-1.5 overflow-hidden rounded-full bg-line", className)}>
      <span className={cn("absolute inset-y-0 left-0 rounded-full", FILL[tone])} style={{ width: `${width * 100}%` }} />
      {mark !== undefined && max > 0 && <span className="absolute inset-y-0 w-0.5 bg-fg" style={{ left: `${Math.min(clamp(mark / max), 0.99) * 100}%` }} />}
    </span>
  );
}
