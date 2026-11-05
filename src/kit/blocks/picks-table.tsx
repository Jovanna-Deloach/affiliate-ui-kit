import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import type { Metric, MetricValue, NotRecommended, Pick } from "@/kit/types";
import { BuyLink, ProductImage, ResultMark } from "@/kit/ui";
import type { AffiliateAttribution, AffiliateProductEntity } from "@/types/affiliate";

/**
 * Every pick measured on the same columns. One semantic table; on phones
 * each row becomes a stacked block with its labels (no duplicate markup).
 */
export interface PicksTableProps {
  heading: string;
  intro?: string;
  metrics: Metric[];
  picks: Pick[];
  notRecommended?: NotRecommended[];
  attribution?: AffiliateAttribution;
  className?: string;
}

function lowest(product: AffiliateProductEntity) {
  const inStock = product.offers.filter((o) => o.inStock);
  return [...(inStock.length ? inStock : product.offers)].sort((a, b) => a.price - b.price)[0];
}

function Value({ v }: { v?: MetricValue }) {
  if (!v) return <span className="text-fg-muted">—</span>;
  if (v.status && (v.value === "Pass" || v.value === "Fail")) return <ResultMark status={v.status}>{v.value}</ResultMark>;
  return (
    <span className={cn("inline-flex items-center gap-2 t-figure-table", v.status === "fail" ? "text-fail" : "text-fg")}>
      {v.value}
      {v.status === "fail" && <ResultMark status="fail">Fail</ResultMark>}
    </span>
  );
}

const cell = "max-md:flex max-md:items-baseline max-md:justify-between max-md:gap-4 max-md:py-1.5 max-md:before:t-small max-md:before:text-fg-muted max-md:before:content-[attr(data-label)] md:px-4 md:py-5";

export function PicksTable({ heading, intro, metrics, picks, notRecommended = [], attribution, className }: PicksTableProps) {
  const notes = metrics.filter((m) => m.note);
  return (
    <section id="compare" aria-labelledby="compare-heading" className={cn("kit-well scroll-mt-24", className)}>
      <h2 id="compare-heading" className="m-0 t-headline text-fg">
        {heading}
      </h2>
      {intro && <p className="m-0 mt-3 max-w-measure t-body text-fg-muted">{intro}</p>}
      <table className="mt-8 w-full border-collapse text-left max-md:block md:mt-10">
        <thead className="max-md:sr-only">
          <tr className="border-b border-line">
            <th scope="col" className="pr-4 pb-3 t-caption font-normal text-fg-muted">
              Product
            </th>
            <th scope="col" className="px-4 pb-3 t-caption font-normal text-fg-muted">
              Best for
            </th>
            {metrics.map((m) => (
              <th key={m.key} scope="col" className="px-4 pb-3 t-caption font-normal text-fg-muted">
                {m.label}
              </th>
            ))}
            <th scope="col" className="pb-3 pl-4 text-right t-caption font-normal text-fg-muted">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="max-md:block">
          {picks.map((pick) => {
            const offer = lowest(pick.product);
            return (
              <tr key={pick.product.id} className="border-b border-line max-md:block max-md:py-5">
                <th scope="row" className="py-5 pr-4 text-left font-normal max-md:block max-md:pt-0 max-md:pb-3 md:py-4">
                  <a href={`#${pick.product.slug}`} className="kit-focus group grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-4 rounded-ctl md:grid-cols-[4rem_minmax(0,1fr)]">
                    <ProductImage image={pick.product.media.primaryImage} ratio="square" inset="snug" sizes="128px" />
                    <span className="flex min-w-0 flex-col">
                      <span className="t-caption font-medium text-accent">{pick.award}</span>
                      <span className="t-ui text-fg decoration-1 underline-offset-4 group-hover:underline">
                        {pick.product.brand} {pick.product.name}
                      </span>
                    </span>
                  </a>
                </th>
                <td data-label="Best for" className={cn(cell, "t-small text-fg-muted max-md:text-right")}>
                  <span className="inline-block first-letter:uppercase">{pick.bestFor}</span>
                </td>
                {metrics.map((m) => (
                  <td key={m.key} data-label={m.label} className={cell}>
                    <Value v={pick.metrics[m.key]} />
                  </td>
                ))}
                <td data-label="Price" className={cn(cell, "md:pr-0 md:text-right")}>
                  {offer && (
                    <span className="inline-flex items-baseline gap-3">
                      <span className="t-figure-table text-fg">{formatPrice(offer.price, offer.currency ?? "USD")}</span>
                      <BuyLink offer={offer} productId={pick.product.id} placement="compare-table" attribution={attribution} className="t-small">
                        Buy
                      </BuyLink>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
        {notRecommended.length > 0 && (
          <tbody className="max-md:block">
            <tr className="max-md:block">
              <th scope="rowgroup" colSpan={metrics.length + 3} className="pt-10 pb-3 text-left t-ui font-medium text-fg max-md:block">
                Not recommended
              </th>
            </tr>
            {notRecommended.map((item) => (
              <tr key={item.name} className="border-t border-line max-md:block max-md:py-5">
                <th scope="row" className="py-4 pr-4 text-left font-normal max-md:block max-md:pt-0 max-md:pb-3">
                  <span className="flex flex-col">
                    <span className="t-ui text-fg">{item.name}</span>
                    <span className="t-small text-fg-muted">{item.reason}</span>
                  </span>
                </th>
                <td data-label="Best for" className={cn(cell, "t-small text-fg-muted")}>
                  —
                </td>
                {metrics.map((m) => (
                  <td key={m.key} data-label={m.label} className={cell}>
                    <Value v={item.metrics[m.key]} />
                  </td>
                ))}
                <td data-label="Price" className={cn(cell, "t-small text-fg-muted md:pr-0 md:text-right")}>
                  Not linked
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {notes.length > 0 && (
        <div className="mt-5 flex max-w-measure flex-col gap-1">
          {notes.map((m) => (
            <p key={m.key} className="m-0 t-caption text-fg-muted">
              <span className="text-fg">{m.label}:</span> {m.note}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
