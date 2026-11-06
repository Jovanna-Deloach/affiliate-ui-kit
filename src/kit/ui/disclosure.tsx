import { Minus, Plus } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface DisclosureProps extends Omit<ComponentProps<"details">, "tw"> {
  /** Open on load. */
  open?: boolean;
  /** Disclosures that share a `name` form an accordion: opening one closes the others. */
  name?: string;
  /** A `DisclosureSummary` first, then the content it shows. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Show and hide with no script: a native `<details>`. Closed content stays
 * in the document, so search engines and find-in-page still reach it.
 * Compose it from three parts:
 *
 * ```tsx
 * <Disclosure>
 *   <DisclosureSummary>Label <DisclosureIcon /></DisclosureSummary>
 *   …content
 * </Disclosure>
 * ```
 *
 * **Use it for** steps of a method, a card’s specifications, a phone menu,
 * any content a reader opens on demand. **Not for** the full specifications
 * of a product (`SpecSheet` is that drawer, already composed) or content the
 * reader needs to decide (keep the verdict, price and buy link visible).
 *
 * @summary Show and hide with no script (native details): steps, drawers, menus.
 * @import import { Disclosure } from "@/kit/ui";
 */
export function Disclosure({ className, ...props }: DisclosureProps) {
  return <details className={cn("group/disclosure", className)} {...props} />;
}

export interface DisclosureSummaryProps extends Omit<ComponentProps<"summary">, "tw"> {
  /** The label, then a `DisclosureIcon`; laid out as a row with the icon at the end. */
  children: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The always-visible row that opens a `Disclosure`: a 44px target with the
 * kit focus ring, its label and its icon spaced apart.
 *
 * @summary The row that opens a Disclosure: a 44px target with label and icon.
 * @import import { DisclosureSummary } from "@/kit/ui";
 */
export function DisclosureSummary({ className, ...props }: DisclosureSummaryProps) {
  return (
    <summary
      className={cn("kit-focus flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden", className)}
      {...props}
    />
  );
}

export interface DisclosureIconProps {
  /** A bordered 28px square, for a card footer. Plain (24px) for lists of rows (default). */
  framed?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A plus that becomes a minus when its `Disclosure` is open. Decorative:
 * the `<details>` element tells assistive technology its state.
 *
 * @summary The plus/minus at the end of a DisclosureSummary; framed for card footers.
 * @import import { DisclosureIcon } from "@/kit/ui";
 */
export function DisclosureIcon({ framed = false, className }: DisclosureIconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center text-fg transition-colors duration-(--dur) ease-(--ease)",
        framed ? "size-7 rounded-ctl border border-line-strong group-hover/disclosure:border-fg" : "size-6 text-fg-muted group-hover/disclosure:text-fg",
        className,
      )}
    >
      <Plus size={framed ? 14 : 18} strokeWidth={framed ? 2 : 1.75} className="group-open/disclosure:hidden" />
      <Minus size={framed ? 14 : 18} strokeWidth={framed ? 2 : 1.75} className="hidden group-open/disclosure:block" />
    </span>
  );
}
