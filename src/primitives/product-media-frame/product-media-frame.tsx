import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import type { ComponentProps, CSSProperties, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";
import type { AffiliateProductEntity, ProductImage } from "@/types/affiliate";

/**
 * <ProductMediaFrame />
 * ---------------------------------------------------------------------------
 * `next/image` wrapper for product photography.
 *
 *   --aspect-product-media   frame ratio (4/5 editorial · 1/1 lab) → zero CLS
 *   --radius-media           frame corners
 *   --space-media-inset      `auto` treatment inset (0 luxury · 1.5rem clinical)
 *   --media-fit              `auto` treatment object-fit (cover · contain)
 *   --space-pedestal-inset   explicit padded-pedestal breathing room
 *   --space-overlay-inset    badge / metric safe-zone inset
 *   --color-surface-pedestal tile behind letterboxed packshots
 *   --duration-media / --ease-media   zoom + angle-swap physics
 *
 * Treatments
 *   auto                  token-driven: full-bleed in luxury, pedestal in clinical
 *   full-bleed-editorial  object-cover photography edge to edge
 *   padded-pedestal       object-contain with generous inset on all four edges
 *   studio-cutout-blend   pedestal + mix-blend-multiply for true-white packshots
 *
 * Safe overlay zones (Mobbin: GOAT / Shop corner tags, Zalando): the badge
 * docks top-left at `--space-overlay-inset`, capped to the frame width minus
 * both insets; a metric chip docks bottom-right — never the same horizontal
 * track. There is no wishlist / cart affordance: this is editorial commerce.
 *
 * Captions are a structured lockup BELOW the frame (eyebrow · name · price),
 * never over the product. Server Component — zero JS in 30-item grids.
 */

const frameVariants = cva(
  [
    "group/media relative isolate block w-full overflow-hidden",
    "aspect-product-media rounded-media bg-(color:--media-tile)",
  ],
  {
    variants: {
      treatment: {
        auto: "",
        "full-bleed-editorial": "",
        "padded-pedestal": "",
        "studio-cutout-blend": "",
      },
      hover: {
        none: "",
        "subtle-zoom": "media-zoom",
        "secondary-angle-swap": "media-swap media-zoom",
      },
    },
    defaultVariants: { treatment: "auto", hover: "subtle-zoom" },
  },
);

/** The inner box the image fills; its inset IS the treatment. */
const stageVariants = cva("absolute", {
  variants: {
    treatment: {
      auto: "inset-media-inset",
      "full-bleed-editorial": "inset-0",
      "padded-pedestal": "inset-pedestal-inset",
      "studio-cutout-blend": "inset-pedestal-inset",
    },
  },
  defaultVariants: { treatment: "auto" },
});

const imageFitVariants = cva("select-none", {
  variants: {
    treatment: {
      auto: "object-media-fit",
      "full-bleed-editorial": "object-cover",
      "padded-pedestal": "object-contain",
      "studio-cutout-blend": "object-contain",
    },
  },
  defaultVariants: { treatment: "auto" },
});

export interface MediaCaption {
  /** Brand / SKU line, mono uppercase. */
  eyebrow?: ReactNode;
  /** Product name. */
  name: ReactNode;
  /** Reference price, mono tabular. */
  price?: ReactNode;
}

export interface ProductMediaFrameProps
  extends Omit<ComponentProps<"div">, "children">,
    VariantProps<typeof frameVariants> {
  /** Canonical media slice from AffiliateProductEntity. */
  media: AffiliateProductEntity["media"];
  /** <AwardBadge /> docked top-left inside the safe zone. */
  badge?: ReactNode;
  /** Secondary chip (e.g. "SCORE 9.4") docked bottom-right. */
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
  treatment = "auto",
  hover = "subtle-zoom",
  as = "figure",
  className,
  style,
  ...props
}: ProductMediaFrameProps) {
  const Tag: ElementType = as;
  const { primaryImage, secondaryImage, cutoutBlend } = media;
  const resolvedTreatment = treatment ?? "auto";
  const resolvedHover =
    hover === "secondary-angle-swap" && !secondaryImage ? "subtle-zoom" : (hover ?? "subtle-zoom");
  const blend =
    resolvedTreatment === "studio-cutout-blend" ||
    (Boolean(cutoutBlend) && resolvedTreatment !== "full-bleed-editorial");
  const hasCaption = Boolean(caption) && showCaption;

  // Contain-fit frames adopt the packshot's own backdrop so the photo edge
  // disappears; full-bleed frames keep the pedestal tile as a loading colour.
  const tile =
    resolvedTreatment === "full-bleed-editorial"
      ? "var(--color-surface-pedestal)"
      : (primaryImage.backdrop ?? "var(--color-surface-pedestal)");

  return (
    <Tag
      data-slot="product-media-frame"
      data-treatment={resolvedTreatment}
      className={cn("flex min-w-0 flex-col gap-cluster-gap", className)}
      style={style}
      {...props}
    >
      <div
        className={cn(frameVariants({ treatment: resolvedTreatment, hover: resolvedHover }))}
        style={{ "--media-tile": tile } as CSSProperties}
      >
        <div className={cn(stageVariants({ treatment: resolvedTreatment }))}>
          <MediaLayer
            image={primaryImage}
            slot="media-primary"
            treatment={resolvedTreatment}
            blend={blend}
            priority={priority}
            sizes={sizes}
          />
          {secondaryImage && resolvedHover === "secondary-angle-swap" && (
            <MediaLayer
              image={secondaryImage}
              slot="media-secondary"
              treatment={resolvedTreatment}
              blend={blend}
              sizes={sizes}
            />
          )}
        </div>

        {badge && (
          <div
            data-slot="media-badge"
            className="absolute left-overlay-inset top-overlay-inset z-10 flex max-w-[calc(100%-var(--space-overlay-inset)*2)] items-start"
          >
            {badge}
          </div>
        )}
        {metric && (
          <div
            data-slot="media-metric"
            className="absolute bottom-overlay-inset right-overlay-inset z-10 flex max-w-[calc(100%-var(--space-overlay-inset)*2)] items-end"
          >
            {metric}
          </div>
        )}
      </div>

      {hasCaption && caption && (
        <figcaption
          data-slot="media-caption"
          className="flex min-w-0 flex-col gap-[calc(var(--space-cluster-gap)*0.4)]"
        >
          {caption.eyebrow && (
            <span data-slot="caption-eyebrow" className="type-label-mono truncate text-muted">
              {caption.eyebrow}
            </span>
          )}
          <span data-slot="caption-name" className="truncate text-sm font-medium text-foreground">
            {caption.name}
          </span>
          {caption.price && (
            <span data-slot="caption-price" className="type-price text-xs text-muted">
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
