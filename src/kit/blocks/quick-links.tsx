import type { ProductCategory } from "@/kit/types";
import { Chip } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface QuickLinksProps {
  /** The categories readers open most, five to ten, most popular first. Only the name and address are used. */
  categories: Pick<ProductCategory, "slug" | "name" | "href">[];
  /** The words before the links, and the name of the row for screen readers (default “Popular”). */
  label?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The categories readers open most, as a row of link chips under the
 * masthead, in its own page well with a hairline below. On phones the row
 * scrolls sideways instead of wrapping.
 *
 * **Use it for** the band under `SiteHeader` on home, category and search
 * pages. **Not for** the site’s sections (`SiteHeader`), every category
 * (`CategoryIndex`), or filters (`Chip` toggles).
 *
 * @summary Popular categories as a row of chips under the masthead.
 * @import import { QuickLinks } from "@/kit/blocks";
 */
export function QuickLinks({ categories, label = "Popular", className }: QuickLinksProps) {
  return (
    <nav aria-label={`${label} categories`} className={cn("border-b border-line bg-ground", className)}>
      <div className="kit-well flex items-center gap-3 overflow-x-auto py-2.5 [scrollbar-width:none]">
        <span aria-hidden="true" className="shrink-0 t-small text-fg-muted">
          {label}
        </span>
        <ul className="m-0 flex list-none gap-2 p-0">
          {categories.map((category) => (
            <li key={category.slug} className="shrink-0">
              <Chip label={category.name} href={category.href} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
