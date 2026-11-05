import Image from "next/image";

import { cn } from "@/lib/cn";
import type { ProductImage as ProductImageData } from "@/types/affiliate";

/**
 * A product on its well (the theme's plinth / bench tone). Contain-fit with
 * room around the object, so every product in a grid sits on the same
 * ground at the same scale. Corners come from the theme (--radius-media).
 */
const RATIOS = {
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  landscape: "aspect-[5/4]",
  wide: "aspect-[3/2]",
} as const;

export interface ProductImageProps {
  image: ProductImageData;
  ratio?: keyof typeof RATIOS;
  /** Air around the object, as a share of the well. */
  inset?: "snug" | "airy";
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function ProductImage({ image, ratio = "square", inset = "airy", sizes = "(min-width: 1024px) 50vw, 100vw", priority, className }: ProductImageProps) {
  const svg = image.src.endsWith(".svg");
  return (
    <div className={cn("relative w-full overflow-hidden rounded-media bg-well", RATIOS[ratio], className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={svg}
        className={cn("object-contain", inset === "airy" ? "p-[12%]" : "p-[6%]")}
      />
    </div>
  );
}
