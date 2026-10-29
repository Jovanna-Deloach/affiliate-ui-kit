import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * <EditorialHeading />
 * ---------------------------------------------------------------------------
 * Tracked-out eyebrow + display heading + rank numeral. The three "voices"
 * (type-eyebrow / type-display / numeral) are composite token utilities, so
 * the same markup is a serif dossier in luxury-editorial and a bold sans
 * scorecard header in clinical-performance.
 *
 *   --tracking-eyebrow, --text-eyebrow, --transform-eyebrow   eyebrow voice
 *   --font-display, --text-display, --weight-display           heading voice
 *   --space-cluster-gap                                        vertical rhythm
 *
 * Mobbin anatomy (GetYourGuide numbered H2s, Relevance AI "#1 Best Choice"
 * band, ChatGPT shopping "Best overall" kicker): eyebrow precedes the title,
 * the rank reads as a label ("#1") or as an architectural numeral ("01").
 * At 375 px `split-numbered` keeps the numeral in a fixed left column so
 * long titles wrap beside it instead of pushing it off-axis.
 */

const headingVariants = cva("flex min-w-0 flex-col gap-y-[calc(var(--space-cluster-gap)*0.5)]", {
  variants: {
    alignment: {
      "left-dossier": "items-start text-left",
      "centered-magazine": "items-center text-center",
      "split-numbered": "grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-cluster-gap",
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
  /** Small tracked label above the title, e.g. "Best Overall Daily Trainer". */
  eyebrow?: ReactNode;
  /** The heading text. */
  title: ReactNode;
  /** Optional deck / standfirst under the title. */
  dek?: ReactNode;
  /** Position in a roundup. */
  rank?: number;
  /** `padded` → 01 · `hash` → #1 · `plain` → 1 */
  rankFormat?: RankFormat;
  /** Heading level for the title element. */
  as?: "h1" | "h2" | "h3" | "h4";
  /** id for QuickJumpBar / anchor targets. */
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
  alignment,
  size,
  className,
  ...props
}: EditorialHeadingProps) {
  const split = alignment === "split-numbered";
  const centered = alignment === "centered-magazine";
  const rankLabel = rank !== undefined ? formatRank(rank, rankFormat) : null;

  return (
    <header
      data-slot="editorial-heading"
      data-alignment={alignment ?? "left-dossier"}
      className={cn(headingVariants({ alignment, size }), className)}
      {...props}
    >
      {split && rankLabel !== null && (
        <span
          data-slot="heading-rank"
          aria-label={`Rank ${rank}`}
          className="type-display row-span-3 self-start text-muted tabular-nums"
          style={{ fontSize: "var(--heading-size)" }}
        >
          {rankLabel}
        </span>
      )}

      {(eyebrow || (!split && rankLabel !== null)) && (
        <p
          data-slot="heading-eyebrow"
          className={cn(
            "type-eyebrow flex min-w-0 items-center gap-cluster-gap text-muted",
            centered && "justify-center",
            centered &&
              "before:h-px before:w-[2em] before:bg-border after:h-px after:w-[2em] after:bg-border",
          )}
        >
          {!split && rankLabel !== null && (
            <span data-slot="heading-rank" className="text-foreground tabular-nums">
              {rankLabel}
            </span>
          )}
          {eyebrow && <span className="min-w-0">{eyebrow}</span>}
        </p>
      )}

      <Tag
        data-slot="heading-title"
        className="type-display min-w-0"
        style={{ fontSize: "var(--heading-size)" }}
      >
        {title}
      </Tag>

      {dek && (
        <p
          data-slot="heading-dek"
          className={cn(
            "mt-[calc(var(--space-cluster-gap)*0.5)] max-w-prose text-muted",
            centered && "mx-auto",
          )}
        >
          {dek}
        </p>
      )}
    </header>
  );
}

export { headingVariants as editorialHeadingVariants };
