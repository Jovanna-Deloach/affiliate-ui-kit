import type { KitProduct } from "@/kit/types";
import type { MerchantOffer } from "@/types/affiliate";

/** Fixture builders. Merchants are fictional; links point at a reserved test domain. */

export const offer = (id: string, merchantName: string, price: number, extra: Partial<MerchantOffer> = {}): MerchantOffer => ({
  id,
  merchantName,
  price,
  currency: "USD",
  affiliateUrl: `https://example-merchant.test/${merchantName.toLowerCase().replace(/[^a-z]+/g, "-")}/${id}`,
  inStock: true,
  ...extra,
});

export const product = (p: KitProduct): KitProduct => p;
