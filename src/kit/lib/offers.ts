import type { MerchantOffer } from "@/types/affiliate";

/**
 * MERCHANT ORDER — the one rule every price surface in the kit follows:
 * in-stock offers by price, lowest first; sold-out offers after them. A
 * partner relationship never moves an offer up (a $160 partner cannot sit
 * above a $149 retailer). Ties keep the source order.
 */
export function rankOffers(offers: readonly MerchantOffer[]): MerchantOffer[] {
  return offers
    .map((offer, i) => ({ offer, i }))
    .sort((a, b) => Number(b.offer.inStock) - Number(a.offer.inStock) || a.offer.price - b.offer.price || a.i - b.i)
    .map(({ offer }) => offer);
}

/** The offer a page leads with: the lowest in-stock price, or nothing if every retailer is sold out. */
export function leadOffer(offers: readonly MerchantOffer[]): MerchantOffer | undefined {
  const [first] = rankOffers(offers);
  return first?.inStock ? first : undefined;
}

/** True when `offers` is already in kit order (used by the audit and the story checks). */
export function isRanked(offers: readonly Pick<MerchantOffer, "price" | "inStock">[]): boolean {
  for (let i = 1; i < offers.length; i++) {
    const a = offers[i - 1]!;
    const b = offers[i]!;
    if (!a.inStock && b.inStock) return false;
    if (a.inStock === b.inStock && a.price > b.price) return false;
  }
  return true;
}
