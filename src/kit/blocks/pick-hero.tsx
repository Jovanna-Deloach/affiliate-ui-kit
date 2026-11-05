import { cn } from "@/lib/cn";
import type { Pick } from "@/kit/types";
import { Award, ProductImage } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";

import { BuyPanel } from "./buy-panel";

/**
 * The answer, in the first viewport.
 *
 *   feature — object-led: a large image of the pick beside its verdict and
 *             the buy panel, then the other picks as a jump list. For
 *             categories bought on looks and craft.
 *   strip   — evidence-led: a compact verdict strip, so the results table
 *             can follow immediately. For categories bought on numbers.
 */
export interface PickHeroProps {
  picks: Pick[];
  layout?: "feature" | "strip";
  disclosure: { text: string; href: string };
  attribution?: AffiliateAttribution;
  className?: string;
}

export function PickHero({ picks, layout = "feature", disclosure, attribution, className }: PickHeroProps) {
  const [top, ...rest] = picks;
  if (!top) return null;
  const { product } = top;
  const name = `${product.brand} ${product.name}`;

  if (layout === "strip") {
    return (
      <section aria-label="Our pick" className={cn("kit-well", className)}>
        <div className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-6 rounded-box bg-well p-5 sm:grid-cols-[7rem_minmax(0,1fr)] md:p-8 lg:grid-cols-[9rem_minmax(0,1fr)_19rem] lg:gap-10">
          <a href={`#${product.slug}`} className="kit-focus block rounded-media">
            <ProductImage image={product.media.primaryImage} ratio="square" inset="snug" className="bg-paper" sizes="160px" priority />
          </a>
          <div className="flex min-w-0 flex-col items-start">
            <Award>{top.award}</Award>
            <h2 className="m-0 mt-3 t-title text-fg">{name}</h2>
            <p className="m-0 mt-2 max-w-[44ch] t-body text-fg-muted">{top.verdict}</p>
          </div>
          <BuyPanel product={product} placement="hero" disclosure={disclosure} attribution={attribution} othersVisible={false} className="col-span-2 lg:col-span-1" />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Our pick" className={cn("kit-well", className)}>
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
        <a href={`#${product.slug}`} className="kit-focus block rounded-media lg:col-span-7">
          <ProductImage image={product.media.primaryImage} ratio="landscape" sizes="(min-width: 1024px) 700px, 100vw" priority />
        </a>
        <div className="flex flex-col items-start lg:col-span-5">
          <Award>{top.award}</Award>
          <h2 className="m-0 mt-4 t-headline text-fg">{name}</h2>
          <p className="m-0 mt-4 t-lead text-fg-muted">{top.verdict}</p>
          <BuyPanel product={product} placement="hero" disclosure={disclosure} attribution={attribution} className="mt-8 w-full" />
        </div>
      </div>
      {rest.length > 0 && (
        <nav aria-labelledby="also-great" className="mt-16 md:mt-20">
          <h2 id="also-great" className="m-0 t-ui text-fg">
            Also great
          </h2>
          <ul className="m-0 mt-6 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((pick) => (
              <li key={pick.product.id}>
                <a href={`#${pick.product.slug}`} className="kit-focus group grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 rounded-ctl">
                  <ProductImage image={pick.product.media.primaryImage} ratio="square" inset="snug" sizes="144px" />
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="t-caption font-medium text-accent">{pick.award}</span>
                    <span className="t-ui text-fg decoration-1 underline-offset-4 group-hover:underline">
                      {pick.product.brand} {pick.product.name}
                    </span>
                    <span className="t-small text-fg-muted">Best for {pick.bestFor}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
