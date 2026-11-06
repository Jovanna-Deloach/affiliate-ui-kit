"use client";

import Image from "next/image";
import { useState } from "react";

import { ProductImage } from "@/kit/ui";
import { cn } from "@/lib/cn";
import type { ProductImage as ProductImageData } from "@/types/affiliate";

export interface GalleryProps {
  /** The product’s studio cut-out first, then detail photographs (the label, the powder, the scoop). */
  images: ProductImageData[];
  /** The product’s id: the cut-out is its one photograph for the page checks. */
  productId: string;
  /** The product’s name, for the thumbnails' labels: “Photos of Peak Supply Creatine”. */
  name: string;
  /** Load the first photograph first: only when the gallery is in the first viewport. */
  priority?: boolean;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Several photographs of one product: the one picked fills the frame and a
 * row of thumbnails picks the next. The first is the studio cut-out on the
 * theme’s well; the rest are detail photographs, shown edge to edge in the
 * same frame.
 *
 * **Use it for** a product page’s photographs when there is more than the
 * cut-out: the supplement facts label, the capsules, the scoop. **Not for**
 * one photograph (`ProductImage`), several products (each gets its own), or a
 * lifestyle or brand image.
 *
 * @summary Several photographs of one product: the cut-out first, then details.
 * @import import { Gallery } from "@/kit/components";
 */
export function Gallery({ images, productId, name, priority, className }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const shown = images[index] ?? images[0];
  if (!shown) return null;
  return (
    <div className={cn("grid gap-3", className)}>
      {index === 0 ? (
        <ProductImage image={shown} productId={productId} priority={priority} sizes="(min-width: 1024px) 40vw, 100vw" />
      ) : (
        <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-media bg-well">
          <Image src={shown.src} alt={shown.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
        </div>
      )}
      {images.length > 1 ? (
        <ul aria-label={`Photos of ${name}`} className="m-0 flex list-none gap-2 overflow-x-auto p-0">
          {images.map((image, i) => (
            <li key={image.src} className="shrink-0">
              <button
                type="button"
                aria-label={`Photo ${i + 1} of ${images.length}: ${image.alt}`}
                aria-pressed={i === index}
                onClick={() => setIndex(i)}
                className={cn(
                  "kit-focus relative block size-16 cursor-pointer overflow-hidden rounded-media border-2 transition-colors duration-(--dur) ease-(--ease)",
                  i === index ? "border-fg" : "border-transparent hover:border-line-strong",
                  i === 0 ? "kit-studio" : "bg-well",
                )}
              >
                <Image src={image.src} alt="" fill sizes="64px" className={i === 0 ? "object-contain p-1.5" : "object-cover"} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
