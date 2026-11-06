import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

export interface PriceProps {
  /** The amount, in major units (21 = $21). */
  amount: number;
  /** ISO 4217 code. Default `USD`. */
  currency?: string;
  /** The list price before a discount: shown struck through before the amount, and only when higher than `amount`. */
  was?: number;
  /** The offer is sold out: the amount itself is struck through and muted. */
  soldOut?: boolean;
  /** `lg` the offer card and the lead verdict card · `md` compact cards (default) · `sm` tables and catalog cards · `xs` retailer rows. */
  size?: "lg" | "md" | "sm" | "xs";
  /** A caption on its own line under the amount: “at Northlane”, “+$10 vs. best”, “$0.21 a serving”. */
  note?: ReactNode;
  /** Alignment follows the parent’s text alignment; pass `text-right` here for a right-aligned column. */
  className?: string;
}

const AMOUNT = {
  lg: "t-price",
  md: "t-figure-table",
  sm: "t-ui font-semibold",
  xs: "t-small t-figure",
} as const;

const WAS = { lg: "t-small", md: "t-small", sm: "t-caption", xs: "t-caption" } as const;

/**
 * Money, set the one way the kit sets it: tabular, lining figures in the
 * text voice. Every amount on a page is a `Price`.
 *
 * **Use it for** any amount: an offer card, a verdict card, a table cell, a
 * catalog card, a caption. **Not for** a link to buy: `BuyButton`,
 * `BuyRow`, `BuyPill` and `BuyLink` are the links; `BuyRow` already sets its
 * own price.
 *
 * | size | set in | where |
 * | --- | --- | --- |
 * | `lg` | 1.5rem, bold | the offer card, the lead verdict card |
 * | `md` | 1.17rem, 600 | compact verdict cards |
 * | `sm` | 15px, 600 | tables and catalog cards |
 * | `xs` | 14px | retailer rows |
 *
 * `was` strikes the list price before the amount; `soldOut` strikes the
 * amount itself; `note` adds a caption line. Screen readers hear “Was $26,
 * now $21”.
 *
 * @summary Every amount of money: four sizes, a struck list price, a caption line, sold out.
 * @import import { Price } from "@/kit/ui";
 */
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
