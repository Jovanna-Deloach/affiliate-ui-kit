import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

/**
 * A price, the one way the kit sets money: tabular, lining figures in the
 * text voice, at four sizes.
 *
 *   lg  1.5rem bold     the offer card, the lead verdict card
 *   md  18.75px, 600    compact verdict cards
 *   sm  15px, 600       tables and catalogue cards
 *   xs  14px            retailer rows
 *
 * `was` sets the list price struck through before the amount (only when it
 * is higher); `soldOut` strikes the amount itself. `note` is a caption on
 * its own line: the retailer, how far above the best price, a per-serving
 * figure. Alignment follows the surrounding text (`text-right` on the
 * parent or on `className`), so one component serves left-aligned cards and
 * right-aligned table columns. Screen readers hear “Was $26, now $21”.
 */
export interface PriceProps {
  /** The amount, in major units (21 = $21). */
  amount: number;
  /** ISO 4217 code. */
  currency?: string;
  /** The list price before a discount; shown struck through, and only when higher than `amount`. */
  was?: number;
  /** The offer is sold out: the amount is struck through and muted. */
  soldOut?: boolean;
  size?: "lg" | "md" | "sm" | "xs";
  /** A caption under the amount: “at Northlane”, “+$10 vs. best”, “$0.21 a serving”. */
  note?: ReactNode;
  className?: string;
}

const AMOUNT = {
  lg: "t-price",
  md: "t-figure-table",
  sm: "t-ui font-semibold",
  xs: "t-small t-figure",
} as const;

const WAS = { lg: "t-small", md: "t-small", sm: "t-caption", xs: "t-caption" } as const;

export function Price({ amount, currency = "USD", was, soldOut = false, size = "md", note, className }: PriceProps) {
  const listPrice = !soldOut && was !== undefined && was > amount ? was : undefined;
  const figure = formatPrice(amount, currency);
  return (
    <span data-slot="price" className={cn("inline-block", className)}>
      {/* The size sits on the line itself, so its line box is the amount’s, not the parent’s. */}
      <span className={cn("block whitespace-nowrap", AMOUNT[size])}>
        {listPrice !== undefined && (
          <s data-numeric className={cn("mr-2 text-fg-muted", WAS[size])}>
            <span className="sr-only">Was </span>
            {formatPrice(listPrice, currency)}
          </s>
        )}
        {soldOut ? (
          <s data-numeric className="text-fg-muted">
            {figure}
          </s>
        ) : (
          <span data-numeric className="text-fg">
            {listPrice !== undefined && <span className="sr-only">now </span>}
            {figure}
          </span>
        )}
      </span>
      {note && <span className="block t-caption text-fg-muted">{note}</span>}
    </span>
  );
}
