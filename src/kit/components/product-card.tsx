import type { ReactNode } from "react";

import { leadOffer } from "@/kit/lib/offers";
import type { ProductSummary } from "@/kit/types";
import { BuyPill, CertificationStatus, GradeBadge, Price, ProductImage, Sep, StarRating } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";
import { cn } from "@/lib/cn";
import { formatPrice, formatScore } from "@/lib/format";

export interface ProductCardProps {
  /** The product, where its review is, and how it tested: grade, score, certification, readers’ rating, price per serving. */
  summary: ProductSummary;
  /** Over the photograph’s top right corner: a `SaveButton` with `compact`. */
  corner?: ReactNode;
  /** Under the price: a `CompareButton`. */
  footer?: ReactNode;
  /** Show the lowest in-stock offer as a “Buy at {merchant}” pill, for pages where readers buy from the card. Never for a product graded F. */
  buy?: boolean;
  /** Campaign attribution added to the buy link. */
  attribution?: AffiliateAttribution;
  /** The name’s heading level: `h3` under a section’s `h2` (default). */
  as?: "h2" | "h3" | "h4";
  /** The `sizes` attribute for the photograph: how wide the card renders. */
  sizes?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A product as a tile: its photograph on the studio well, the brand, the
 * name (the whole card links to its review), the grade with the score and
 * readers’ stars, its certification, and the lowest price with what a
 * serving costs. Rows line up across a grid of cards: the parent gives each
 * card four rows (`grid-rows-subgrid` is set on the card).
 *
 * **Use it for** products outside a guide: People also looked at, a brand’s
 * products, saved items, search pages. **Not for** a pick in a guide
 * (`VerdictCard`, `PickRow`), or a row in a ranking (`RankingList`).
 *
 * @summary A product tile: photo, brand, name, grade, stars, certification, lowest price.
 * @import import { ProductCard } from "@/kit/components";
 */
export function ProductCard({ summary, corner, footer, buy = false, attribution, as: Heading = "h3", sizes = "(min-width: 1024px) 18rem, 70vw", className }: ProductCardProps) {
  const { product, href, grade, score, certification, rating, perServing } = summary;
  const offer = leadOffer(product.offers);
  return (
    <article data-product-id={product.id} className={cn("kit-card relative row-span-4 grid grid-rows-subgrid gap-3 p-2 pb-4", className)}>
      <div className="relative">
        <ProductImage image={product.image} productId={product.id} ratio="square" pad="md" sizes={sizes} />
        {corner ? <div className="absolute top-2 right-2 z-10">{corner}</div> : null}
      </div>
      <div className="grid content-start gap-1 px-2">
        <p className="m-0 t-micro text-fg-muted">{product.brand}</p>
        <Heading className="m-0 t-name-sm text-fg">
          <a href={href} data-name className="kit-focus rounded-ctl text-fg no-underline after:absolute after:inset-0 after:rounded-box hover:underline">
            {product.name}
          </a>
        </Heading>
      </div>
      <div className="grid content-start gap-2 px-2">
        {grade || score !== undefined || rating ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {grade ? <GradeBadge grade={grade} size="sm" /> : null}
            {score !== undefined ? (
              <span data-numeric className="t-small text-fg">
                {formatScore(score)}
                <span className="text-fg-muted"> / 10</span>
              </span>
            ) : null}
            {rating ? (
              <span className="inline-flex items-center gap-1.5 t-caption text-fg-muted">
                <StarRating value={rating.average} size="sm" />
                <span data-numeric>({rating.count.toLocaleString("en-US")})</span>
              </span>
            ) : null}
          </div>
        ) : null}
        {certification ? <CertificationStatus certification={certification} /> : null}
      </div>
      <div className="grid content-start gap-3 px-2">
        {offer ? (
          <Price
            amount={offer.price}
            currency={offer.currency}
            size="sm"
            note={
              <>
                at {offer.merchantName}
                {perServing ? (
                  <>
                    <Sep />
                    {formatPrice(perServing.amount, offer.currency)} per {perServing.serving}
                  </>
                ) : null}
              </>
            }
          />
        ) : (
          <p className="m-0 t-small text-fg-muted">Sold out everywhere we checked</p>
        )}
        {buy && offer && grade !== "F" ? (
          <BuyPill offer={offer} productId={product.id} placement="product-card" attribution={attribution} className="relative z-10 justify-self-start">
            Buy at {offer.merchantName}
          </BuyPill>
        ) : null}
        {footer ? <div className="relative z-10">{footer}</div> : null}
      </div>
    </article>
  );
}
