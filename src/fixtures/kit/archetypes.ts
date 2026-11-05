import { typesetDeep } from "@/kit/lib/typeset";
import type { RoundupGuide } from "@/kit/types";

import { creatineGuide } from "./creatine";
import { watchesGuide } from "./watches";

/** The same tested products, recomposed for the other archetypes. */

const pick = (guide: RoundupGuide, id: string) => {
  const found = guide.picks.find((p) => p.product.id === id);
  if (!found) throw new Error(`fixture pick ${id} not found`);
  return found;
};

/** Head-to-head: the two 40 mm steel watches on bracelets. */
export const versusGuide: RoundupGuide = typesetDeep<RoundupGuide>({
  ...watchesGuide,
  id: "meridian-vs-tide",
  crumbs: [
    { label: "Watches", href: "#watches" },
    { label: "Head to head", href: "#versus" },
  ],
  title: "Halden Meridian 40 GMT vs Okada Tide 40 Diver",
  dek: "Two 40 mm steel watches on bracelets, $2,300 apart. One is built for travel and one for the water; we wore each for a month to see which earns the wrist.",
  testedWith: "a watchmaker",
  telemetry: {
    stats: [
      { value: "2", label: "watches worn back to back" },
      { value: "60", label: "days of wear" },
      { value: "60", label: "mornings timed" },
    ],
    reference: watchesGuide.telemetry.reference,
  },
  picks: [{ ...pick(watchesGuide, "w-halden-meridian-40") }, { ...pick(watchesGuide, "w-okada-tide-40"), award: "Best for the water" }],
  railHeading: undefined,
  compare: { heading: "Side by side" },
  methodology: { ...watchesGuide.methodology, heading: "How we compared them" },
});

/** Single-product lab assay: our creatine pick, on its own. */
export const assayGuide: RoundupGuide = typesetDeep<RoundupGuide>({
  ...creatineGuide,
  id: "peak-supply-assay",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Lab reports", href: "#lab" },
  ],
  title: "Peak Supply Creatine Monohydrate, assayed",
  dek: "We bought three tubs from three merchants and sent them, blinded, to an accredited lab. Every tub landed within one percent of its label.",
  testedWith: "an ISO 17025 lab, two runs per tub",
  telemetry: {
    stats: [
      { value: "3", label: "tubs from three merchants" },
      { value: "6", label: "blinded HPLC runs" },
      { value: "5", label: "contaminants screened" },
    ],
    reference: creatineGuide.telemetry.reference,
  },
  picks: [{ ...pick(creatineGuide, "c-peak-mono-500"), synthesis: "100.4% of label claim, the mean of six blinded HPLC runs across three tubs, at $0.21 a serving." }],
  notRecommended: undefined,
  methodology: { ...creatineGuide.methodology, heading: "How we assayed it" },
});

/** Collector’s guide: the five watches as a catalogue, then each in full. */
export const collectorsGuide: RoundupGuide = typesetDeep<RoundupGuide>({
  ...watchesGuide,
  id: "watches-worth-keeping",
  crumbs: [
    { label: "Watches", href: "#watches" },
    { label: "Collecting", href: "#collecting" },
  ],
  title: "Five watches worth keeping for twenty years",
  dek: "Not the best in a category, but the five we would still wear in 2046: serviceable movements, honest finishing and cases that age well.",
  railHeading: "The five pieces",
  methodology: { ...watchesGuide.methodology, heading: "How we chose them" },
});
