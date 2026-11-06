import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

import { buttonStyles } from "./button";
import { Monogram } from "./marks";
import { Price } from "./price";

/*
 * Every monetized link in the kit. Built on AffiliateAction, so rel
 * (`sponsored nofollow noopener`), attribution and click tracking are
 * enforced; the kit only owns the look. Each link carries its offer’s price
 * and stock state as data attributes, so the audit and the story checks can
 * prove merchant order on the page a reader actually gets.
 */

/** What every buy link takes. */
export interface BuyProps {
  /** The retailer’s offer. Its `affiliateUrl` is the link; its price and stock are written to data attributes for the page checks. */
  offer: MerchantOffer;
  /** The product the offer is for, for click tracking. */
  productId: string;
  /** Where the link sits, for click tracking: `verdict-hero`, `verdict-card`, `deep-dive`, `deep-dive-row`, `comparison`, `catalogue`. */
  placement: string;
  /** Campaign attribution added to the link: source, medium, campaign. */
  attribution?: AffiliateAttribution;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

export interface BuyButtonProps extends BuyProps {
  /** The label. Default “Buy at {merchant}”. Say what happens, in sentence case; the face sets the capitals. */
  children?: ReactNode;
  /** `primary` filled, for the one pick in view (default) · `secondary` outlined, for every other card. */
  emphasis?: "primary" | "secondary";
  /** `md` 44px tall (default) · `lg` 48px. */
  size?: "md" | "lg";
  /** Spans its container, as in the offer card. */
  fullWidth?: boolean;
  /** Adds the outbound arrow icon after the label. */
  icon?: boolean;
}

const offerData = (offer: MerchantOffer) => ({ "data-offer-price": offer.price, "data-in-stock": String(offer.inStock), "data-merchant": offer.merchantName });

/**
 * The button that sends a reader to a retailer: the one button a product
 * gets in the place it is being decided on.
 *
 * **Use it for** the verdict cards and the offer card. `primary` (filled in
 * the action colour) is for the one pick in view; every other card takes
 * `secondary`. **Not for** a list of retailers (`BuyRow`), a table or a
 * catalogue card (`BuyPill`), prose (`BuyLink`), or an action that is not a
 * purchase (`Button`). One button per product: a second one fails the page
 * checks.
 *
 * @summary The one button per product to a retailer (verdict and offer cards); filled only for the pick in view.
 * @import import { BuyButton } from "@/kit/ui";
 */
export function BuyButton({ offer, productId, placement, attribution, children, className, emphasis = "primary", size = "md", fullWidth = false, icon = false }: BuyButtonProps) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta={emphasis}
      {...offerData(offer)}
      className={cn(buttonStyles({ emphasis, size, fullWidth }), className)}
    >
      {children ?? `Buy at ${offer.merchantName}`}
      {icon && <ArrowUpRight size="1.05em" strokeWidth={2} aria-hidden="true" />}
    </AffiliateAction>
  );
}

export interface BuyRowProps extends BuyProps {
  /** The lead price (the lowest in stock): the row says how far above it this offer sits, “+$40 vs. best”. */
  best?: number;
}

/**
 * Another retailer, as a 44px row whose whole width is the link: the
 * merchant’s monogram and name; the price, how far it sits above the best
 * price and a bordered “View” pill. In a container under 24rem the pill
 * keeps only its arrow, so the merchant keeps its width. A sold-out row is
 * muted, says so, and is not a link.
 *
 * **Use it for** every retailer after the lead one, in a list of rows
 * (`RetailerList` lays them out on hairlines). **Not for** the lead offer
 * (`OfferCard`) or a single link in a card (`BuyButton`, `BuyPill`).
 *
 * @summary A retailer as a full-width 44px row link: name, price, difference from the best price.
 * @import import { BuyRow } from "@/kit/ui";
 */
export function BuyRow({ offer, productId, placement, attribution, best, className }: BuyRowProps) {
  const grid = "grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 px-4";
  const currency = offer.currency ?? "USD";
  const delta = best !== undefined && offer.price > best ? offer.price - best : 0;
  if (!offer.inStock)
    return (
      <div data-cta="none" {...offerData(offer)} className={cn(grid, "text-fg-muted", className)}>
        <Monogram name={offer.merchantName} className="opacity-60" />
        <span className="truncate t-small">{offer.merchantName}</span>
        <span className="flex items-center gap-3">
          <Price amount={offer.price} currency={currency} soldOut size="xs" />
          <span className="t-micro-sm">Sold out</span>
        </span>
      </div>
    );
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta="row"
      {...offerData(offer)}
      className={cn("kit-focus group text-fg transition-colors duration-(--dur) ease-(--ease) hover:bg-paper", grid, className)}
    >
      <Monogram name={offer.merchantName} />
      <span className="truncate t-small font-medium">{offer.merchantName}</span>
      <span className="flex items-center gap-3">
        <Price
          amount={offer.price}
          currency={currency}
          size="xs"
          note={delta > 0 ? <span data-numeric>+{formatPrice(delta, currency)} vs. best</span> : undefined}
          className="text-right"
        />
        <span className="inline-flex h-7 items-center justify-center gap-1 rounded-ctl border border-line-strong bg-paper px-2.5 t-micro-sm text-fg transition-colors duration-(--dur) ease-(--ease) group-hover:border-fg">
          <span className="sr-only @sm:not-sr-only">View</span>
          <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
        </span>
      </span>
    </AffiliateAction>
  );
}

export interface BuyPillProps extends BuyProps {
  /** The label. Default “Buy”; write “Buy at {merchant}” where the retailer is not named beside it. */
  children?: ReactNode;
  /** Filled in the action colour: only for the row that leads, the page’s top pick. */
  filled?: boolean;
}

/**
 * A compact “Buy” pill to a retailer, for places where a 44px button would
 * crowd the row: a comparison table’s last column, a catalogue card. Bordered
 * by default; `filled` marks the one row that leads.
 *
 * **Use it for** tables and catalogue cards, beside the price it buys.
 * **Not for** a verdict or offer card (`BuyButton`) or a list of retailers
 * (`BuyRow`).
 *
 * @summary A compact Buy pill for tables and catalogue cards; filled only for the top pick.
 * @import import { BuyPill } from "@/kit/ui";
 */
export function BuyPill({ offer, productId, placement, attribution, children, filled = false, className }: BuyPillProps) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta="link"
      {...offerData(offer)}
      className={cn(
        "kit-focus inline-flex shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-ctl px-3.5 py-1.5 t-caption font-medium transition-colors duration-(--dur) ease-(--ease)",
        filled ? "bg-accent text-on-accent hover:bg-accent-hover" : "border border-line-strong bg-paper text-fg hover:border-fg",
        className,
      )}
    >
      {children ?? "Buy"}
      <ArrowUpRight size={13} strokeWidth={2} aria-hidden="true" />
    </AffiliateAction>
  );
}

export interface BuyLinkProps extends BuyProps {
  /** The link text. Default “Buy at {merchant}”; in prose, name the price and the retailer: “$3,950 at Haus & Field”. */
  children?: ReactNode;
}

/**
 * A retailer link inside a sentence: underlined, in the action colour, with
 * the same rel, attribution and tracking as every buy link.
 *
 * **Use it for** prose (“Our pick is $3,950 at Haus & Field”) and table
 * cells where a pill would be too loud. **Not for** a standalone action in
 * a card (`BuyButton`) or a plain `<a>` to a retailer, which the kit never
 * uses.
 *
 * @summary A retailer link inside a sentence, with the same tracking as every buy link.
 * @import import { BuyLink } from "@/kit/ui";
 */
export function BuyLink({ offer, productId, placement, attribution, children, className }: BuyLinkProps) {
  return (
    <AffiliateAction
      unstyled
      arrow={false}
      href={offer.affiliateUrl}
      attribution={attribution}
      tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
      data-cta="link"
      {...offerData(offer)}
      className={cn("kit-focus kit-link rounded-ctl t-ui text-accent", className)}
    >
      {children ?? `Buy at ${offer.merchantName}`}
    </AffiliateAction>
  );
}
