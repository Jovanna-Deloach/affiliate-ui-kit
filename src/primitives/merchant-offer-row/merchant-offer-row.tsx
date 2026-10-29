import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { ComponentProps, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice, formatPriceDelta, initials } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, MerchantOffer } from "@/types/affiliate";

/**
 * <MerchantOfferRow />
 * ---------------------------------------------------------------------------
 * One retailer in a price-comparison list: logo · name · stock · price ·
 * delta · <AffiliateAction />.
 *
 *   --space-row-pad       vertical density (scaled by `density`)
 *   --size-logo           wordmark height
 *   --border-width-*      hairline between rows, emphasis rail on highlight
 *   --color-accent-soft   best-price tint
 *   --color-positive / --color-negative / --color-caution   stock dot
 *
 * Mobbin anatomy (Klarna web rows, Vipps / GoodRx iOS lists, Fable sheet):
 *   375 px → logo | name + stock meta | price, CTA drops to a full-width
 *   second line; ≥ 28rem container → one line with the CTA at the right.
 *   Driven by container queries, so the same row works inside a sheet, a
 *   sidebar or a full-width table without props.
 *
 * Zero JS: the row is a Server Component; only the CTA leaf is a client
 * component (handlers, no animation controllers). Stock dots are static —
 * the status ripple mechanic is opt-in and never used in loops.
 */

/**
 * The <li> is the query container; the grid is its child. (An element can
 * never match its own container query, so the two must be separate.)
 */
const rowVariants = cva(
  [
    "@container relative block min-w-0",
    "border-t-surface-w border-border",
  ],
  {
    variants: {
      density: {
        compact: "[--row-gap:calc(var(--space-row-pad)*0.5)] py-[calc(var(--space-row-pad)*0.75)]",
        comfortable: "[--row-gap:var(--space-row-pad)] py-row-pad",
      },
      highlight: {
        none: "",
        "best-price": [
          "bg-accent-soft",
          "border-l-emphasis-w border-l-accent pl-cluster-gap pr-cluster-gap",
        ],
        "primary-partner": "",
      },
    },
    defaultVariants: { density: "comfortable", highlight: "none" },
  },
);

type Highlight = NonNullable<VariantProps<typeof rowVariants>["highlight"]>;

export interface MerchantOfferRowProps
  extends Omit<ComponentProps<"div">, "children" | "ref">,
    Omit<VariantProps<typeof rowVariants>, "highlight"> {
  offer: MerchantOffer;
  /** Lowest price in the comparison set → renders "+$10" deltas. */
  referencePrice?: number;
  /** `auto` derives from offer.isBestPrice / isPrimaryPartner. */
  highlight?: Highlight | "auto";
  /** Attribution forwarded to the CTA (campaign, subId…). */
  attribution?: AffiliateAttribution;
  productId?: string;
  /** Placement id for click analytics, e.g. "offer-list". */
  placement?: string;
  /** CTA label; defaults to "View deal" / "Check availability". */
  ctaLabel?: ReactNode;
  /** Render as <li> (default, inside a <ul>) or <div>. */
  as?: "li" | "div";
  showLogo?: boolean;
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
  showLogo = true,
  className,
  ...props
}: MerchantOfferRowProps) {
  // Assertion (not annotation): an annotated union would be control-flow narrowed back to "li" | "div".
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
  const isPrimaryCta = resolvedHighlight !== "none";

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
        "grid min-w-0 items-center gap-x-cluster-gap gap-y-(--row-gap)",
        "grid-cols-[auto_minmax(0,1fr)_auto] @md:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
      )}
     >
      {/* Logo / monogram */}
      <div data-slot="offer-logo" className="flex h-logo w-[calc(var(--size-logo)*4)] items-center">
        {showLogo && offer.merchantLogoUrl ? (
          <Image
            src={offer.merchantLogoUrl}
            alt=""
            width={120}
            height={24}
            className="h-logo w-auto max-w-full object-contain object-left"
          />
        ) : (
          <span
            aria-hidden="true"
            className="type-label-mono flex h-logo items-center rounded-badge border-interactive-w border-border px-[0.5em] text-muted"
          >
            {initials(offer.merchantName)}
          </span>
        )}
      </div>

      {/* Identity + stock meta */}
      <div data-slot="offer-identity" className="flex min-w-0 flex-col gap-[0.2em]">
        <span className="truncate text-sm font-medium text-foreground">{offer.merchantName}</span>
        <span className="type-label-mono flex min-w-0 items-center gap-[0.6em] text-muted">
          <StockDot inStock={offer.inStock} />
          <span className="truncate">
            {offer.inStock ? "In stock" : "Out of stock"}
            {resolvedHighlight === "best-price" && (
              <>
                {" · "}
                <span className="text-positive">Best price</span>
              </>
            )}
            {resolvedHighlight === "primary-partner" && " · Our partner"}
            {offer.promoDescription && (
              <>
                {" · "}
                <span className="text-foreground">{offer.promoDescription}</span>
              </>
            )}
          </span>
        </span>
      </div>

      {/* Price lockup */}
      <div
        data-slot="offer-price"
        className={cn(
          "flex flex-col items-end text-right tabular-nums",
          !offer.inStock && "text-muted",
        )}
      >
        <span className="flex items-baseline gap-[0.5em]">
          {offer.originalPrice && offer.originalPrice > offer.price && (
            <s className="font-mono text-xs text-muted decoration-[length:var(--border-width-interactive)]">
              {formatPrice(offer.originalPrice, currency)}
            </s>
          )}
          <span className="font-mono text-base font-weight-metric leading-none">
            {formatPrice(offer.price, currency)}
          </span>
        </span>
        {delta && <span className="type-label-mono text-muted">{delta}</span>}
      </div>

      {/* CTA — full-width second line until the container is ≥ md */}
      <div data-slot="offer-cta" className="col-span-3 @md:col-span-1 @md:justify-self-end">
        <AffiliateAction
          href={offer.affiliateUrl}
          attribution={attribution}
          tracking={{
            merchant: offer.merchantName,
            offerId: offer.id,
            productId,
            placement,
          }}
          intent={isPrimaryCta && offer.inStock ? "primary-cta" : "merchant-outline"}
          size="sm"
          className="w-full @md:w-auto"
        >
          {ctaLabel ?? (offer.inStock ? "View deal" : "Check availability")}
        </AffiliateAction>
      </div>
     </div>
    </Tag>
  );
}

function StockDot({ inStock }: { inStock: boolean }) {
  return (
    <span
      data-slot="stock-dot"
      aria-hidden="true"
      className={cn(
        "status-ripple inline-block size-[0.55em] shrink-0 rounded-full", // audit-allow: a dot is round
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
      className={cn("flex min-w-0 flex-col border-b-surface-w border-border", className)}
      {...props}
    >
      {offers.map((offer) => (
        <MerchantOfferRow key={offer.id} offer={offer} referencePrice={reference} {...rowProps} />
      ))}
    </ul>
  );
}

export { rowVariants as merchantOfferRowVariants };
