import { searchIndex as search } from "@/kit/lib/discovery";
import { summarize } from "@/kit/lib/reviews";
import { typesetDeep } from "@/kit/lib/typeset";
import type { BrandProfile, CategoryGuide, IngredientGuide, LabReport, ProductReport } from "@/kit/types";

import { creatineGuide } from "./creatine";
import { creatineRanking, creatineSummaries, searchIndex, supplementBrands } from "./discovery";
import {
  creatineDosage,
  creatineFaq,
  creatineNames,
  creatineOutcomes,
  creatineReferences,
  creatineResults,
  creatineReview,
  creatineStudies,
  peakLabReport,
} from "./evidence";
import { peakAiSummary, peakReviews, peakTopics, peakTrust, REVIEWS_NOW } from "./reviews";
import { creatineSafety, creatineSafetySummary, currentCertification, peakPriceHistory, recalledPick } from "./safety";

/**
 * Whole supplement pages, assembled from the other fixtures: a product’s
 * page (and the same page under a recall), a brand’s page, the creatine
 * category, creatine’s research page, and search results. Every product
 * shown has its own photograph; every brand, batch and study is fictional.
 */

const raman = creatineGuide.author;
const peakPick = creatineGuide.picks[0]!;

/** The Fieldwork capsules’ lab report: on the label, under every limit (the recall is about the capsule shell, not the creatine). */
export const fieldworkLabReport: LabReport = typesetDeep<LabReport>({
  finding: "The creatine matches the label within 5%, and every contaminant is under its limit.",
  tests: 16,
  batch: "1871",
  testedAt: "2026-10-14T00:00:00Z",
  lab: "Meridian Analytical, ISO 17025",
  serving: "4 capsules (5 g)",
  perServing: { amount: 0.54, currency: "USD" },
  tolerance: 5,
  ingredients: [{ name: "Creatine monohydrate", claimed: 5000, found: 4825, unit: "mg" }],
  contaminants: [
    { name: "Lead", found: 0.12, limit: 0.5, unit: "mcg", standard: "Prop 65" },
    { name: "Arsenic", found: null, limit: 15, unit: "mcg", standard: "USP" },
    { name: "Cadmium", found: null, limit: 4.1, unit: "mcg", standard: "Prop 65" },
    { name: "Mercury", found: null, limit: 15, unit: "mcg", standard: "USP" },
  ],
  watchlist: [],
});

/** Peak Supply Creatine Monohydrate’s own page: the review, the lab report, the evidence, its price, and readers’ reviews. */
export const peakReport: ProductReport = typesetDeep<ProductReport>({
  id: "peak-supply-creatine",
  category: "supplements",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Creatine", href: "#creatine" },
  ],
  href: "#report-peak",
  title: "Peak Supply Creatine Monohydrate: lab report and reviews",
  dek: "The creatine to buy: on its label to within half a percent, with every heavy metal far under its limit, at 21 cents a serving.",
  author: raman,
  reviewedBy: creatineReview,
  testedWith: "an ISO 17025 lab, every batch assayed twice",
  updatedAt: "2026-10-29T08:00:00Z",
  telemetry: {
    stats: [
      { value: "16", label: "tests on batch 2214" },
      { value: "2", label: "runs of every test" },
      { value: "0", label: "contaminants over a limit" },
    ],
    reference: "Batch 2214, bought at retail and sent to the lab without its label.",
  },
  pick: peakPick,
  grade: "A+",
  certification: currentCertification,
  lab: peakLabReport,
  evidence: { ingredient: "creatine", href: "#creatine-research", outcomes: creatineOutcomes.slice(0, 4) },
  priceHistory: peakPriceHistory,
  reviews: { items: peakReviews, topics: peakTopics, aiSummary: peakAiSummary, trust: peakTrust },
  alsoLookedAt: creatineSummaries.slice(1),
  faq: creatineFaq.slice(0, 3),
  methodology: creatineGuide.methodology,
});

/** The Fieldwork capsules’ page while the recall stands: the warning first, no score, no buy links. */
export const recalledReport: ProductReport = typesetDeep<ProductReport>({
  id: "fieldwork-creatine-capsules",
  category: "supplements",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Creatine", href: "#creatine" },
  ],
  href: "#report-fieldwork",
  title: "Fieldwork Creatine Capsules: lab report",
  dek: "The creatine inside tested well, but two lots of capsules contain milk protein the label doesn’t list. Check your lot number before you take another dose.",
  author: raman,
  reviewedBy: creatineReview,
  testedWith: "an ISO 17025 lab, every batch assayed twice",
  updatedAt: "2026-11-02T12:00:00Z",
  pick: recalledPick,
  grade: "A-",
  certification: currentCertification,
  lab: fieldworkLabReport,
  alsoLookedAt: [creatineSummaries[0]!, creatineSummaries[1]!, creatineSummaries[2]!],
});

/** Peak Supply’s brand page. */
export const peakBrandProfile: BrandProfile = typesetDeep<BrandProfile>({
  id: "peak-supply",
  category: "supplements",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Brands", href: "#brands" },
  ],
  brand: supplementBrands[0]!,
  dek: "A Denver brand that makes one thing, creatine monohydrate, and makes it well: our top-rated creatine two years running.",
  trust: peakTrust,
  // The card’s rating counts the same sample reviews the page shows, so the page agrees with itself.
  products: [{ ...creatineSummaries[0]!, rating: { average: Math.round(summarize(peakReviews, REVIEWS_NOW).average * 10) / 10, count: peakReviews.length } }],
  reviews: { items: peakReviews, topics: peakTopics, aiSummary: peakAiSummary },
  similar: supplementBrands.slice(1, 5),
});

/** The creatine category: the four certified products ranked, how all eighteen tested, and readers’ questions. */
export const creatineCategoryGuide: CategoryGuide = typesetDeep<CategoryGuide>({
  id: "creatine",
  category: "supplements",
  crumbs: [{ label: "Supplements", href: "#supplements" }],
  title: "Every creatine we tested, ranked",
  dek: "We bought eighteen creatine supplements at retail and sent each one to a lab, blinded. Four contain what the label says and nothing they shouldn’t.",
  author: raman,
  reviewedBy: creatineReview,
  testedWith: creatineGuide.testedWith,
  updatedAt: creatineGuide.updatedAt,
  telemetry: creatineGuide.telemetry,
  ranking: { heading: "The creatine we certify", summary: "The 4 of 18 that came within 5% of their label and passed every contaminant limit.", products: creatineRanking },
  results: creatineResults,
  faq: creatineFaq,
  references: creatineReferences.filter((r) => ["okafor-2024", "haddad-2021", "kowalski-2019", "meridian-2214"].includes(r.id)),
  noun: "creatine",
  methodology: creatineGuide.methodology,
});

/** Creatine’s research page. */
export const creatineIngredientGuide: IngredientGuide = typesetDeep<IngredientGuide>({
  id: "creatine-research",
  category: "supplements",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Ingredients", href: "#ingredients" },
  ],
  name: "Creatine",
  title: "Creatine: what the research says",
  dek: "What it does, how much to take, who should skip it, and the products we tested that contain it, from 72 trials and our own lab.",
  author: raman,
  reviewedBy: creatineReview,
  updatedAt: "2026-10-29T08:00:00Z",
  names: creatineNames.names,
  notConfusedWith: creatineNames.notConfusedWith,
  overview: [
    {
      text: "Creatine is a compound your muscles use to refill their quickest energy store. Your body makes about 1 g a day and food adds about as much; a supplement tops the store up by around a fifth.",
      cites: ["kowalski-2019"],
    },
    {
      text: "Taken alongside strength training, it adds to the strength and muscle people gain, in men and women and at any age; on its own, without training, it does little.",
      cites: ["okafor-2024", "brennan-2023"],
    },
    { text: "In healthy people it doesn’t harm the kidneys, though it raises creatinine, the marker kidney tests read.", cites: ["haddad-2021"] },
  ],
  outcomes: creatineOutcomes,
  dosage: creatineDosage,
  safety: { summary: creatineSafetySummary, notes: creatineSafety },
  studies: creatineStudies,
  products: creatineRanking,
  faq: creatineFaq,
  references: creatineReferences,
});

/** What a search for “creatine” finds. */
export const creatineQuery = "creatine";
export const creatineHits = search(searchIndex, creatineQuery);

/** A search that finds nothing. */
export const emptyQuery = "ashwagandha gummies";

