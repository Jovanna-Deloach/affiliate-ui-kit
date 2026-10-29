import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { StatusPill } from "@/primitives/status-pill";
import type { ProductSpecItem } from "@/types/affiliate";

import { SpecTooltip } from "./spec-tooltip";

/**
 * <SpecList />
 * ---------------------------------------------------------------------------
 * Technical key-value <dl>. Label left (muted), value right-aligned
 * (sans · medium · tabular), hairline under every row — never a collision on
 * the left with dead space on the right (audit fix #2).
 *
 *   --color-border-soft        row hairlines
 *   --color-surface-recessed   striped rows / highlighted rows / chips
 *   --space-row-pad            row density
 *   --font-sans (Law 1)        values are prose or numbers: never monospace
 *
 * Presentations
 *   striped-rows   alternating recessed rows
 *   dotted-leader  label ····· value (index-style leaders)
 *   two-col-grid   label | value grid, hairline per row (default)
 *   metric-chips   highlighted specs as big-number chips, rest as rows
 *
 * Tooltips (jargon definitions) are the only client leaf.
 */

const listVariants = cva("@container m-0 w-full min-w-0", {
  variants: {
    presentation: {
      "two-col-grid": "flex flex-col",
      "striped-rows": "flex flex-col",
      "dotted-leader": "flex flex-col",
      "metric-chips": "flex flex-col gap-row-pad",
    },
    density: {
      compact: "[--spec-pad:calc(var(--space-row-pad)*0.5)]",
      comfortable: "[--spec-pad:calc(var(--space-row-pad)*0.75)]",
    },
  },
  defaultVariants: { presentation: "two-col-grid", density: "comfortable" },
});

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
  presentation = "two-col-grid",
  density,
  className,
  ...props
}: SpecListProps) {
  const mode = presentation ?? "two-col-grid";
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
        <div data-slot="spec-chips" className="grid grid-cols-2 gap-cluster-gap @md:grid-cols-3">
          {chips.map((s) => (
            <div
              key={s.label}
              className="flex min-w-0 flex-col gap-[0.25em] rounded-interactive border-surface-w border-border-soft bg-surface-recessed px-row-pad py-[calc(var(--space-row-pad)*0.75)]"
            >
              <dt className="type-eyebrow flex items-start gap-[0.4em] text-muted">
                <span className="line-clamp-2 min-w-0">{s.label}</span>
                {s.tooltip && <SpecTooltip label={s.label}>{s.tooltip}</SpecTooltip>}
              </dt>
              <dd className="type-metric m-0 [--metric-size:calc(var(--text-metric)*0.8)]">
                {formatValue(s)}
              </dd>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div
          data-slot="spec-rows"
          className={cn(
            "flex min-w-0 flex-col",
            mode !== "metric-chips" && "border-t-surface-w border-border-soft",
          )}
        >
          {rest.map((s, i) => (
            <SpecRow key={s.label} spec={s} presentation={mode} index={i} />
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
      <span className="ml-[0.2em] text-muted">{s.unit}</span>
    </>
  ) : (
    s.value
  );
}

/** Numbers and numeric strings ("38 / 30", "< 0.1") get tabular figures; prose does not. */
function isNumeric(value: ProductSpecItem["value"]) {
  return typeof value === "number" || /^[\d\s.,/<>≤≥±%–-]+$/.test(String(value));
}

function SpecRow({
  spec,
  presentation,
  index,
}: {
  spec: ProductSpecItem;
  presentation: NonNullable<SpecListProps["presentation"]>;
  index: number;
}) {
  const leader = presentation === "dotted-leader";
  const striped = presentation === "striped-rows" && index % 2 === 0;
  // Grid, not flex: `auto` label + `1fr` value means a long prose value wraps on
  // the right instead of crushing the label, and the leader only ever takes
  // what is left between them.
  return (
    <div
      data-slot="spec-row"
      data-highlight={spec.isHighlight || undefined}
      className={cn(
        "grid min-w-0 items-baseline gap-x-cluster-gap py-(--spec-pad)",
        leader ? "grid-cols-[auto_minmax(1rem,1fr)_auto]" : "grid-cols-[auto_minmax(0,1fr)]",
        "border-b-surface-w border-border-soft",
        striped && "-mx-row-pad bg-surface-recessed px-row-pad",
        spec.isHighlight && presentation !== "metric-chips" && "[&>dt]:text-foreground",
      )}
    >
      <dt className="flex min-w-0 items-center gap-[0.4em] text-sm text-muted">
        <span className="min-w-0">{spec.label}</span>
        {spec.tooltip && <SpecTooltip label={spec.label}>{spec.tooltip}</SpecTooltip>}
        {spec.isHighlight && presentation !== "metric-chips" && (
          <StatusPill tone="neutral" size="sm" className="hidden @sm:inline-flex">
            Key
          </StatusPill>
        )}
      </dt>
      {leader && (
        <span
          aria-hidden="true"
          className="mb-[0.35em] self-end border-b-[length:var(--border-width-surface)] border-dotted border-border-strong"
        />
      )}
      <dd
        className={cn(
          "m-0 min-w-0 justify-self-end text-right text-sm font-medium text-foreground",
          isNumeric(spec.value) && "type-price",
        )}
      >
        {formatValue(spec)}
      </dd>
    </div>
  );
}

export { listVariants as specListVariants };
