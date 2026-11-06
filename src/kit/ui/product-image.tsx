import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { ProductImage as ProductImageData } from "@/types/affiliate";

/**
 * Studio photography on the theme’s studio well: a background-free cut-out,
 * contain-fit inside an inset that scales with the box, with a soft contact
 * shadow, on a radial sweep. Nothing is ever cropped, and every product on a
 * page sits on the same light.
 *
 *   portrait  4 : 4.2  the deep dive’s media frame
 *   landscape 4 : 3
 *   square    1 : 1    thumbnails
 *   fill               takes the size of its box (verdict-card wells)
 *
 * Children are overlays (an award pill, a lab badge), positioned by the caller.
 */
const RATIOS = {
  portrait: "aspect-[4/4.2]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
  fill: "size-full",
} as const;
const INSETS = { lg: "inset-[9%]", md: "inset-[8%]", sm: "inset-[7%]" } as const;

export type Detail = "full" | "card" | "thumb";

export interface ProductImageProps {
  image: ProductImageData;
  productId?: string;
  ratio?: keyof typeof RATIOS;
  /** Air around the object, as a share of the box. */
  pad?: keyof typeof INSETS;
  sizes?: string;
  priority?: boolean;
  children?: ReactNode;
  className?: string;
}

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
