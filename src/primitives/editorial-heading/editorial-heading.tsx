import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <EditorialHeading />
 * ---------------------------------------------------------------------------
 * Index counter + tracked eyebrow + display heading + dek, with an optional
 * right-hand summary lockup (score / price + CTA) so wide containers balance.
 *
 *   --font-display / --text-display / --weight-display / --tracking-display /
 *   --leading-display                  display voice (Playfair 400 · Jakarta 600)
 *   --tracking-eyebrow …               eyebrow voice
 *   --font-mono (Law 1)                rank numerals ONLY ("01")
 *   --space-cluster-gap / --section-gap   rhythm
 *
 * Mobbin anatomy (GetYourGuide numbered H2s, Relevance AI "#1" band, ChatGPT
 * shopping kicker): the rank is an architectural index counter —
 * `01 ── BEST OVERALL DAILY TRAINER` (horizontal hairline) in left-dossier /
 * centered-magazine, and a numeral column with a vertical hairline in
 * split-numbered. At 375 px the aside stacks under the dek.
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
      "display-sm": "[--heading-size:var(--text-display-sm)]",
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
  /**
   * Right-hand summary lockup (composite score, starting price, primary CTA).
   * Rendered beside the text block on wide containers, below it on narrow.
   */
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
        "flex min-w-0 flex-col gap-y-[calc(var(--space-cluster-gap)*0.5)]",
        centered ? "items-center" : "items-start",
      )}
    >
      {(eyebrow || (!split && rankLabel !== null)) && (
        <p
          data-slot="heading-eyebrow"
          className={cn(
            "type-eyebrow flex min-w-0 items-center gap-[0.75em] text-muted",
            centered && "justify-center",
          )}
        >
          {!split && rankLabel !== null && (
            <>
              <span data-slot="heading-rank" className="type-label-mono text-foreground">
                {rankLabel}
              </span>
              <span aria-hidden="true" className="h-px w-[2em] shrink-0 bg-border-strong" />
            </>
          )}
          {eyebrow && <span className="min-w-0">{eyebrow}</span>}
        </p>
      )}

      <Tag data-slot="heading-title" className="type-display min-w-0" style={{ fontSize: "var(--heading-size)" }}>
        {title}
      </Tag>

      {dek && (
        <p
          data-slot="heading-dek"
          className={cn("mt-[calc(var(--space-cluster-gap)*0.5)] max-w-prose text-muted", centered && "mx-auto")}
        >
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
          "grid min-w-0 grid-cols-1 gap-y-row-pad",
          split && "grid-cols-[auto_minmax(0,1fr)] gap-x-row-pad",
          aside && !split && !centered && "@lg:grid-cols-[minmax(0,1fr)_auto] @lg:items-end @lg:gap-x-section-gap",
          aside && split && "@lg:grid-cols-[auto_minmax(0,1fr)_auto] @lg:items-end @lg:gap-x-section-gap",
        )}
      >
        {split && rankLabel !== null && (
          <span
            data-slot="heading-rank"
            aria-label={`Rank ${rank}`}
            className="self-start border-r-[length:var(--border-width-surface)] border-border-strong pr-row-pad font-mono font-medium tabular-nums leading-none text-foreground"
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
              "flex min-w-0 flex-wrap items-center gap-cluster-gap",
              split && "col-start-2 @lg:col-start-3",
              !centered && "@lg:justify-self-end",
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
