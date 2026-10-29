import * as Progress from "@radix-ui/react-progress";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <MicroMeter />
 * ---------------------------------------------------------------------------
 * Measured value + 80px threshold track for dense rows (assay results, spec
 * limits):  `0.08 µg  ▬▬▬▭▭▭▭▭▭▭  16% of limit`.
 *
 *   --size-micro-meter / --size-track-sm   80px × 6px track
 *   --status-*                             fill by verdict tone (ink by default)
 *
 * Server Component; Radix Progress carries the ARIA label.
 */

const fillVariants = cva("meter-fill h-full rounded-pill", {
  variants: {
    tone: {
      ink: "bg-meter-fill",
      positive: "bg-positive",
      caution: "bg-caution",
      negative: "bg-negative",
    },
  },
  defaultVariants: { tone: "ink" },
});

export interface MicroMeterProps
  extends Omit<ComponentProps<"span">, "children">,
    VariantProps<typeof fillVariants> {
  /** Measured value, already formatted ("0.08 µg"). */
  value: ReactNode;
  /** 0–100 fill of the threshold track. */
  pct: number;
  /** "16% of limit" — rendered under the track and used as the ARIA value text. */
  caption?: string;
}

export function MicroMeter({ value, pct, caption, tone, className, ...props }: MicroMeterProps) {
  const clamped = Math.max(0, Math.min(100, Number.isFinite(pct) ? pct : 0));
  return (
    <span
      data-slot="micro-meter"
      className={cn("grid w-fit grid-cols-[auto_var(--size-micro-meter)] items-center gap-x-cluster gap-y-hairline", className)}
      {...props}
    >
      <span className="type-metric whitespace-nowrap text-right text-body-sm text-ink">{value}</span>
      <Progress.Root
        value={clamped}
        max={100}
        getValueLabel={() => caption ?? `${Math.round(clamped)}%`}
        className="h-track-sm w-micro-meter overflow-hidden rounded-pill bg-meter-track"
      >
        <Progress.Indicator className={fillVariants({ tone })} style={{ "--pct": clamped } as CSSProperties} />
      </Progress.Root>
      {caption && <span className="col-span-2 truncate text-right text-caption text-ink-tertiary">{caption}</span>}
    </span>
  );
}

export { fillVariants as microMeterFillVariants };
