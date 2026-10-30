import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { AffiliateAction } from "@/primitives/affiliate-action";
import type { AffiliateAttribution, AffiliateProductEntity, MerchantOffer } from "@/types/affiliate";

/**
 * <InlineProductMention />
 * ---------------------------------------------------------------------------
 * Mid-article product callout that sits inside the prose flow.
 *
 * block (default) — a compact Plane-2 bar on four keylines:
 *
 *   ┌ 44px ─┬ minmax(0,1fr) ─────────┬ max-content ──┬ max-content ┐
 *   │ thumb │ BRAND · eyebrow        │ $189          │ [ VIEW → ]  │
 *   │       │ Product title          │ at Northlane  │             │
 *   └───────┴────────────────────────┴───────────────┴─────────────┘
 *
 *   Below a 28rem container the price keeps its column and the CTA drops to
 *   a full-width second row — the bar never squeezes its own label.
 *
 * inline — a sentence-level chip (thumb · title · price · arrow) that flows
 * with the text and matches the body line box (24px) so it never jogs the
 * leading of the paragraph it sits in; the whole chip is the affiliate link.
 *
 *   --surface-recessed / --border-hairline / --radius-inner   the bar
 *   --size-thumb / --radius-tag                                thumbnail
 *   --inset-compact / --gap-inline                             bar inset + cell gap
 *   type-metric                                                price
 *
 * Mobbin anatomy (lululemon "Shop this look" rows, Instacart item rows):
 * thumbnail | name + meta | price | one action. Server Component; the CTA
 * is the only client leaf.
 */

const mentionVariants = cva("", {
  variants: {
    variant: {
      block: [
        "@container w-full min-w-0",
      ],
      inline: [
        "inline-flex max-w-full items-center gap-cluster align-middle",
        "rounded-control border border-hairline bg-recessed px-cluster py-pill-y text-body-sm text-ink",
        "transition-colors duration-interactive ease-standard hover:border-strong",
      ],
    },
  },
  defaultVariants: { variant: "block" },
});

export interface InlineProductMentionProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof mentionVariants> {
  product: AffiliateProductEntity;
  /** The offer to quote; defaults to the cheapest in-stock offer. */
  offer?: MerchantOffer;
  ctaLabel?: ReactNode;
  attribution?: AffiliateAttribution;
  placement?: string;
}

function cheapest(product: AffiliateProductEntity): MerchantOffer | undefined {
  const inStock = product.offers.filter((o) => o.inStock);
  return (inStock.length ? inStock : product.offers).reduce<MerchantOffer | undefined>(
    (min, o) => (!min || o.price < min.price ? o : min),
    undefined,
  );
}

export function InlineProductMention({
  product,
  offer,
  ctaLabel = "View",
  attribution,
  placement = "inline-mention",
  variant = "block",
  className,
  ...props
}: InlineProductMentionProps) {
  const resolvedOffer = offer ?? cheapest(product);
  const price = resolvedOffer ? formatPrice(resolvedOffer.price, resolvedOffer.currency ?? "USD") : undefined;
  const tracking = resolvedOffer
    ? { merchant: resolvedOffer.merchantName, offerId: resolvedOffer.id, productId: product.id, placement }
    : { productId: product.id, placement };

  if (variant === "inline") {
    if (!resolvedOffer) return null;
    // asChild: the chip's own <a> is the slotted element, so its cells stay
    // direct flex items (AffiliateAction would otherwise wrap them in its
    // truncation guard) while rel / UTM / tracking are still enforced.
    return (
      <AffiliateAction
        asChild
        href={resolvedOffer.affiliateUrl}
        attribution={attribution}
        tracking={tracking}
        intent="inline"
        motion="arrow-nudge"
        className={cn(mentionVariants({ variant }), "no-underline", className)}
        data-slot="inline-product-mention"
        data-variant="inline"
        {...(props as ComponentProps<"a">)}
      >
        <a>
          <Thumb product={product} size="sm" />
          <span className="min-w-0 truncate font-medium">
            {product.brand} {product.name}
          </span>
          {price && <span className="type-metric shrink-0 text-ink-secondary">{price}</span>}
        </a>
      </AffiliateAction>
    );
  }

  return (
    <div
      data-slot="inline-product-mention"
      data-variant="block"
      className={cn(mentionVariants({ variant }), className)}
      {...props}
    >
      <div
        className={cn(
          "grid grid-flow-dense items-center gap-x-inline gap-y-cluster",
          "rounded-inner border border-hairline bg-recessed p-compact",
          "grid-cols-[var(--size-thumb)_minmax(0,1fr)_max-content]",
          "@md:grid-cols-[var(--size-thumb)_minmax(0,1fr)_max-content_max-content]",
        )}
      >
        <Thumb product={product} size="md" />

        <div data-slot="mention-identity" className="flex min-w-0 flex-col gap-hairline">
          <span className="type-eyebrow truncate text-ink-tertiary">{product.eyebrow ?? product.brand}</span>
          <span className="truncate text-body-sm font-medium text-ink">
            {product.brand} {product.name}
          </span>
        </div>

        {price && (
          <div data-slot="mention-price" className="flex min-w-0 flex-col items-end gap-hairline text-right">
            <span className="type-metric whitespace-nowrap text-body text-ink">{price}</span>
            <span className="truncate text-caption text-ink-tertiary">at {resolvedOffer!.merchantName}</span>
          </div>
        )}

        {resolvedOffer && (
          <div data-slot="mention-cta" className="col-span-3 @md:col-span-1 @md:col-start-4">
            <AffiliateAction
              href={resolvedOffer.affiliateUrl}
              attribution={attribution}
              tracking={tracking}
              size="sm"
              width="full"
              className="@md:w-auto"
            >
              {ctaLabel}
            </AffiliateAction>
          </div>
        )}
      </div>
    </div>
  );
}

function Thumb({ product, size }: { product: AffiliateProductEntity; size: "sm" | "md" }) {
  const img = product.media.primaryImage;
  return (
    <span
      data-slot="mention-thumb"
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-tag border border-hairline bg-surface",
        size === "md" ? "size-thumb" : "size-[1.4em]",
      )}
      style={{ backgroundColor: img.backdrop }}
    >
      <Image src={img.src} alt="" fill sizes={size === "md" ? "88px" : "48px"} className="object-cover" />
    </span>
  );
}

export { mentionVariants as inlineProductMentionVariants };
