import { CategoryCard } from "@/kit/components";
import type { ProductCategory } from "@/kit/types";
import { cn } from "@/lib/cn";

export interface CategoryIndexProps {
  /** The heading, saying something: “Every supplement we test”. */
  heading: string;
  /** One or two sentences under the heading: how many categories, how they are tested. */
  intro?: string;
  /** Every category, in the order readers look for them: each with a `product` to photograph, or none of them. */
  categories: ProductCategory[];
  /** The section’s id, for links to it (default `categories`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Every category the site tests, in one grid of `CategoryCard`s under a
 * heading: two columns on phones, three from 48rem, four from 64rem (the
 * grid measures its own width). Tiles carry a product photograph each, or
 * words alone.
 *
 * **Use it for** a category index page, or the categories band of a home
 * page. **Not for** a short row of popular categories (`QuickLinks`) or
 * products (`PeopleAlsoLookedAt`, `RankingList`).
 *
 * @summary Every category in one grid of tiles, two to four across.
 * @import import { CategoryIndex } from "@/kit/blocks";
 */
export function CategoryIndex({ heading, intro, categories, id = "categories", className }: CategoryIndexProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid gap-6", className)}>
      <div className="grid max-w-[65ch] gap-2">
        <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
          {heading}
        </h2>
        {intro ? <p className="m-0 t-lead text-fg-body">{intro}</p> : null}
      </div>
      <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 @3xl:grid-cols-3 @3xl:gap-4 @5xl:grid-cols-4">
        {categories.map((category) => (
          <li key={category.slug} className="grid">
            <CategoryCard category={category} sizes="(min-width: 1024px) 16rem, 45vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}
