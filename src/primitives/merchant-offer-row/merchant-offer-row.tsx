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
 * One retailer in a price-comparison list:
 * monogram · name + stock + semantic pills · price lockup · <AffiliateAction />.
 *
 *   --size-monogram / --radius-control        36px merchant tile
 *   --color-surface-recessed / --border-soft  tile + highlighted-row plane (Law 2)
 *   --space-row-pad                           density
 *   --color-positive(-soft) …                 stock dot + semantic pills
 *   type-price (Law 1)                        price = sans · semibold · tabular · tight
 *
 * Mobbin anatomy (Klarna web rows, Vipps / GoodRx iOS lists, Fable sheet):
 *   375 px → tile | name + meta | price; CTA drops to a full-width second
 *   line; ≥ 28rem container → one line with the CTA at the right.
 *
 * Out of stock: the row dims, the price strikes through and the action
 * becomes a muted ghost ("Check stock"). Server Component; only the CTA leaf
 * is client. Stock dots are static — no ripple in loops.
 */

const rowVariants = cva(["@container relative block min-w-0", "border-t-surface-w border-border-soft"], {
  variants: {
    density: {
      compact: "[--row-gap:calc(var(--space-row-pad)*0.5)] py-[calc(var(--space-row-pad)*0.75)]",
      comfortable: "[--row-gap:var(--space-row-pad)] py-row-pad",
    },
    highlight: {
      none: "",
      "best-price": "bg-surface-recessed border-l-emphasis-w border-l-accent px-cluster-gap",
      "primary-partner": "",
    },
    available: {
      true: "",
      false: "opacity-[0.55]",
    },
  },
  defaultVariants: { density: "comfortable", highlight: "none", available: true },
});

type Highlight = NonNullable<VariantProps<typeof rowVariants>["highlight"]>;

export interface MerchantOfferRowProps
  extends Omit<ComponentProps<"div">, "children" | "ref">,
    Omit<VariantProps<typeof rowVariants>, "highlight" | "available"> {
  offer: MerchantOffer;
  /** Lowest price in the comparison set → renders "+$10 vs. best" subtitles. */
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
  const primaryCta = resolvedHighlight !== "none" && offer.inStock;

  return (
    <Tag
      data-slot="merchant-offer-row"
      data-highlight={resolvedHighlight}
      data-in-stock={offer.inStock}
      className={cn(
        rowVariants({ density, highlight: resolvedHighlight, available: offer.inStock }),
        className,
      )}
      {...props}
    >
      <div
        data-slot="offer-grid"
        className={cn(
          "grid min-w-0 items-center gap-x-row-pad gap-y-(--row-gap)",
          "grid-cols-[auto_minmax(0,1fr)_auto] @md:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
        )}
      >
        <MerchantMonogram offer={offer} />

        {/* Identity + stock meta + semantic pills */}
        <div data-slot="offer-identity" className="flex min-w-0 flex-col gap-[0.3em]">
          <span className="truncate text-sm font-medium text-foreground">{offer.merchantName}</span>
          <span className="flex min-w-0 flex-wrap items-center gap-x-[0.6em] gap-y-[0.3em] text-xs text-muted">
            <span className="flex items-center gap-[0.45em]">
              <StockDot inStock={offer.inStock} />
              {offer.inStock ? "In stock" : "Out of stock"}
            </span>
            {resolvedHighlight === "best-price" && <StatusPill tone="positive">Best price</StatusPill>}
            {resolvedHighlight === "primary-partner" && <StatusPill tone="neutral">Our partner</StatusPill>}
            {offer.promoDescription && <StatusPill tone="positive">{offer.promoDescription}</StatusPill>}
          </span>
        </div>

        {/* Price lockup */}
        <div data-slot="offer-price" className="flex flex-col items-end gap-[0.2em] text-right">
          <span className="flex items-baseline gap-[0.5em]">
            {offer.originalPrice && offer.originalPrice > offer.price && offer.inStock && (
              <s className="text-xs tabular-nums text-muted">{formatPrice(offer.originalPrice, currency)}</s>
            )}
            <span
              className={cn(
                "type-price text-lg leading-none text-foreground",
                !offer.inStock && "line-through decoration-[length:var(--border-width-interactive)] text-muted",
              )}
            >
              {formatPrice(offer.price, currency)}
            </span>
          </span>
          {subtitle && offer.inStock && (
            <span className="text-xs leading-none text-muted">{subtitle}</span>
          )}
        </div>

        {/* CTA — full-width second line until the container is ≥ md */}
        <div data-slot="offer-cta" className="col-span-3 @md:col-span-1 @md:justify-self-end">
          <AffiliateAction
            href={offer.affiliateUrl}
            attribution={attribution}
            tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
            intent={primaryCta ? "primary-cta" : "merchant-outline"}
            size="sm"
            arrow={offer.inStock}
            className={cn("w-full @md:w-auto", !offer.inStock && "border-border bg-transparent text-muted")}
          >
            {ctaLabel ?? (offer.inStock ? "View deal" : "Check stock")}
          </AffiliateAction>
        </div>
      </div>
    </Tag>
  );
}

/** 36×36 monochrome merchant tile: wordmark image when supplied, else initials. */
function MerchantMonogram({ offer }: { offer: MerchantOffer }) {
  return (
    <span
      data-slot="offer-monogram"
      aria-hidden="true"
      className={cn(
        "flex size-monogram shrink-0 items-center justify-center overflow-hidden",
        "rounded-control border-surface-w border-border-soft bg-surface-recessed",
        "text-xs font-semibold tracking-metric text-foreground",
      )}
    >
      {offer.merchantLogoUrl ? (
        <Image
          src={offer.merchantLogoUrl}
          alt=""
          width={72}
          height={72}
          className="size-full object-contain p-[18%] grayscale"
        />
      ) : (
        initials(offer.merchantName)
      )}
    </span>
  );
}

function StockDot({ inStock }: { inStock: boolean }) {
  return (
    <span
      data-slot="stock-dot"
      aria-hidden="true"
      className={cn(
        "status-ripple inline-block size-[0.5em] shrink-0 rounded-full", // audit-allow: a dot is round
        inStock ? "bg-positive text-positive" : "bg-negative text-negative",
      )}
    />
  );
}

/** Convenience wrapper: a complete comparison list with reference-price deltas. */
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
      className={cn("flex min-w-0 flex-col border-b-surface-w border-border-soft", className)}
      {...props}
    >
      {offers.map((offer) => (
        <MerchantOfferRow key={offer.id} offer={offer} referencePrice={reference} {...rowProps} />
      ))}
    </ul>
  );
}

export { rowVariants as merchantOfferRowVariants };
