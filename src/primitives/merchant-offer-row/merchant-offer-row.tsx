import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { ComponentProps, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice, formatPriceDelta, initials } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { StatusPill } from "@/primitives/status-pill";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

/**
 * <MerchantOfferRow />
 * ---------------------------------------------------------------------------
 * One retailer in a price-comparison list, locked to FIVE keyline columns so
 * every price and every CTA across the list lands on one vertical axis
 * (Law of Continuity):
 *
 *   ┌ 40px ─┬ minmax(140px,1fr) ─┬ auto ───────┬ 110px ──┬ 148px ─┐
 *   │ mark  │ name · stock pill  │ price badge │ $199    │ CTA    │
 *   │       │                    │ (right)     │ shipping│ fixed  │
 *   └───────┴────────────────────┴─────────────┴─────────┴────────┘
 *
 *   --keyline-monogram / --keyline-price / --keyline-cta   the tracks
 *   --surface-recessed + inset hairline ring                best-price row
 *                                                           (fill, never an indent)
 *   --row-y                                                 12px row rhythm
 *
 * Below a 38rem container the badges take a full-width second row and the
 * CTA a full-width third; the price column keeps its 110px keyline. Rows
 * are inset 16px (`--inset-cell-x`) and <MerchantOfferList /> bleeds by the
 * same amount, so the content keyline matches the surrounding card.
 *
 * Out of stock: identity + price dim to 55 %, the price strikes through and
 * the action becomes a ghost "Check stock". Server Component; only the CTA
 * leaf is client.
 */

const rowVariants = cva("@container relative block min-w-0", {
  variants: {
    density: {
      compact: "[--offer-row-y:var(--row-y-compact)]",
      comfortable: "[--offer-row-y:var(--row-y)]",
    },
    highlight: {
      none: "",
      "best-price": "",
      "primary-partner": "",
    },
  },
  defaultVariants: { density: "comfortable", highlight: "none" },
});

type Highlight = NonNullable<VariantProps<typeof rowVariants>["highlight"]>;

export interface MerchantOfferRowProps
  extends Omit<ComponentProps<"div">, "children" | "ref">,
    Omit<VariantProps<typeof rowVariants>, "highlight"> {
  offer: MerchantOffer;
  /** Lowest price in the comparison set → "+$10 vs. best" subtitles. */
  referencePrice?: number;
  /** `auto` derives from offer.isBestPrice / isPrimaryPartner. */
  highlight?: Highlight | "auto";
  attribution?: AffiliateAttribution;
  productId?: string;
  placement?: string;
  ctaLabel?: ReactNode;
  as?: "li" | "div";
}

export function MerchantOfferRow({
  offer,
  referencePrice,
  highlight = "auto",
  density,
  attribution,
  productId,
  placement = "offer-list",
  ctaLabel,
  as = "li",
  className,
  ...props
}: MerchantOfferRowProps) {
  // Assertion (not annotation): an annotated union would be narrowed back to "li" | "div".
  const Tag = as as ElementType;
  const currency = offer.currency ?? "USD";
  const resolvedHighlight: Highlight =
    highlight === "auto"
      ? offer.isBestPrice
        ? "best-price"
        : offer.isPrimaryPartner
          ? "primary-partner"
          : "none"
      : highlight;
  const delta =
    referencePrice !== undefined && offer.inStock
      ? formatPriceDelta(offer.price, referencePrice, currency)
      : "";
  const subtitle = offer.shippingNote ?? (delta ? `${delta} vs. best price` : undefined);
  const best = resolvedHighlight === "best-price";
  const dim = !offer.inStock;
  const hasBadges = resolvedHighlight !== "none" || Boolean(offer.promoDescription && offer.inStock);

  return (
    <Tag
      data-slot="merchant-offer-row"
      data-highlight={resolvedHighlight}
      data-in-stock={offer.inStock}
      className={cn(rowVariants({ density, highlight: resolvedHighlight }), className)}
      {...props}
    >
      <div
        data-slot="offer-grid"
        className={cn(
          // `dense` so an explicitly placed column 3 (badges) still lands on row 1 after column 4 (price).
          "grid grid-flow-dense min-w-0 items-center gap-x-stack gap-y-cluster px-cell-x py-(--offer-row-y)",
          // Mobile: mark | identity | price · badges on row 2 · CTA full width on row 3.
          "grid-cols-[var(--keyline-monogram)_minmax(0,1fr)_var(--keyline-price)]",
          // ≥ 38rem container: the five keylines in one row (cells are placed explicitly by column).
          "@min-[38rem]:grid-cols-[var(--keyline-monogram)_minmax(140px,1fr)_auto_var(--keyline-price)_var(--keyline-cta)]",
          // Best price: recessed fill + inset hairline ring on the row itself —
          // the mark stays on the same axis as every other row (no indent).
          best && "rounded-inner bg-recessed ring-1 ring-inset ring-hairline",
        )}
      >
        <MerchantMonogram offer={offer} className={cn(dim && "opacity-55")} />

        {/* Col 2 — identity: name + stock pill */}
        <div data-slot="offer-identity" className={cn("flex min-w-0 flex-col gap-hairline", dim && "opacity-55")}>
          <span className="truncate text-body-sm font-medium text-ink">{offer.merchantName}</span>
          <span className="flex min-w-0 flex-wrap items-center gap-cluster">
            <StatusPill tone={offer.inStock ? "positive" : "negative"} size="sm">
              {offer.inStock ? "In stock" : "Out of stock"}
            </StatusPill>
          </span>
        </div>

        {/* Col 4 — price stack on the 110px keyline, strictly right-aligned */}
        <div
          data-slot="offer-price"
          className={cn("flex min-w-0 flex-col items-end gap-hairline text-right @min-[38rem]:col-start-4", dim && "opacity-55")}
        >
          <span className="flex items-baseline gap-[0.4em]">
            {offer.originalPrice && offer.originalPrice > offer.price && offer.inStock && (
              <s className="text-caption tabular-nums text-ink-tertiary">{formatPrice(offer.originalPrice, currency)}</s>
            )}
            <span className={cn("type-metric text-body text-ink", dim && "line-through text-ink-tertiary")}>
              {formatPrice(offer.price, currency)}
            </span>
          </span>
          {subtitle && offer.inStock && (
            <span className="truncate text-caption text-ink-tertiary">{subtitle}</span>
          )}
        </div>

        {/* Col 3 — commercial badges: full-width row 2 on mobile, right-aligned column on desktop */}
        {hasBadges && (
          <div
            data-slot="offer-badge"
            className="col-span-3 flex min-w-0 flex-wrap items-center gap-cluster @min-[38rem]:col-span-1 @min-[38rem]:col-start-3 @min-[38rem]:justify-end"
          >
            <OfferBadges highlight={resolvedHighlight} offer={offer} />
          </div>
        )}

        {/* Col 5 — CTA on the 148px keyline; full-width last row on mobile */}
        <div data-slot="offer-cta" className="col-span-3 @min-[38rem]:col-span-1 @min-[38rem]:col-start-5 @min-[38rem]:justify-self-end">
          <AffiliateAction
            href={offer.affiliateUrl}
            attribution={attribution}
            tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
            intent={!offer.inStock ? "ghost" : best ? "primary" : "outline"}
            width="full"
            arrow={offer.inStock}
            className="@min-[38rem]:w-cta"
          >
            {ctaLabel ?? (offer.inStock ? "View deal" : "Check stock")}
          </AffiliateAction>
        </div>
      </div>
    </Tag>
  );
}

/** Commercial state: Best price · Our partner · promo — status pills, never accolades. */
function OfferBadges({ highlight, offer }: { highlight: Highlight; offer: MerchantOffer }) {
  return (
    <>
      {highlight === "best-price" && (
        <StatusPill tone="positive" size="sm">
          Best price
        </StatusPill>
      )}
      {highlight === "primary-partner" && (
        <StatusPill tone="neutral" size="sm">
          Our partner
        </StatusPill>
      )}
      {offer.promoDescription && offer.inStock && (
        <StatusPill tone="neutral" size="sm">
          {offer.promoDescription}
        </StatusPill>
      )}
    </>
  );
}

/** 40×40 merchant mark on the first keyline: wordmark image when supplied, else initials. */
function MerchantMonogram({ offer, className }: { offer: MerchantOffer; className?: string }) {
  return (
    <span
      data-slot="offer-monogram"
      aria-hidden="true"
      className={cn(
        "flex size-monogram shrink-0 items-center justify-center overflow-hidden",
        "rounded-inner border border-hairline bg-recessed",
        "text-caption font-semibold tracking-metric text-ink",
        className,
      )}
    >
      {offer.merchantLogoUrl ? (
        <Image src={offer.merchantLogoUrl} alt="" width={80} height={80} className="size-full object-contain p-[18%] grayscale" />
      ) : (
        initials(offer.merchantName)
      )}
    </span>
  );
}

/** A complete comparison list: hairline-divided rows with reference-price deltas. */
export function MerchantOfferList({
  offers,
  className,
  rowProps,
  ...props
}: Omit<ComponentProps<"ul">, "children"> & {
  offers: MerchantOffer[];
  rowProps?: Omit<MerchantOfferRowProps, "offer" | "referencePrice" | "as">;
}) {
  const inStock = offers.filter((o) => o.inStock);
  const reference = (inStock.length ? inStock : offers).reduce<number | undefined>(
    (min, o) => (min === undefined || o.price < min ? o.price : min),
    undefined,
  );
  return (
    <ul
      data-slot="merchant-offer-list"
      // Rows are inset 16px so the best-price fill has breathing room; the list
      // bleeds by the same amount so content stays on its container's keyline.
      className={cn("-mx-cell-x flex min-w-0 flex-col divide-y divide-hairline border-y border-hairline", className)}
      {...props}
    >
      {offers.map((offer) => (
        <MerchantOfferRow key={offer.id} offer={offer} referencePrice={reference} {...rowProps} />
      ))}
    </ul>
  );
}

export { rowVariants as merchantOfferRowVariants };
