import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { ComponentProps, CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { AffiliateProductEntity, ProductImage } from "@/types/affiliate";

/**
 * <ProductMediaFrame />
 * ---------------------------------------------------------------------------
 * `next/image` wrapper for product photography. One frame geometry across the
 * kit (4:5, `--radius-inner`), so a grid of thirty tiles reads as one system.
 *
 *   --aspect-media           4 / 5 frame → zero CLS
 *   --radius-inner           frame corners
 *   --inset-pedestal         contain-fit breathing room
 *   --inset-overlay          badge / metric safe-zone inset
 *   --surface-recessed       tile behind the photograph
 *   --duration-media / --ease-media   zoom + angle-swap physics
 *
 * Treatments
 *   cover     photography edge to edge (default)
 *   contain   packshot on the sampled `backdrop` tile with a 24px inset
 *   blend     contain + mix-blend-multiply for true-white packshots
 *
 * Safe overlay zones: the accolade docks top-left at `--inset-overlay`; a
 * metric chip docks bottom-right — never the same horizontal track. No
 * wishlist / cart affordance: this is editorial commerce.
 *
 * Captions are a structured lockup BELOW the frame (eyebrow · name · price),
 * never over the product. Server Component — zero JS in 30-item grids.
 */

const frameVariants = cva(
  "group/media relative isolate block w-full overflow-hidden aspect-media rounded-inner bg-(color:--media-tile)",
  {
    variants: {
      treatment: {
        cover: "",
        contain: "",
        blend: "",
      },
      hover: {
        none: "",
        "subtle-zoom": "media-zoom",
        "secondary-angle-swap": "media-swap media-zoom",
      },
    },
    defaultVariants: { treatment: "cover", hover: "subtle-zoom" },
  },
);

const stageVariants = cva("absolute", {
  variants: {
    treatment: {
      cover: "inset-0",
      contain: "inset-pedestal",
      blend: "inset-pedestal",
    },
  },
  defaultVariants: { treatment: "cover" },
});

const imageFitVariants = cva("select-none", {
  variants: {
    treatment: {
      cover: "object-cover",
      contain: "object-contain",
      blend: "object-contain",
    },
  },
  defaultVariants: { treatment: "cover" },
});

export interface MediaCaption {
  /** Brand / SKU line in the eyebrow voice. */
  eyebrow?: ReactNode;
  /** Product name. */
  name: ReactNode;
  /** Reference price, metric voice. */
  price?: ReactNode;
}

export interface ProductMediaFrameProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof frameVariants> {
  /** Canonical media slice from AffiliateProductEntity. */
  media: AffiliateProductEntity["media"];
  /** <AwardBadge /> docked top-left inside the safe zone. */
  badge?: ReactNode;
  /** Secondary chip (e.g. "9.4") docked bottom-right. */
  metric?: ReactNode;
  /** Structured lockup rendered below the frame. */
  caption?: MediaCaption;
  /** Toggle the caption lockup without dropping its data. */
  showCaption?: boolean;
  /** Pass through for the LCP image on scorecard pages. */
  priority?: boolean;
  /** `sizes` hint for next/image srcset selection. */
  sizes?: string;
  /** Render a <div> instead of <figure> when no caption semantics apply. */
  as?: "figure" | "div";
}

const DEFAULT_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw";

export function ProductMediaFrame({
  media,
  badge,
  metric,
  caption,
  showCaption = true,
  priority = false,
  sizes = DEFAULT_SIZES,
  treatment = "cover",
  hover = "subtle-zoom",
  as = "figure",
  className,
  style,
  ...props
}: ProductMediaFrameProps) {
  const Tag: ElementType = as;
  const { primaryImage, secondaryImage, cutoutBlend } = media;
  const resolvedTreatment = treatment ?? "cover";
  const resolvedHover =
    hover === "secondary-angle-swap" && !secondaryImage ? "subtle-zoom" : (hover ?? "subtle-zoom");
  const blend = resolvedTreatment === "blend" || (Boolean(cutoutBlend) && resolvedTreatment === "contain");
  const hasCaption = Boolean(caption) && showCaption;

  // Contain-fit frames adopt the packshot's own backdrop so the photo edge
  // disappears; cover frames keep the recessed tile as a loading colour.
  const tile =
    resolvedTreatment === "cover"
      ? "var(--surface-recessed)"
      : (primaryImage.backdrop ?? "var(--surface-recessed)");

  return (
    <Tag
      data-slot="product-media-frame"
      data-treatment={resolvedTreatment}
      className={cn("flex min-w-0 flex-col gap-cluster", className)}
      style={style}
      {...props}
    >
      <div
        className={cn(frameVariants({ treatment: resolvedTreatment, hover: resolvedHover }))}
        style={{ "--media-tile": tile } as CSSProperties}
      >
        <div className={cn(stageVariants({ treatment: resolvedTreatment }))}>
          <MediaLayer image={primaryImage} slot="media-primary" treatment={resolvedTreatment} blend={blend} priority={priority} sizes={sizes} />
          {secondaryImage && resolvedHover === "secondary-angle-swap" && (
            <MediaLayer image={secondaryImage} slot="media-secondary" treatment={resolvedTreatment} blend={blend} sizes={sizes} />
          )}
        </div>

        {badge && (
          <div
            data-slot="media-badge"
            className="absolute left-overlay top-overlay z-10 flex max-w-[calc(100%-var(--inset-overlay)*2)] items-start"
          >
            {badge}
          </div>
        )}
        {metric && (
          <div
            data-slot="media-metric"
            className="absolute bottom-overlay right-overlay z-10 flex max-w-[calc(100%-var(--inset-overlay)*2)] items-end"
          >
            {metric}
          </div>
        )}
      </div>

      {hasCaption && caption && (
        <figcaption data-slot="media-caption" className="flex min-w-0 flex-col gap-hairline">
          {caption.eyebrow && (
            <span data-slot="caption-eyebrow" className="type-eyebrow truncate text-ink-tertiary">
              {caption.eyebrow}
            </span>
          )}
          <span data-slot="caption-name" className="truncate text-body-sm font-medium text-ink">
            {caption.name}
          </span>
          {caption.price && (
            <span data-slot="caption-price" className="type-metric text-body-sm text-ink-secondary">
              {caption.price}
            </span>
          )}
        </figcaption>
      )}
    </Tag>
  );
}

function MediaLayer({
  image,
  slot,
  treatment,
  blend,
  priority,
  sizes,
}: {
  image: ProductImage;
  slot: "media-primary" | "media-secondary";
  treatment: NonNullable<ProductMediaFrameProps["treatment"]>;
  blend: boolean;
  priority?: boolean;
  sizes: string;
}) {
  const decorative = slot === "media-secondary";
  return (
    <Image
      data-slot={slot}
      src={image.src}
      alt={decorative ? "" : image.alt}
      fill
      sizes={sizes}
      priority={priority}
      aria-hidden={decorative || undefined}
      className={cn(imageFitVariants({ treatment }), blend && "mix-blend-multiply")}
    />
  );
}

export { frameVariants as productMediaFrameVariants };
