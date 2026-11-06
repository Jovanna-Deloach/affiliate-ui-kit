import type { ProductCategory } from "@/kit/types";
import { ProductImage } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface CategoryCardProps {
  /** The category: its name, page, how many reports it holds, and a product whose photograph stands for it. */
  category: ProductCategory;
  /** The name’s heading level: `h3` under a section’s `h2` (default). */
  as?: "h2" | "h3" | "h4";
  /** The `sizes` attribute for the photograph: how wide the card renders. */
  sizes?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A category as a tile: a product from it on the studio well, the name (the
 * whole card links to the category), and how much the site has tested
 * (“18 reports”). Give every category in a grid its `product`: a card
 * without one shows only its name and count.
 *
 * **Use it for** the category index and a home page’s categories. **Not
 * for** a row of popular categories under the header (`QuickLinks`, which
 * needs no photographs) or a single product (`ProductCard`).
 *
 * @summary A category tile: a product photo, the name and how many reports.
 * @import import { CategoryCard } from "@/kit/components";
 */
export function CategoryCard({ category, as: Heading = "h3", sizes = "(min-width: 1024px) 16rem, 45vw", className }: CategoryCardProps) {
  const { name, href, count, noun = "reports", product } = category;
  return (
    <article className={cn("kit-card relative grid content-start gap-3 p-2 pb-4", !product && "pt-4", className)}>
      {product ? <ProductImage image={product.image} productId={product.id} ratio="landscape" pad="md" sizes={sizes} /> : null}
      <div className="grid content-start gap-0.5 px-2">
        <Heading className="m-0 t-name-sm text-fg">
          <a href={href} className="kit-focus rounded-ctl text-fg no-underline after:absolute after:inset-0 after:rounded-box hover:underline">
            {name}
          </a>
        </Heading>
        <p data-numeric className="m-0 t-small text-fg-muted">
          {count.toLocaleString("en-US")} {count === 1 ? noun.replace(/s$/, "") : noun}
        </p>
      </div>
    </article>
  );
}
