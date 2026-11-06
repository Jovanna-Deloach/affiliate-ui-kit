import type { Assay } from "@/kit/components/telemetry";
import type { KitProduct, Pick } from "@/kit/types";

import { creatineGuide } from "./creatine";
import { watchesGuide } from "./watches";

/**
 * Edge cases and typed slices for stories, derived from the proof guides so
 * every photograph stays one product’s: a product sold out at every
 * retailer, one sold by a single retailer, and the lab assays on their own.
 */

const [, , sato, , brennan] = watchesGuide.picks;

/** Sato Marine 38 with every retailer out of stock. */
export const soldOutProduct: KitProduct = {
  ...sato!.product,
  offers: sato!.product.offers.map((offer) => ({ ...offer, inStock: false })),
};

/** The Sato Marine 38 pick, sold out everywhere we track. */
export const soldOutPick: Pick = { ...sato!, product: soldOutProduct };

/** Brennan Field 36 from its own shop only: one retailer, so no “Best price” and no retailer rows. */
export const singleRetailerProduct: KitProduct = {
  ...brennan!.product,
  offers: brennan!.product.offers.slice(0, 1),
};

function assayOf(pick: Pick | undefined): Assay {
  if (pick?.measurements.kind !== "assay") throw new Error("Expected a pick with an assay");
  return pick.measurements;
}

/** The certificate of analysis for Peak Supply Creatine Monohydrate (passes). */
export const peakAssay = assayOf(creatineGuide.picks[0]);

/** The certificate of analysis for Ironhouse Creapure Micronised. */
export const ironhouseAssay = assayOf(creatineGuide.picks[1]);
