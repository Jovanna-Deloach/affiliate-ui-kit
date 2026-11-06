import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ProductImage as ProductImageData } from "@/types/affiliate";

const RATIOS = {
  portrait: "aspect-[4/4.2]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  fill: "size-full",
} as const;
const INSETS = { lg: "inset-[9%]", md: "inset-[8%]", sm: "inset-[7%]" } as const;

/** How much of a pick’s photograph a place shows: `full` the review frame, `card` a verdict card’s well, `thumb` a square thumbnail. */
export type Detail = "full" | "card" | "thumb";

export interface ProductImageProps {
  /** The photograph: a background-free cut-out (transparent WebP or PNG) with `src`, `alt`, `width` and `height`. */
  image: ProductImageData;
  /** The product it shows; the page checks fail two products that share one photograph. */
  productId?: string;
  /** `portrait` 4 : 4.2, the review frame (default) · `landscape` 4 : 3 · `square` thumbnails · `fill` takes the size of its positioned parent. */
  ratio?: keyof typeof RATIOS;
  /** Air around the object, as a share of the box: `lg` 9% (default) · `md` 8% · `sm` 7%. */
  pad?: keyof typeof INSETS;
  /** The `sizes` attribute for responsive loading: how wide the frame renders. */
  sizes?: string;
  /** Load first: only for the photograph in the first viewport. */
  priority?: boolean;
  /** Overlays (an award, a lab badge), positioned by the caller: `absolute top-4 left-4`. */
  children?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Studio photography on the theme’s studio well: the cut-out, contain-fit
 * inside an inset that scales with the box, with a soft contact shadow, on a
 * radial sweep. Nothing is ever cropped, and every product on a page sits on
 * the same light.
 *
 * **Use it for** any photograph of a product. With a `Pick`, prefer
 * `PickMedia`, which sets the ratio and padding for each place. **Not for**
 * a drawing or a chart in place of the product, a lifestyle photograph, or
 * a portrait of a person (`Avatar`).
 *
 * @summary A product photograph on the studio well: contain-fit, never cropped, four ratios.
 * @import import { ProductImage } from "@/kit/ui";
 */
export function ProductImage({ image, productId, ratio = "portrait", pad = "lg", sizes = "(min-width: 1024px) 40vw, 100vw", priority, children, className }: ProductImageProps) {
  return (
    <div data-slot="media-well" data-product-id={productId} className={cn("relative w-full overflow-hidden kit-studio", RATIOS[ratio], className)}>
      <div className={cn("absolute", INSETS[pad])}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} unoptimized={image.src.endsWith(".svg")} className="object-contain kit-object" />
      </div>
      {children}
    </div>
  );
}
