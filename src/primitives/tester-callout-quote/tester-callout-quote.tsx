import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";
import type { Author } from "@/primitives/authority-byline";
import { StatusPill } from "@/primitives/status-pill";

/**
 * <TesterCalloutQuote />
 * ---------------------------------------------------------------------------
 * Field-tester observation block inside a review.
 *
 *   ▌ Recessed well (Plane 2), ink rule on the left, container radius on the
 *   ▌ right edge only — the rule is the keyline the quote hangs from.
 *   ▌
 *   ▌ “Quote in the display voice, held to a 62ch measure …”
 *   ▌
 *   ▌ ┌ 32px ┬ minmax(0,1fr) ───────────┬ max-content ──────┐
 *   ▌ │ photo│ Celeste Marchetti        │ [LOGGED 140 MILES]│
 *   ▌ │      │ Watches & Jewellery Ed.  │                   │
 *   ▌ └──────┴──────────────────────────┴───────────────────┘
 *
 *   --surface-recessed / --radius-container / --inset-well   the well
 *   --border-width-emphasis + --ink-primary                  left rule
 *   --size-portrait-xs / --radius-inner                      tester photo
 *   --measure-prose                                          quote measure
 *
 * The metric ("Logged 140 miles") is a technical chip — a measured fact,
 * not an accolade and not a status. Server Component, zero JS.
 */

const quoteVariants = cva("m-0 flex min-w-0 flex-col gap-stack", {
  variants: {
    tone: {
      /** Plane-2 well with the ink rule. */
      recessed: "rounded-r-container border-l-emphasis border-l-ink bg-recessed p-well",
      /** Rule only — for already-recessed contexts. */
      rule: "border-l-emphasis border-l-ink pl-well py-cluster",
    },
    size: {
      md: "",
      lg: "[--quote-size:var(--text-display)]",
    },
  },
  defaultVariants: { tone: "recessed", size: "md" },
});

export interface TesterCalloutQuoteProps
  extends Omit<ComponentProps<"figure">, "children">,
    VariantProps<typeof quoteVariants> {
  quote: ReactNode;
  tester: Author;
  /** Testing metric shown as a technical chip: "Logged 140 miles". */
  metric?: ReactNode;
}

export function TesterCalloutQuote({ quote, tester, metric, tone, size, className, ...props }: TesterCalloutQuoteProps) {
  return (
    <figure data-slot="tester-callout-quote" className={cn(quoteVariants({ tone, size }), className)} {...props}>
      <blockquote className="m-0 max-w-prose">
        <p className="type-title m-0 text-ink [font-size:var(--quote-size,var(--text-title))]">
          <span aria-hidden="true">“</span>
          {quote}
          <span aria-hidden="true">”</span>
        </p>
      </blockquote>
      <figcaption className="grid grid-cols-[var(--size-portrait-xs)_minmax(0,1fr)_max-content] items-center gap-x-inline">
        <span
          data-slot="tester-photo"
          className="relative flex size-portrait-xs shrink-0 items-center justify-center overflow-hidden rounded-inner bg-surface text-ink-secondary ring-1 ring-inset ring-strong"
        >
          {tester.avatar ? (
            <Image src={tester.avatar.src} alt={tester.avatar.alt} fill sizes="64px" className="object-cover" />
          ) : (
            <span aria-hidden="true" className="text-caption font-semibold tracking-metric">
              {initials(tester.name)}
            </span>
          )}
        </span>
        <span className="flex min-w-0 flex-col gap-hairline">
          <span className="truncate text-body-sm font-medium text-ink">{tester.name}</span>
          {tester.role && <span className="truncate text-caption text-ink-tertiary">{tester.role}</span>}
        </span>
        {metric && (
          <StatusPill kind="technical" className="justify-self-end">
            {metric}
          </StatusPill>
        )}
      </figcaption>
    </figure>
  );
}

export { quoteVariants as testerCalloutQuoteVariants };
