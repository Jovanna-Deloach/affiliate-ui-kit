import { toReaderItem } from "@/kit/lib/discovery";
import type { Certification, KitProduct, Pick, PriceAlert, PricePoint, ProductSummary, ProductWarning, SafetyNote } from "@/kit/types";

import { creatineGuide } from "./creatine";
import { creatineSummaries } from "./discovery";

/**
 * Safety and alerts: warnings about products and brands, certification
 * records, creatine’s safety notes, a price history and a reader’s price
 * alerts. Every brand, batch and event is fictional.
 */

/** A recall of two lots of the Fieldwork capsules: a different batch from the one the lab certified. */
export const capsuleRecall: ProductWarning = {
  kind: "recall",
  status: "active",
  title: "Milk protein in capsules labeled dairy-free",
  summary:
    "Fieldwork found that a new capsule supplier used a shell made with milk protein, which the label doesn’t list. People with a milk allergy could react to it. No illnesses have been reported.",
  affected: "Lots 0912 and 0913, sold from August 18 to October 30, 2026. The lot number is printed on the bottom of the jar.",
  action: "If you have a jar from either lot and a milk allergy, stop taking it. Fieldwork refunds every jar from these lots, with or without a receipt.",
  issuedAt: "2026-11-02T00:00:00Z",
  source: { name: "Fieldwork", href: "#fieldwork-recall-notice" },
};

/** The Fieldwork capsules while the recall stands: every buy link and the score come down. */
export const recalledCapsules: KitProduct = { ...creatineGuide.picks[3]!.product, warning: capsuleRecall };

/** The recalled capsules as a card and a ranking row show them. */
export const recalledSummary: ProductSummary = { ...creatineSummaries[3]!, product: recalledCapsules };

/** The recalled capsules as a pick in a guide. */
export const recalledPick: Pick = { ...creatineGuide.picks[3]!, product: recalledCapsules };

/** A creatine ranking with the capsules under the recall: they drop to the bottom, without a price or a buy link. */
export const rankingWithRecall: ProductSummary[] = [recalledSummary, creatineSummaries[0]!, creatineSummaries[1]!, creatineSummaries[2]!];

/** A product that failed the site’s own safety test. */
export const failedTestWarning: ProductWarning = {
  kind: "failed-test",
  status: "active",
  title: "Lead at 140% of the limit in both runs",
  summary:
    "Our lab found 140 parts per billion of lead in a 5 g serving of batch 7731, against a limit of 100, in both of its runs. We sent the results to Apex Stack on October 15; it has not replied.",
  affected: "Batch 7731, bought at retail in September 2026. We have not tested other batches.",
  action: "If you take it daily, switch to a certified creatine. One serving is not dangerous; months of them add up.",
  issuedAt: "2026-10-20T00:00:00Z",
  source: { name: "Proving Ground lab report", href: "#lab-apex-7731" },
};

/** A brand caught buying reviews. */
export const fakeReviewsWarning: ProductWarning = {
  kind: "fake-reviews",
  status: "active",
  title: "Paid for five-star reviews and hid the rest",
  summary:
    "Volt Labs offered customers a free tub for a five-star review, and asked buyers who complained to delete theirs. We removed 212 reviews we could tie to the offer, and labeled the page.",
  affected: "Reviews of every Volt Labs product posted from May to September 2026.",
  action: "Read the reviews posted since October, and the lab results, before you buy. The average now leaves out the removed reviews.",
  issuedAt: "2026-10-08T00:00:00Z",
  source: { name: "Proving Ground review integrity team", href: "#integrity-volt-labs" },
};

/** A regulator’s warning that has since been resolved. */
export const resolvedWarning: ProductWarning = {
  kind: "regulator",
  status: "resolved",
  title: "FDA warning letter over a disease claim",
  summary: "The FDA warned Summit Labs that its label claimed creatine HCl “treats muscle wasting”, a claim a supplement can’t make. Summit Labs changed the label.",
  action: "Nothing: the new label is on every jar sold since July.",
  issuedAt: "2026-03-10T00:00:00Z",
  resolvedAt: "2026-07-01T00:00:00Z",
  source: { name: "U.S. Food and Drug Administration", href: "#fda-warning-letter" },
};

/** A certification that lapsed, with every batch tested. */
export const expiredCertification: Certification = {
  status: "expired",
  date: "2026-03-01",
  history: [
    { batch: "1983", testedAt: "2025-03-02", passed: true, until: "2026-03-01", grade: "B+" },
    { batch: "1720", testedAt: "2024-02-12", passed: true, until: "2025-02-11", grade: "A-" },
    { batch: "1544", testedAt: "2023-01-20", passed: false, grade: "D" },
  ],
};

/** A new batch in the lab. */
export const upcomingCertification: Certification = {
  status: "upcoming",
  date: "2026-12-15",
  history: [{ batch: "5160", testedAt: "2025-11-04", passed: true, until: "2026-11-03", grade: "B" }],
};

/** A current certification, with its record. */
export const currentCertification: Certification = {
  status: "certified",
  date: "2027-10-14",
  history: [
    { batch: "2214", testedAt: "2026-10-14", passed: true, until: "2027-10-14", grade: "A+" },
    { batch: "1890", testedAt: "2025-10-02", passed: true, until: "2026-10-01", grade: "A" },
  ],
};

/** What to know about creatine’s safety. */
export const creatineSafetySummary = "Creatine is among the most studied supplements, and 3 to 5 g a day is safe for most healthy adults. A few people should check with a doctor first.";

export const creatineSafety: SafetyNote[] = [
  {
    kind: "avoid",
    severity: "serious",
    title: "Kidney disease",
    detail: "Creatine raises creatinine, the marker kidney tests read, and hasn’t been studied in people with kidney disease. Ask your doctor first.",
  },
  {
    kind: "avoid",
    severity: "moderate",
    title: "Pregnancy and breastfeeding",
    detail: "Too little research to call it safe. Wait, or ask your doctor.",
  },
  {
    kind: "interaction",
    severity: "moderate",
    title: "Medicines that are hard on the kidneys",
    detail: "Daily anti-inflammatories such as ibuprofen, some diuretics, and lithium. Ask a pharmacist before you combine them.",
  },
  {
    kind: "interaction",
    severity: "mild",
    title: "Caffeine",
    detail: "Some studies found large doses blunt creatine’s effect; others found no difference. A coffee or two is fine.",
  },
  {
    kind: "side-effect",
    severity: "mild",
    title: "Bloating or an upset stomach",
    detail: "Most common during a loading phase of 20 g a day. At 3 to 5 g a day it is rare; splitting the dose helps.",
  },
  {
    kind: "side-effect",
    severity: "mild",
    title: "Weight gain of 1 to 2 kg",
    detail: "Water drawn into muscle in the first weeks, not fat.",
  },
];

/** One price for a run of days. */
const days = (from: string, count: number, price: number | null, merchant?: string): PricePoint[] =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(`${from}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + i);
    return { date: date.toISOString().slice(0, 10), price, merchant: price === null ? undefined : merchant };
  });

/** Peak Supply Creatine’s lowest price from August 9 to November 6, 2026: a three-day sale, a sell-out, then today’s $21. */
export const peakPriceHistory: PricePoint[] = [
  ...days("2026-08-09", 23, 24, "Northlane"),
  ...days("2026-09-01", 11, 23, "Northlane"),
  ...days("2026-09-12", 3, 18, "Peak Supply"),
  ...days("2026-09-15", 16, 24, "Northlane"),
  ...days("2026-10-01", 6, null),
  ...days("2026-10-07", 14, 26, "Verra"),
  ...days("2026-10-21", 17, 21, "Peak Supply"),
];

/** The same 90 days for a product sold out since November 1. */
export const soldOutPriceHistory: PricePoint[] = [...days("2026-08-09", 40, 27, "Fieldwork"), ...days("2026-09-18", 44, 25, "Verra"), ...days("2026-11-01", 6, null)];

/** One reader’s price alerts, newest first. */
export const priceAlerts: PriceAlert[] = [
  { id: "a-104", item: toReaderItem(creatineSummaries[0]!, "2026-10-30T09:00:00Z"), kind: "below", price: 19, status: "active", createdAt: "2026-10-30T09:00:00Z" },
  { id: "a-103", item: toReaderItem(creatineSummaries[1]!, "2026-10-12T18:20:00Z"), kind: "below", price: 25, status: "paused", createdAt: "2026-10-12T18:20:00Z" },
  {
    id: "a-102",
    item: toReaderItem(creatineSummaries[2]!, "2026-09-28T07:45:00Z"),
    kind: "below",
    price: 29,
    status: "met",
    createdAt: "2026-09-28T07:45:00Z",
    met: { at: "2026-10-24T06:00:00Z", price: 28, merchant: "Northlane" },
  },
  { id: "a-101", item: toReaderItem(creatineSummaries[3]!, "2026-09-02T12:00:00Z"), kind: "in-stock", status: "met", createdAt: "2026-09-02T12:00:00Z", met: { at: "2026-09-10T15:30:00Z", price: 27, merchant: "Fieldwork" } },
];
