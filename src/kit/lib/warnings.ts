import type { KitProduct, ProductWarning } from "@/kit/types";

/**
 * A WARNING OUTRANKS THE SALE — while a warning about a product stands, no
 * part of the kit links to a retailer for it or shows its score. Every buy
 * surface asks `underWarning(product)` before it sells.
 */
export function underWarning(product: Pick<KitProduct, "warning">): boolean {
  return product.warning?.status === "active";
}

/** The id of a product’s `ConsumerWarning` on its page, so the notes that replace its buy links can point at it. */
export function warningId(product: Pick<KitProduct, "slug">): string {
  return `warning-${product.slug}`;
}

/** What each kind of warning is called, as its label reads. */
export const WARNING_LABEL: Record<ProductWarning["kind"], string> = {
  recall: "Recall",
  regulator: "Regulator warning",
  "failed-test": "Failed our safety test",
  "fake-reviews": "Fake reviews found",
};
