"use client";

import { useMemo, useState } from "react";

import { INLINE_DISCLOSURE, WarningNote } from "@/kit/components";
import { sortProducts, toReaderItem, type RankingSort } from "@/kit/lib/discovery";
import { leadOffer } from "@/kit/lib/offers";
import { underWarning } from "@/kit/lib/warnings";
import type { ProductSummary } from "@/kit/types";
import { BuyPill, Button, CertificationStatus, CompareButton, GradeBadge, Price, ProductImage, SegmentedControl, StarRating } from "@/kit/ui";
import type { AffiliateAttribution } from "@/types/affiliate";
import { cn } from "@/lib/cn";
import { formatPrice, formatScore } from "@/lib/format";

const ORDERS: { value: RankingSort; label: string }[] = [
  { value: "quality", label: "Quality" },
  { value: "value", label: "Value" },
  { value: "certified", label: "Certified" },
  { value: "name", label: "A to Z" },
];

function Row({ summary, compare, attribution }: { summary: ProductSummary; compare: boolean; attribution?: AffiliateAttribution }) {
  const { product, href, rating, perServing, note } = summary;
  const warning = underWarning(product) ? product.warning : undefined;
  // A standing warning takes the place of the grade, the score, the certification, the price and the buy link.
  const certification = warning ? undefined : summary.certification;
  const grade = warning ? undefined : summary.grade;
  const score = warning ? undefined : summary.score;
  const offer = warning ? undefined : leadOffer(product.offers);
  return (
    <li data-product-id={product.id} data-warning={warning ? "active" : undefined} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-t border-line py-5 @3xl:grid-cols-[5.5rem_minmax(0,1fr)_7rem_12rem] @3xl:items-start">
      <ProductImage image={product.image} productId={product.id} ratio="square" pad="sm" sizes="5.5rem" className="row-span-2 @3xl:row-span-1" />
      <div className="grid min-w-0 content-start gap-1">
        <p className="m-0 t-micro text-fg-muted">{product.brand}</p>
        <a href={href} data-name className="kit-focus justify-self-start rounded-ctl t-name-sm text-fg no-underline hover:underline">
          {product.name}
        </a>
        {certification ? <CertificationStatus certification={certification} className="mt-1" /> : null}
        {note ? <p className="m-0 t-small text-fg-body">{note}</p> : null}
        {rating ? (
          <p className="m-0 inline-flex flex-wrap items-center gap-1.5 t-caption text-fg-muted">
            <StarRating value={rating.average} size="sm" />
            <span data-numeric>
              {rating.average.toFixed(1)} from {rating.count.toLocaleString("en-US")} {rating.count === 1 ? "review" : "reviews"}
            </span>
          </p>
        ) : null}
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-3 @3xl:col-start-auto @3xl:contents">
        <div className="flex items-center gap-3 @3xl:grid @3xl:justify-items-start @3xl:gap-1.5">
          {grade ? <GradeBadge grade={grade} label="Lab grade" /> : null}
          {score !== undefined ? (
            <span data-numeric className="t-small text-fg">
              {formatScore(score)}
              <span className="text-fg-muted"> / 10</span>
            </span>
          ) : null}
        </div>
        <div className="grid justify-items-start gap-2">
          {warning ? (
            <WarningNote warning={warning} href={href} className="max-w-[12rem]" />
          ) : offer ? (
            <Price
              amount={offer.price}
              currency={offer.currency}
              size="sm"
              note={perServing ? `${formatPrice(perServing.amount, offer.currency)} per ${perServing.serving}` : `at ${offer.merchantName}`}
            />
          ) : (
            <p className="m-0 t-small text-fg-muted">Sold out everywhere we checked</p>
          )}
          {offer && grade !== "F" ? (
            <BuyPill offer={offer} productId={product.id} placement="ranking" attribution={attribution}>
              Buy at {offer.merchantName}
            </BuyPill>
          ) : null}
          {offer && grade === "F" ? <p className="m-0 max-w-[12rem] t-caption text-fg-muted">We don’t link to products that fail.</p> : null}
          {compare ? <CompareButton item={toReaderItem(summary)} /> : null}
        </div>
      </div>
    </li>
  );
}

export interface RankingListProps {
  /** The heading, saying what is ranked and on what: “Creatine, ranked by lab results”. */
  heading: string;
  /** Every product in the category, in any order: the list sorts them. */
  products: ProductSummary[];
  /** The order on load: `quality` the test results (default) · `value` the cost per serving · `certified` certified first · `name` A to Z. */
  defaultSort?: RankingSort;
  /** Products shown before “Show more” (default 20). */
  pageSize?: number;
  /** A Compare box on every row, for pages that show the `CompareTray`. */
  compare?: boolean;
  /** Where the site says how it earns from links, linked from the line above the list. */
  disclosureHref: string;
  /** Campaign attribution added to every buy link. */
  attribution?: AffiliateAttribution;
  /** The section’s id, for links to it (default `ranking`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A whole category, ranked: every product as a row with its photograph, its
 * brand and name (linked to its report), its certification and a line on
 * how it tested, its grade and score, the lowest price with the cost per
 * serving, and a buy pill. Rank by quality, value, certified first or A to
 * Z; the first 20 show, the rest behind Show more. No rank numbers: the
 * grade and the order say it. Products that failed (F) stay in the list,
 * low, and get no buy link.
 *
 * **Use it for** a category ranking page (Labdoor’s “Top creatine”).
 * **Not for** a guide’s picks (`QuickVerdictBento`, `ComparisonMatrix`),
 * a handful of related products (`PeopleAlsoLookedAt`), or products that
 * failed one test (`DisqualifiedSubTable`).
 *
 * @summary A whole category ranked: grade, photo, certification, cost per serving; four orders.
 * @import import { RankingList } from "@/kit/blocks";
 */
export function RankingList({ heading, products, defaultSort = "quality", pageSize = 20, compare = false, disclosureHref, attribution, id = "ranking", className }: RankingListProps) {
  const [sort, setSort] = useState<RankingSort>(defaultSort);
  const [limit, setLimit] = useState(pageSize);
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);
  // A product under a standing warning shows no certification, so it is not counted as certified.
  const certified = products.filter((p) => p.certification?.status === "certified" && !underWarning(p.product)).length;
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid gap-6", className)}>
      <div className="grid gap-2">
        <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
          {heading}
        </h2>
        <p data-numeric className="m-0 t-small text-fg-muted">
          {products.length} {products.length === 1 ? "product" : "products"} tested, {certified} certified.{" "}
          <a href={disclosureHref} className="kit-focus kit-link rounded-ctl">
            {INLINE_DISCLOSURE}
          </a>
        </p>
      </div>
      <SegmentedControl
        legend="Rank by"
        showLegend
        options={ORDERS}
        value={sort}
        onValueChange={(value) => {
          setSort(value as RankingSort);
          setLimit(pageSize);
        }}
        className="justify-self-start"
      />
      <div>
        <ol className="m-0 grid list-none p-0">
          {sorted.slice(0, limit).map((summary) => (
            <Row key={summary.product.id} summary={summary} compare={compare} attribution={attribution} />
          ))}
        </ol>
        {sorted.length > limit ? (
          <div className="border-t border-line pt-6">
            <Button onClick={() => setLimit(limit + pageSize)}>
              Show {Math.min(pageSize, sorted.length - limit)} more {sorted.length - limit === 1 ? "product" : "products"}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
