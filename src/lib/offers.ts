import type { AffiliateProductEntity, MerchantOffer } from "@/types/affiliate";

/** The offer a surface quotes by default: cheapest in stock, else cheapest overall. */
export function cheapestOffer(product: Pick<AffiliateProductEntity, "offers">): MerchantOffer | undefined {
  const inStock = product.offers.filter((o) => o.inStock);
  return (inStock.length ? inStock : product.offers).reduce<MerchantOffer | undefined>(
    (min, o) => (!min || o.price < min.price ? o : min),
    undefined,
  );
}
