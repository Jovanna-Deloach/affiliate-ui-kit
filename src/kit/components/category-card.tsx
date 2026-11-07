import type { ProductCategory } from "@/kit/types";
import { ProductImage } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface CategoryCardProps {
  /** The category: its name and page, what it covers, how many reports it holds, and optionally a product to photograph. */
  category: ProductCategory;
  /** The name’s heading level: `h3` under a section’s `h2` (default). */
  as?: "h2" | "h3" | "h4";
  /** The `sizes` attribute for the photograph: how wide the card renders. */
  sizes?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A category as a tile: its name (the whole card links to the category), a
 * line on what it covers, and how much the site has tested (“18 reports”).
 * With a `product`, that product’s photograph on the studio well above;
 * without, the words alone. Give every category in a grid a product, or
 * none.
 *
 * **Use it for** the category index and a home page’s categories.
 * **Not for** a row of popular categories under the header (`QuickLinks`)
 * or a single product (`ProductCard`).
 *
 * @summary A category tile: name, what it covers, how many reports; a photo if given.
 * @import import { CategoryCard } from "@/kit/components";
 */
export function CategoryCard({ category, as: Heading = "h3", sizes = "(min-width: 1024px) 16rem, 45vw", className }: CategoryCardProps) {
  const { name, href, count, noun = "reports", description, product } = category;
  return (
    <article className={cn("kit-card relative grid content-start gap-3", product ? "p-2 pb-4" : "p-4", className)}>
      {product ? <ProductImage image={product.image} productId={product.id} ratio="landscape" pad="md" sizes={sizes} /> : null}
      <div className={cn("grid content-start gap-1", product && "px-2")}>
        <Heading className="m-0 t-name-sm text-fg">
          <a href={href} className="kit-focus rounded-ctl text-fg no-underline after:absolute after:inset-0 after:rounded-box hover:underline">
            {name}
          </a>
        </Heading>
        {description ? <p className="m-0 t-small text-fg-body">{description}</p> : null}
        <p data-numeric className="m-0 t-caption text-fg-muted">
          {count.toLocaleString("en-US")} {count === 1 ? noun.replace(/s$/, "") : noun}
        </p>
      </div>
    </article>
  );
}
