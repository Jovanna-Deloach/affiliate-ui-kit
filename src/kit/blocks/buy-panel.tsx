import { cn } from "@/lib/cn";
import { formatDateShort, formatPrice } from "@/lib/format";
import { BuyButton, BuyLink } from "@/kit/ui";
import type { AffiliateAttribution, AffiliateProductEntity, MerchantOffer } from "@/types/affiliate";

/**
 * Where to buy. One price, one filled button for the best merchant, the
 * other merchants as quiet rows, and the disclosure right next to the
 * button (FTC proximity).
 */
export interface BuyPanelProps {
  product: AffiliateProductEntity;
  placement: string;
  disclosure: { text: string; href: string };
  attribution?: AffiliateAttribution;
  /** Hide the other merchants (compact contexts). */
  othersVisible?: boolean;
  className?: string;
}

function lead(product: AffiliateProductEntity): MerchantOffer | undefined {
  const inStock = product.offers.filter((o) => o.inStock);
  const pool = inStock.length ? inStock : product.offers;
  return pool.find((o) => o.isPrimaryPartner) ?? [...pool].sort((a, b) => a.price - b.price)[0];
}

export function BuyPanel({ product, placement, disclosure, attribution, othersVisible = true, className }: BuyPanelProps) {
  const primary = lead(product);
  if (!primary) return null;
  const currency = primary.currency ?? "USD";
  const others = product.offers.filter((o) => o.id !== primary.id);
  return (
    <div className={cn("flex flex-col", className)}>
      <p className="m-0 flex items-baseline gap-3">
        <span className="t-figure-xl text-fg">{formatPrice(primary.price, currency)}</span>
        {primary.originalPrice && primary.originalPrice > primary.price && (
          <s className="t-figure t-small text-fg-muted">{formatPrice(primary.originalPrice, currency)}</s>
        )}
      </p>
      <p className="m-0 mt-2 t-small text-fg-muted">
        At {primary.merchantName}
        {product.lastVerifiedAt && (
          <>
            , checked <time dateTime={product.lastVerifiedAt}>{formatDateShort(product.lastVerifiedAt)}</time>
          </>
        )}
      </p>
      <BuyButton offer={primary} productId={product.id} placement={placement} attribution={attribution} className="mt-5" />
      {othersVisible && others.length > 0 && (
        <ul aria-label="Other retailers" className="m-0 mt-6 list-none divide-y divide-line border-y border-line p-0">
          {others.map((o) => (
            <li key={o.id} className="grid grid-cols-[minmax(0,1fr)_auto_4.5rem] items-center gap-4 py-3">
              <span className="t-small text-fg">{o.merchantName}</span>
              <span className={cn("t-figure t-small", o.inStock ? "text-fg" : "text-fg-muted line-through")}>{formatPrice(o.price, o.currency ?? currency)}</span>
              {o.inStock ? (
                <BuyLink offer={o} productId={product.id} placement={`${placement}-others`} attribution={attribution} className="justify-self-end t-small">
                  View
                </BuyLink>
              ) : (
                <span className="justify-self-end t-small text-fg-muted">Sold out</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <p className="m-0 mt-4 t-caption text-fg-muted">
        {disclosure.text}{" "}
        <a href={disclosure.href} className="kit-focus kit-link rounded-ctl text-fg">
          How we make money
        </a>
      </p>
    </div>
  );
}
