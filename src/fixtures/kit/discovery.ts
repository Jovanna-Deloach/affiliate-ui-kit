import { toReaderItem } from "@/kit/lib/discovery";
import type { Brand, ProductSummary, ReaderItem, SearchHit } from "@/kit/types";

import { creatineGuide } from "./creatine";

/**
 * Discovery and returning readers: supplement brands, products as cards and
 * ranking rows, a search index, and one reader’s history, saved items and
 * compare tray. Every brand is fictional; product photographs are credited
 * in public/fixtures/ATTRIBUTION.md.
 */

/** The moment relative dates count from in these fixtures. */
export const DISCOVERY_NOW = "2026-11-06T15:00:00Z";

const picked = creatineGuide.picks.map((pick) => pick.product);
const peak = picked[0]!;
const ironhouse = picked[1]!;
const basics = picked[2]!;
const fieldwork = picked[3]!;

/** The four creatine products the lab certified, as cards show them. */
export const creatineSummaries: ProductSummary[] = [
  {
    product: peak,
    href: "#report-peak",
    grade: "A+",
    score: 9.6,
    certification: { status: "certified", date: "2027-10-14" },
    rating: { average: 4.4, count: 1284 },
    perServing: { amount: 0.21, serving: "5 g" },
    note: "100.4% of the creatine on the label; every metal under a fifth of its limit.",
  },
  {
    product: ironhouse,
    href: "#report-ironhouse",
    grade: "A",
    score: 9.3,
    certification: { status: "certified", date: "2027-10-14" },
    rating: { average: 4.1, count: 612 },
    perServing: { amount: 0.48, serving: "5 g" },
    note: "99.1% of claim, and the only one that dissolved fully in cold water.",
  },
  {
    product: basics,
    href: "#report-basics",
    grade: "A-",
    score: 8.9,
    certification: { status: "certified", date: "2027-10-14" },
    rating: { average: 4.5, count: 2203 },
    perServing: { amount: 0.16, serving: "5 g" },
    note: "98.2% of claim at the lowest cost per serving we found.",
  },
  {
    product: fieldwork,
    href: "#report-fieldwork",
    grade: "A-",
    score: 8.5,
    certification: { status: "certified", date: "2027-10-14" },
    rating: { average: 4.3, count: 388 },
    perServing: { amount: 0.54, serving: "5 g (4 capsules)" },
    note: "96.5% of claim; capsules cost more than powder for the same dose.",
  },
];

/** The capsules again, sold out at every retailer we checked. */
export const soldOutSummary: ProductSummary = {
  ...creatineSummaries[3]!,
  product: { ...fieldwork, offers: fieldwork.offers.map((offer) => ({ ...offer, inStock: false })) },
};

/** Supplement brands, for brand cards and People also looked at on a brand’s page. */
export const supplementBrands: Brand[] = [
  { slug: "peak-supply", name: "Peak Supply", href: "#brand-peak-supply", website: "peaksupply.example", rating: { average: 4.4, count: 1284 }, tested: 3 },
  { slug: "northlane-basics", name: "Northlane Basics", href: "#brand-northlane-basics", website: "northlane.example", rating: { average: 4.5, count: 2203 }, tested: 5 },
  { slug: "ironhouse", name: "Ironhouse", href: "#brand-ironhouse", website: "ironhouse.example", rating: { average: 4.1, count: 612 }, tested: 2 },
  { slug: "fieldwork", name: "Fieldwork", href: "#brand-fieldwork", website: "fieldwork.example", rating: { average: 4.3, count: 388 }, tested: 2 },
  { slug: "tidewell", name: "Tidewell", href: "#brand-tidewell", website: "tidewell.example", rating: { average: 3.9, count: 154 }, tested: 2 },
  { slug: "volt-labs", name: "Volt Labs", href: "#brand-volt-labs", website: "voltlabs.example", rating: { average: 2.8, count: 431 }, tested: 2 },
];

/** A guide as the reader’s history keeps it. */
const guide = (id: string, title: string, at: string, progress?: number, section?: string): ReaderItem => ({
  kind: "guide",
  id,
  title,
  href: `#guide-${id}`,
  at,
  progress,
  section: section ? { title: section, href: `#guide-${id}-${section.toLowerCase().replace(/[^a-z]+/g, "-")}` } : undefined,
});

/** One reader’s recent history, newest first: two guides they did not finish, one they did, and four products. */
export const viewedItems: ReaderItem[] = [
  toReaderItem(creatineSummaries[0]!, "2026-11-06T13:40:00Z"),
  guide("creatine", "The best creatine, tested in a lab", "2026-11-06T13:20:00Z", 0.42, "The lab results"),
  toReaderItem(creatineSummaries[1]!, "2026-11-05T19:05:00Z"),
  guide("magnesium-forms", "Magnesium: which form, and how much", "2026-11-04T08:30:00Z", 0.18, "Glycinate, citrate or oxide"),
  toReaderItem(creatineSummaries[3]!, "2026-11-03T21:10:00Z"),
  guide("how-we-test", "How we test supplements", "2026-11-02T10:00:00Z", 0.98, "Who pays for the tests"),
  toReaderItem(creatineSummaries[2]!, "2026-10-30T12:00:00Z"),
];

/** One reader’s saved items, newest first, two with notes. */
export const savedItems: ReaderItem[] = [
  { ...toReaderItem(creatineSummaries[0]!, "2026-11-06T13:45:00Z"), note: "Buy the 1 kg tub next time: cheaper per serving." },
  guide("creatine", "The best creatine, tested in a lab", "2026-11-05T09:10:00Z"),
  toReaderItem(creatineSummaries[2]!, "2026-11-01T17:30:00Z"),
  { ...guide("how-we-test", "How we test supplements", "2026-10-20T08:00:00Z"), note: "Send to Dana before she buys gummies." },
];

/** Three products in the compare tray, in the order they were added. */
export const compareItems: ReaderItem[] = [toReaderItem(creatineSummaries[0]!, "2026-11-06T13:46:00Z"), toReaderItem(creatineSummaries[1]!, "2026-11-06T13:47:00Z"), toReaderItem(creatineSummaries[2]!, "2026-11-06T13:48:00Z")];

/** A signed-in reader, for the account menu. */
export const reader = { name: "Sam Ortega" };

/** Searches to suggest before a reader types. */
export const searchSuggestions = ["creatine", "magnesium glycinate", "fish oil", "vitamin D"];

const productHit = (summary: ProductSummary, snippet: string): SearchHit => ({
  id: summary.product.id,
  kind: "product",
  title: `${summary.product.brand} ${summary.product.name}`,
  href: summary.href,
  snippet,
  image: { src: summary.product.image.src, alt: "" },
  meta: summary.grade ? `Grade ${summary.grade.replace("-", "−")}` : undefined,
});

/** A small site index: products, brands, ingredients, guides and categories. */
export const searchIndex: SearchHit[] = [
  productHit(creatineSummaries[0]!, "Plain creatine monohydrate, 500 g: 100.4% of its label in our lab."),
  productHit(creatineSummaries[1]!, "Micronized Creapure creatine that dissolves in cold water."),
  productHit(creatineSummaries[2]!, "Creatine monohydrate in a 1 kg tub, the cheapest per serving."),
  productHit(creatineSummaries[3]!, "Creatine monohydrate in capsules, 180 count."),
  ...supplementBrands.slice(0, 4).map(
    (brand): SearchHit => ({
      id: brand.slug,
      kind: "brand",
      title: brand.name,
      href: brand.href,
      snippet: `${brand.tested} products tested, including creatine.`,
      meta: brand.rating ? `${brand.rating.average.toFixed(1)} stars from ${brand.rating.count.toLocaleString("en-US")} reviews` : undefined,
    }),
  ),
  { id: "creatine-monohydrate", kind: "ingredient", title: "Creatine monohydrate", href: "#ingredient-creatine", snippet: "The most studied form of creatine: 3 to 5 g a day raises muscle stores within a month.", meta: "Evidence grade A" },
  { id: "creatine-hcl", kind: "ingredient", title: "Creatine HCl", href: "#ingredient-creatine-hcl", snippet: "Creatine bound to hydrochloride: dissolves more easily, with far less research behind it.", meta: "Evidence grade C" },
  { id: "magnesium-glycinate", kind: "ingredient", title: "Magnesium glycinate", href: "#ingredient-magnesium-glycinate", snippet: "Magnesium bound to glycine, gentle on the stomach.", meta: "Evidence grade B" },
  { id: "creatine-guide", kind: "guide", title: "The best creatine, tested in a lab", href: "#guide-creatine", snippet: "We bought eighteen creatine supplements at retail and sent them, blinded, to an accredited lab.", meta: "Updated Oct 29, 2026" },
  { id: "monohydrate-vs-hcl", kind: "guide", title: "Creatine monohydrate vs. HCl", href: "#guide-monohydrate-vs-hcl", snippet: "Which form of creatine to buy, and why the cheaper one wins.", meta: "Updated Sep 12, 2026" },
  { id: "how-we-test", kind: "guide", title: "How we test supplements", href: "#guide-how-we-test", snippet: "Bought at retail, blinded, assayed twice in an accredited lab.", meta: "Updated Aug 2, 2026" },
  { id: "creatine-category", kind: "category", title: "Creatine", href: "#category-creatine", meta: "18 reports" },
  { id: "magnesium-category", kind: "category", title: "Magnesium", href: "#category-magnesium", meta: "9 reports" },
];
