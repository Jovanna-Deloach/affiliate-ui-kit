import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <EditorialHeading />
 * ---------------------------------------------------------------------------
 * Index counter + tracked eyebrow + display heading + dek.
 *
 * Proportion (Law of Closure — no half-empty bars):
 *   • standalone → the lockup is constrained to a typographic measure
 *     (`--measure-heading`, 64ch); it never sprawls across a wide viewport.
 *   • with `aside` → a 7 / 5 column dossier bar: title lockup left, the
 *     Key-Metric / Price summary right-aligned behind a vertical hairline.
 *     Below a 48rem container the aside stacks under the dek behind a
 *     horizontal hairline.
 *
 *   --font-display / --text-display / --text-title   display voice (the tone)
 *   --keyline-rank                                   numeral column (split)
 *   --gap-stack / --gap-section                      rhythm
 *
 * Rank is an architectural index, never a badge:
 *   left / centered →  `01 ─── BEST OVERALL DAILY TRAINER`
 *   split-numbered  →  numeral column with a vertical hairline
 */

const headingVariants = cva("@container w-full min-w-0", {
  variants: {
    alignment: {
      "left-dossier": "",
      "centered-magazine": "text-center",
      "split-numbered": "",
    },
    size: {
      display: "[--heading-size:var(--text-display)]",
      title: "[--heading-size:var(--text-title)]",
    },
  },
  defaultVariants: { alignment: "left-dossier", size: "display" },
});

export type RankFormat = "padded" | "hash" | "plain";

export interface EditorialHeadingProps
  extends Omit<ComponentProps<"header">, "title">,
    VariantProps<typeof headingVariants> {
  eyebrow?: ReactNode;
  title: ReactNode;
  dek?: ReactNode;
  rank?: number;
  /** `padded` → 01 · `hash` → #1 · `plain` → 1 */
  rankFormat?: RankFormat;
  as?: "h1" | "h2" | "h3" | "h4";
  /** Key-metric / price summary block (score, starting price, CTA). */
  aside?: ReactNode;
  id?: string;
}

function formatRank(rank: number, format: RankFormat) {
  if (format === "hash") return `#${rank}`;
  if (format === "plain") return String(rank);
  return String(rank).padStart(2, "0");
}

export function EditorialHeading({
  eyebrow,
  title,
  dek,
  rank,
  rankFormat = "padded",
  as: Tag = "h2",
  alignment = "left-dossier",
  size,
  aside,
  className,
  ...props
}: EditorialHeadingProps) {
  const split = alignment === "split-numbered";
  const centered = alignment === "centered-magazine";
  const rankLabel = rank !== undefined ? formatRank(rank, rankFormat) : null;

  const textBlock = (
    <div
      data-slot="heading-text"
      className={cn(
        "flex min-w-0 max-w-heading flex-col gap-cluster",
        centered ? "mx-auto items-center" : "items-start",
      )}
    >
      {(eyebrow || (!split && rankLabel !== null)) && (
        <p
          data-slot="heading-eyebrow"
          className={cn("type-eyebrow m-0 flex min-w-0 items-center gap-cluster text-ink-secondary", centered && "justify-center")}
        >
          {!split && rankLabel !== null && (
            <>
              <span data-slot="heading-rank" className="type-mono text-ink">
                {rankLabel}
              </span>
              <span aria-hidden="true" className="h-px w-[2em] shrink-0 bg-strong" />
            </>
          )}
          {eyebrow && <span className="min-w-0">{eyebrow}</span>}
        </p>
      )}

      <Tag data-slot="heading-title" className="type-display m-0 min-w-0" style={{ fontSize: "var(--heading-size)" }}>
        {title}
      </Tag>

      {dek && (
        <p data-slot="heading-dek" className={cn("m-0 max-w-prose text-body leading-body text-ink-secondary", centered && "mx-auto")}>
          {dek}
        </p>
      )}
    </div>
  );

  return (
    <header
      data-slot="editorial-heading"
      data-alignment={alignment}
      className={cn(headingVariants({ alignment, size }), className)}
      {...props}
    >
      <div
        className={cn(
          "grid min-w-0 grid-cols-1 gap-y-stack",
          split && "grid-cols-[var(--keyline-rank)_minmax(0,1fr)] gap-x-stack",
          // Dossier bar: 7 / 5 columns, the summary block right-aligned behind a vertical hairline.
          aside && !centered && !split && "@3xl:grid-cols-[7fr_5fr] @3xl:gap-x-section",
          aside && split && "@3xl:grid-cols-[var(--keyline-rank)_7fr_5fr] @3xl:gap-x-stack",
        )}
      >
        {split && rankLabel !== null && (
          <span
            data-slot="heading-rank"
            aria-label={`Rank ${rank}`}
            className="self-start border-r border-strong pr-cluster font-mono font-medium leading-none tabular-nums text-ink"
            style={{ fontSize: "var(--heading-size)" }}
          >
            {rankLabel}
          </span>
        )}
        {textBlock}
        {aside && (
          <div
            data-slot="heading-aside"
            className={cn(
              "flex min-w-0 flex-wrap items-center gap-stack border-t border-hairline pt-stack",
              split && "col-start-2 @3xl:col-start-3",
              !centered && "@3xl:content-center @3xl:justify-end @3xl:border-t-0 @3xl:border-l @3xl:pl-section @3xl:pt-0",
              centered && "justify-center",
            )}
          >
            {aside}
          </div>
        )}
      </div>
    </header>
  );
}

export { headingVariants as editorialHeadingVariants };
