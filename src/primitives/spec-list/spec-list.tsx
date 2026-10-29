import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ProductSpecItem } from "@/types/affiliate";

import { SpecTooltip } from "./spec-tooltip";

/**
 * <SpecList />
 * ---------------------------------------------------------------------------
 * Technical key-value <dl> on a fixed LABEL KEYLINE (Law of Proximity: a
 * value never drifts more than the label column away from its label):
 *
 *   ┌ 180px ──────────┬ 1fr ────────────────────────┐
 *   │ Weight          │ 8.4 oz                      │  hairline
 *   │ Stack height ⓘ  │ 38 / 30 mm                  │  hairline
 *   │ Outsole rubber  │ Carbon rubber heel, blown … │  (wraps on the right)
 *   └─────────────────┴─────────────────────────────┘
 *
 *   --keyline-label        180px label track (≥ 24rem container; 38% below)
 *   --row-y / --row-y-compact   row rhythm
 *   --border-hairline      row rules
 *   --surface-recessed     metric chips
 *
 * Presentations
 *   keyline       one column of keyline rows (default)
 *   two-column    two columns of keyline rows at ≥ 40rem (`--gap-column`)
 *   leader        label ····· value, value on the right edge (narrow cells only)
 *   metric-chips  `isHighlight` specs as recessed metric chips, rest as rows
 *
 * Numbers get tabular figures; prose values do not. Tooltips are the only
 * client leaf.
 */

const listVariants = cva("@container m-0 w-full min-w-0", {
  variants: {
    presentation: {
      keyline: "",
      "two-column": "",
      leader: "",
      "metric-chips": "flex flex-col gap-stack",
    },
    density: {
      compact: "[--spec-row-y:var(--row-y-compact)]",
      comfortable: "[--spec-row-y:var(--row-y)]",
    },
  },
  defaultVariants: { presentation: "keyline", density: "comfortable" },
});

type Presentation = NonNullable<VariantProps<typeof listVariants>["presentation"]>;

export interface SpecListProps
  extends Omit<ComponentProps<"dl">, "children">,
    VariantProps<typeof listVariants> {
  specs: ProductSpecItem[];
  /** Pull `isHighlight` specs to the top. */
  highlightFirst?: boolean;
  /** Cap rows (pair with ProgressiveCollapse for the rest). */
  limit?: number;
}

export function SpecList({
  specs,
  highlightFirst = false,
  limit,
  presentation,
  density,
  className,
  ...props
}: SpecListProps) {
  const mode: Presentation = presentation ?? "keyline";
  const ordered = highlightFirst
    ? [...specs].sort((a, b) => Number(Boolean(b.isHighlight)) - Number(Boolean(a.isHighlight)))
    : specs;
  const rows = limit ? ordered.slice(0, limit) : ordered;
  const chips = mode === "metric-chips" ? rows.filter((s) => s.isHighlight) : [];
  const rest = mode === "metric-chips" ? rows.filter((s) => !s.isHighlight) : rows;

  return (
    <dl
      data-slot="spec-list"
      data-presentation={mode}
      className={cn(listVariants({ presentation: mode, density }), className)}
      {...props}
    >
      {chips.length > 0 && (
        <div data-slot="spec-chips" className="grid grid-cols-2 gap-cluster @md:grid-cols-3">
          {chips.map((s) => (
            <div
              key={s.label}
              className="flex min-w-0 flex-col gap-hairline rounded-inner border border-hairline bg-recessed px-stack py-cluster"
            >
              <dt className="type-eyebrow flex items-start gap-[0.4em] text-ink-tertiary">
                <span className="line-clamp-2 min-w-0">{s.label}</span>
                {s.tooltip && <SpecTooltip label={s.label}>{s.tooltip}</SpecTooltip>}
              </dt>
              <dd className="type-metric m-0 text-title text-ink">{formatValue(s)}</dd>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div
          data-slot="spec-rows"
          className={cn(
            "min-w-0 border-t border-hairline",
            mode === "two-column" ? "grid grid-cols-1 @2xl:grid-cols-2 @2xl:gap-x-column" : "flex flex-col",
          )}
        >
          {rest.map((s) => (
            <SpecRow key={s.label} spec={s} leader={mode === "leader"} />
          ))}
        </div>
      )}
    </dl>
  );
}

function formatValue(s: ProductSpecItem): ReactNode {
  return s.unit ? (
    <>
      {s.value}
      <span className="ml-[0.2em] font-normal text-ink-tertiary">{s.unit}</span>
    </>
  ) : (
    s.value
  );
}

/** Numbers and numeric strings ("38 / 30", "< 0.1") get tabular figures; prose does not. */
function isNumeric(value: ProductSpecItem["value"]) {
  return typeof value === "number" || /^[\d\s.,/<>≤≥±%–-]+$/.test(String(value));
}

function SpecRow({ spec, leader }: { spec: ProductSpecItem; leader: boolean }) {
  return (
    <div
      data-slot="spec-row"
      data-highlight={spec.isHighlight || undefined}
      className={cn(
        "grid min-w-0 items-baseline gap-x-stack border-b border-hairline py-(--spec-row-y)",
        leader
          ? "grid-cols-[auto_minmax(1rem,1fr)_auto]"
          : "grid-cols-[minmax(6rem,38%)_minmax(0,1fr)] @md:grid-cols-[var(--keyline-label)_minmax(0,1fr)]",
      )}
    >
      <dt className={cn("flex min-w-0 items-center gap-[0.4em] text-body-sm text-ink-secondary", spec.isHighlight && "text-ink")}>
        <span className="min-w-0">{spec.label}</span>
        {spec.tooltip && <SpecTooltip label={spec.label}>{spec.tooltip}</SpecTooltip>}
      </dt>
      {leader && (
        <span aria-hidden="true" className="mb-[0.35em] self-end border-b border-dotted border-strong" />
      )}
      <dd
        className={cn(
          "m-0 min-w-0 text-body-sm font-medium text-ink",
          leader ? "text-right" : "text-left",
          isNumeric(spec.value) && "type-metric",
        )}
      >
        {formatValue(spec)}
      </dd>
    </div>
  );
}

export { listVariants as specListVariants };
