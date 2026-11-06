import type { ReactNode } from "react";

import type { Pick } from "@/kit/types";
import { ProductImage, type Detail } from "@/kit/ui";

/** The id of a pick’s deep dive, `review-{slug}`: the target of every jump link to its review. */
export function reviewId(pick: Pick) {
  return `review-${pick.product.slug}`;
}

/** A pick’s display name, brand then model: “Halden Meridian 40 GMT”. */
export const pickName = (pick: Pick) => `${pick.product.brand} ${pick.product.name}`;

export interface PickMediaProps {
  /** The pick whose photograph to show. */
  pick: Pick;
  /** `full` the review frame, 4 : 4.2 · `card` fills a positioned parent with a size (verdict-card wells) · `thumb` a small square (tables, rows). */
  detail: Detail;
  /** The `sizes` attribute for responsive loading: how wide the frame renders. */
  sizes?: string;
  /** Load first: only for the photograph in the first viewport. */
  priority?: boolean;
  /** Overlays, positioned by the caller: an `Award` at `absolute top-4 left-4`, an `AssayBadge` at `absolute bottom-4 left-4`. */
  children?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A pick’s studio photograph, with the ratio and air set for the place it
 * appears: the review frame, a card’s well, or a thumbnail. Never a drawing
 * and never a chart in its place: data sits beside the photograph (the
 * scorecard’s telemetry) or on it (a lab badge, as an overlay).
 *
 * **Use it for** any photograph of a pick. **Not for** a product outside the
 * `Pick` contract (`ProductImage` takes the image directly) or a person
 * (`Avatar`).
 *
 * @summary A pick’s photograph at the right ratio for its place: review frame, card well, thumbnail.
 * @import import { PickMedia } from "@/kit/components";
 */
export function PickMedia({ pick, detail, sizes, priority, children, className }: PickMediaProps) {
  return (
    <ProductImage
      image={pick.product.image}
      productId={pick.product.id}
      ratio={detail === "card" ? "fill" : detail === "thumb" ? "square" : "portrait"}
      pad={detail === "full" ? "lg" : detail === "card" ? "md" : "sm"}
      sizes={sizes}
      priority={priority}
      className={className}
    >
      {children}
    </ProductImage>
  );
}
