import { BrandCard, ProductCard } from "@/kit/components";
import { toReaderItem } from "@/kit/lib/discovery";
import type { Brand, ProductSummary } from "@/kit/types";
import { CompareButton, SaveButton } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";
import { cn } from "@/lib/cn";

/* A row that scrolls sideways on phones and wraps into four columns on wide screens; cards keep their rows in line through subgrid. */
const ROW = (rows: number) =>
  cn(
    "m-0 grid list-none snap-x snap-mandatory auto-cols-[78%] grid-flow-col gap-x-4 overflow-x-auto p-0 pb-2 @xl:auto-cols-[46%] @4xl:grid-flow-row @4xl:grid-cols-4 @4xl:overflow-visible @4xl:pb-0",
    rows === 4 ? "grid-rows-[repeat(4,auto)] @4xl:grid-rows-none @4xl:gap-y-6" : "grid-rows-[repeat(3,auto)] @4xl:grid-rows-none @4xl:gap-y-6",
  );

export interface PeopleAlsoLookedAtProps {
  /** The products to show, four to eight, most relevant first. Pass `products` or `brands`. */
  products?: ProductSummary[];
  /** The brands to show, four to eight, on a brand’s page. Pass `products` or `brands`. */
  brands?: Brand[];
  /** The heading (default “People also looked at”). */
  heading?: string;
  /** A Save bookmark on each product’s photograph. */
  save?: boolean;
  /** A Compare box under each product, for pages that show the `CompareTray`. */
  compare?: boolean;
  /** Campaign attribution, for cards with buy links (`buy`). */
  attribution?: AffiliateAttribution;
  /** Each product card shows its lowest offer as a buy pill. */
  buy?: boolean;
  /** The section’s id, for links to it (default `also-looked-at`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Products or brands readers of this page also looked at, as cards: a row
 * that scrolls sideways on phones (each card snaps into place) and four
 * columns on wide screens, with every card’s rows lined up. Products can
 * carry a Save bookmark and a Compare box.
 *
 * **Use it for** the end of a product’s or brand’s page, or a search page
 * with no results. **Not for** a guide’s other picks (`AlsoGreatRail`), a
 * whole category (`RankingList`), or what this reader looked at before
 * (`PickUpWhereYouLeftOff`).
 *
 * @summary People also looked at: product or brand cards, sideways on phones.
 * @import import { PeopleAlsoLookedAt } from "@/kit/blocks";
 */
export function PeopleAlsoLookedAt({ products, brands, heading = "People also looked at", save = false, compare = false, attribution, buy = false, id = "also-looked-at", className }: PeopleAlsoLookedAtProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid gap-6", className)}>
      <h2 id={`${id}-heading`} className="m-0 t-title text-fg">
        {heading}
      </h2>
      {products?.length ? (
        <ul className={ROW(4)}>
          {products.map((summary) => (
            <li key={summary.product.id} className="row-span-4 grid snap-start grid-rows-subgrid">
              <ProductCard
                summary={summary}
                corner={save ? <SaveButton item={toReaderItem(summary)} compact /> : undefined}
                footer={compare ? <CompareButton item={toReaderItem(summary)} /> : undefined}
                buy={buy}
                attribution={attribution}
                sizes="(min-width: 1024px) 18rem, 78vw"
              />
            </li>
          ))}
        </ul>
      ) : null}
      {brands?.length ? (
        <ul className={ROW(3)}>
          {brands.map((brand) => (
            <li key={brand.slug} className="row-span-3 grid snap-start grid-rows-subgrid">
              <BrandCard brand={brand} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
