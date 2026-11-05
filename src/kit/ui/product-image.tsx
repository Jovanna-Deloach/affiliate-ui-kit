import Image from "next/image";

import { cn } from "@/lib/cn";
import type { ProductImage as ProductImageData } from "@/types/affiliate";

/**
 * Studio photography on the theme’s well. The photograph is contain-fit
 * inside a fixed inset (24px at full size), so nothing is ever cropped, and
 * cut-out product shots sit on the same toned backdrop across a page.
 * `fill` takes the size of its box (a verdict card's well) instead of a ratio.
 */
const RATIOS = {
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[3/2]",
  fill: "size-full",
} as const;
// `fit` scales the air with the box (a hero well and a compact card's well differ fourfold in area).
const INSETS = { lg: "inset-6", md: "inset-4", sm: "inset-2", fit: "inset-[7%]" } as const;

export interface ProductImageProps {
  image: ProductImageData;
  productId?: string;
  ratio?: keyof typeof RATIOS;
  /** Air around the object: 24px, 16px, 8px, or 7% of the box. */
  pad?: keyof typeof INSETS;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({ image, productId, ratio = "landscape", pad = "lg", sizes = "(min-width: 1024px) 40vw, 100vw", priority, className }: ProductImageProps) {
  return (
    <div data-slot="media-well" data-product-id={productId} className={cn("relative w-full overflow-hidden rounded-media bg-well", RATIOS[ratio], className)}>
      <div className={cn("absolute", INSETS[pad])}>
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} unoptimized={image.src.endsWith(".svg")} className="object-contain" />
      </div>
    </div>
  );
}
