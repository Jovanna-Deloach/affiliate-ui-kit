import type { ReactNode } from "react";

import type { Pick } from "@/kit/types";
import { ProductImage, type Detail } from "@/kit/ui";

export function reviewId(pick: Pick) {
  return `review-${pick.product.slug}`;
}

export const pickName = (pick: Pick) => `${pick.product.brand} ${pick.product.name}`;

/**
 * The product, in studio photography, on the theme’s studio well. Never a
 * drawing and never a chart in its place: data sits beside the photograph
 * (the scorecard’s telemetry) or on it (a lab badge, passed as children).
 *
 *   full  — the deep dive’s media frame (4 : 4.2)
 *   card  — fills the box it is given (verdict-card wells): give it a
 *           positioned parent with a size, e.g. `absolute inset-0`
 *   thumb — a small square (tables, rows)
 */
export function PickMedia({ pick, detail, sizes, priority, children, className }: { pick: Pick; detail: Detail; sizes?: string; priority?: boolean; children?: ReactNode; className?: string }) {
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
