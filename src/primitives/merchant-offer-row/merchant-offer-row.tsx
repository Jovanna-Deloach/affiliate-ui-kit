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
 * One retailer in a price-comparison list. The LIST owns the column tracks
 * and every row is a CSS subgrid, so prices and CTAs share one vertical
 * axis across all rows (Law of Continuity) while a longer label widens its
 * track for every row instead of clipping:
 *
 *   ┌0┬ 40px ─┬ minmax(120px,1fr) ──┬ max-content ┬ ≥110px ─┬ ≥148px ─┬0┐
 *   │ │ mark  │ name                │ one pill    │ $189    │ CTA     │ │
 *   │ │       │ shipping · promo    │ (if any)    │ was/Δ   │         │ │
 *   └─┴───────┴─────────────────────┴─────────────┴─────────┴─────────┴─┘
 *   (zero-width gutter tracks + the 16px column gap give the row its inset)
 *
 * Quiet by default: in-stock is the normal state and gets no pill; the row
 * carries at most ONE pill — Best price, Our partner, or Out of stock.
 * Shipping and promo facts read as a muted caption under the name; the
 * price stack carries the was-price or the "+$21 vs. best" delta.
 *
 *   --keyline-monogram / --keyline-price / --keyline-cta   the tracks
 *   --surface-recessed + inset hairline ring                best-price row
 *                                                           (fill, never an indent)
 *   --row-y / --inset-cell-x                                row rhythm + inset
 *
 * Below a 40rem container (the list is the `@container`) the pill drops to a
 * second row and the CTA to a full-width third; the price keyline holds.
 * CTA labels are short verbs ("View deal", "Check availability" — about 18
 * characters at most): the track grows to the longest one in the list, and
 * only a label that could never fit beside the other four tracks would fall
 * back to an ellipsis.
 *
 * Out of stock: identity + price dim to 55 %, the price strikes through and
 * the action becomes a ghost "Check stock". Server Component; only the CTA
 * leaf is client. A bare row outside <MerchantOfferList /> lays out its own
 * tracks and needs a `@container` ancestor to reach the single-row layout.
 */

/**
 * Tracks. The first and last tracks are ZERO-WIDTH GUTTERS: together with the
 * column gap they inset the content by one gap on each side, so the row needs
 * no horizontal padding. (A subgrid's padding is carved out of its edge
 * tracks — padding a row would shrink the fixed 40px monogram track and the
 * mark would spill into the gap.) Content lives in columns 2 … n-1.
 */
const MOBILE_TRACKS = "grid-cols-[0_var(--keyline-monogram)_minmax(0,1fr)_minmax(var(--keyline-price),max-content)_0]";
const DESKTOP_TRACKS =
  "@min-[40rem]:grid-cols-[0_var(--keyline-monogram)_minmax(120px,1fr)_max-content_minmax(var(--keyline-price),max-content)_minmax(var(--keyline-cta),max-content)_0]";

const rowVariants = cva(
  // `dense` so an explicitly placed pill column still lands on row 1 after the price column.
  "grid min-w-0 grid-flow-dense items-center gap-x-stack gap-y-cluster py-(--offer-row-y)",
  {
    variants: {
      density: {
        compact: "[--offer-row-y:var(--row-y-compact)]",
        comfortable: "[--offer-row-y:var(--row-y)]",
      },
      highlight: {
        none: "",
        "best-price": "rounded-inner bg-recessed ring-1 ring-inset ring-hairline",
        "primary-partner": "",
      },
      /** Inside <MerchantOfferList />: adopt the list's tracks. */
      inList: {
        true: "col-span-full grid-cols-subgrid",
        false: [MOBILE_TRACKS, DESKTOP_TRACKS],
      },
    },
    defaultVariants: { density: "comfortable", highlight: "none", inList: false },
  },
);

type Highlight = NonNullable<VariantProps<typeof rowVariants>["highlight"]>;

export interface MerchantOfferRowProps
  extends Omit<ComponentProps<"div">, "children" | "ref">,
    Omit<VariantProps<typeof rowVariants>, "highlight" | "inList"> {
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
  /** Set by <MerchantOfferList />; the row becomes a subgrid of the list's tracks. */
  inList?: boolean;
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
  inList = false,
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
  const best = resolvedHighlight === "best-price";
  const dim = !offer.inStock;
  const delta =
    referencePrice !== undefined && offer.inStock && !best
      ? formatPriceDelta(offer.price, referencePrice, currency)
      : "";
  const wasPrice = offer.inStock && offer.originalPrice && offer.originalPrice > offer.price ? offer.originalPrice : undefined;
  const facts = [offer.shippingNote, offer.inStock ? offer.promoDescription : undefined].filter(Boolean);
  const pill = !offer.inStock ? (
    <StatusPill tone="negative" size="sm">
      Out of stock
    </StatusPill>
  ) : best ? (
    <StatusPill tone="positive" size="sm">
      Best price
    </StatusPill>
  ) : resolvedHighlight === "primary-partner" ? (
    <StatusPill tone="neutral" size="sm">
      Our partner
    </StatusPill>
  ) : null;

  return (
    <Tag
      data-slot="merchant-offer-row"
      data-highlight={resolvedHighlight}
      data-in-stock={offer.inStock}
      className={cn(rowVariants({ density, highlight: resolvedHighlight, inList }), className)}
      {...props}
    >
      <MerchantMonogram offer={offer} className={cn("col-start-2", dim && "opacity-55")} />

      {/* Identity: name + one muted fact line */}
      <div data-slot="offer-identity" className={cn("col-start-3 flex min-w-0 flex-col gap-hairline", dim && "opacity-55")}>
        <span className="truncate text-body-sm font-medium text-ink">{offer.merchantName}</span>
        {facts.length > 0 && <span className="truncate text-caption text-ink-tertiary">{facts.join(" · ")}</span>}
      </div>

      {/* Price stack on the price keyline, strictly right-aligned */}
      <div
        data-slot="offer-price"
        className={cn("col-start-4 flex min-w-0 flex-col items-end gap-hairline text-right @min-[40rem]:col-start-5", dim && "opacity-55")}
      >
        <span className={cn("type-metric whitespace-nowrap text-body text-ink", dim && "line-through text-ink-tertiary")}>
          {formatPrice(offer.price, currency)}
        </span>
        {wasPrice !== undefined ? (
          <s className="whitespace-nowrap text-caption tabular-nums text-ink-tertiary">{formatPrice(wasPrice, currency)}</s>
        ) : delta ? (
          <span className="whitespace-nowrap text-caption tabular-nums text-ink-tertiary">{delta} vs. best</span>
        ) : null}
      </div>

      {/* The one pill: full-width second row on mobile, right-aligned column on desktop */}
      {pill && (
        <div
          data-slot="offer-pill"
          className="col-span-3 col-start-2 flex min-w-0 items-center @min-[40rem]:col-span-1 @min-[40rem]:col-start-4 @min-[40rem]:justify-end"
        >
          {pill}
        </div>
      )}

      {/* CTA on the CTA keyline; full-width last row on mobile */}
      <div data-slot="offer-cta" className="col-span-3 col-start-2 @min-[40rem]:col-span-1 @min-[40rem]:col-start-6 @min-[40rem]:justify-self-stretch">
        <AffiliateAction
          href={offer.affiliateUrl}
          attribution={attribution}
          tracking={{ merchant: offer.merchantName, offerId: offer.id, productId, placement }}
          intent={!offer.inStock ? "ghost" : best ? "primary" : "outline"}
          width="full"
          arrow={offer.inStock}
        >
          {ctaLabel ?? (offer.inStock ? "View deal" : "Check stock")}
        </AffiliateAction>
      </div>
    </Tag>
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

/**
 * A complete comparison list. Owns the column tracks (rows are subgrids),
 * the `@container` that switches them, and the hairlines. The gutter tracks
 * inset every row by one gap so the best-price fill has breathing room; the
 * list bleeds by the same amount so content stays on its container's keyline.
 */
export function MerchantOfferList({
  offers,
  className,
  rowProps,
  ...props
}: Omit<ComponentProps<"ul">, "children"> & {
  offers: MerchantOffer[];
  rowProps?: Omit<MerchantOfferRowProps, "offer" | "referencePrice" | "as" | "inList">;
}) {
  const inStock = offers.filter((o) => o.inStock);
  const reference = (inStock.length ? inStock : offers).reduce<number | undefined>(
    (min, o) => (min === undefined || o.price < min ? o.price : min),
    undefined,
  );
  return (
    <div data-slot="merchant-offer-list" className="@container -mx-cell-x min-w-0">
      <ul
        className={cn(
          "m-0 grid min-w-0 list-none gap-x-stack divide-y divide-hairline border-y border-hairline p-0",
          MOBILE_TRACKS,
          DESKTOP_TRACKS,
          className,
        )}
        {...props}
      >
        {offers.map((offer) => (
          <MerchantOfferRow key={offer.id} offer={offer} referencePrice={reference} inList {...rowProps} />
        ))}
      </ul>
    </div>
  );
}

export { rowVariants as merchantOfferRowVariants };
