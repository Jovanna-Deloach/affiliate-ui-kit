import Image from "next/image";

import type { Brand } from "@/kit/types";
import { StarRating } from "@/kit/ui";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

export interface BrandCardProps {
  /** The brand: name, its page, website, logo, readers’ rating and how many products were tested. */
  brand: Brand;
  /** The name’s heading level: `h3` under a section’s `h2` (default). */
  as?: "h2" | "h3" | "h4";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A brand as a tile: its logo (or initials), its name (the whole card links
 * to the brand’s page), its website as plain text, readers’ stars with the
 * average and the count, and how many of its products the site tested.
 * Three rows, lined up across a grid like `ProductCard`.
 *
 * **Use it for** brands in People also looked at, a category’s brands, and
 * search pages. **Not for** a retailer (`OfferCard`, `BuyRow`) or a brand’s
 * record on reviews (`TrustSignals`).
 *
 * @summary A brand tile: logo, name, website, readers’ stars and count, products tested.
 * @import import { BrandCard } from "@/kit/components";
 */
export function BrandCard({ brand, as: Heading = "h3", className }: BrandCardProps) {
  const { name, href, website, logo, rating, tested } = brand;
  return (
    <article className={cn("kit-card relative row-span-3 grid grid-rows-subgrid gap-3 p-4", className)}>
      <div className="flex min-w-0 items-center gap-3">
        {logo ? (
          <span className="relative size-12 shrink-0 overflow-hidden rounded-box border border-line bg-paper">
            <Image src={logo.src} alt={logo.alt} fill sizes="3rem" className="object-contain p-1.5" />
          </span>
        ) : (
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-box border border-line bg-paper t-ui font-semibold text-fg">
            {initials(name)}
          </span>
        )}
        <div className="grid min-w-0">
          <Heading className="m-0 t-name-sm text-fg">
            <a href={href} className="kit-focus rounded-ctl text-fg no-underline after:absolute after:inset-0 after:rounded-box hover:underline">
              {name}
            </a>
          </Heading>
          {website ? <p className="m-0 truncate t-caption text-fg-muted">{website}</p> : null}
        </div>
      </div>
      {rating ? (
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 t-small text-fg-muted">
          <StarRating value={rating.average} size="sm" />
          <span data-numeric className="font-semibold text-fg">
            {rating.average.toFixed(1)}
          </span>
          <span data-numeric>
            {rating.count.toLocaleString("en-US")} {rating.count === 1 ? "review" : "reviews"}
          </span>
        </p>
      ) : (
        <p className="m-0 t-small text-fg-muted">No reviews yet</p>
      )}
      <p data-numeric className="m-0 t-small text-fg-muted">
        {tested ? `${tested} ${tested === 1 ? "product" : "products"} tested` : "Not tested yet"}
      </p>
    </article>
  );
}
