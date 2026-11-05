import type { RoundupGuide } from "@/kit/types";
import type { AffiliateProductEntity, MerchantOffer } from "@/types/affiliate";

/** Assay proof page: creatine, assayed in an accredited lab (all brands fictional). */

const img = (file: string, alt: string) => ({ src: `/fixtures/kit/${file}`, alt, width: 800, height: 800 });
const offer = (id: string, merchantName: string, price: number, extra: Partial<MerchantOffer> = {}): MerchantOffer => ({
  id,
  merchantName,
  price,
  currency: "USD",
  affiliateUrl: `https://example-merchant.test/${merchantName.toLowerCase().replace(/[^a-z]+/g, "-")}/${id}`,
  inStock: true,
  ...extra,
});
const product = (p: Omit<AffiliateProductEntity, "pros" | "cons" | "specs" | "verdictSummary">): AffiliateProductEntity => ({
  pros: [],
  cons: [],
  specs: [],
  verdictSummary: "",
  ...p,
});

const peak = product({
  id: "c-peak-mono-500",
  slug: "peak-supply-creatine-500",
  brand: "Peak Supply",
  name: "Creatine Monohydrate",
  overallScore: 9.6,
  media: { primaryImage: img("tub-wide.svg", "Peak Supply Creatine Monohydrate, 500 g tub") },
  offers: [offer("peak-own", "Peak Supply", 21, { isPrimaryPartner: true, originalPrice: 26 }), offer("peak-nl", "Northlane", 24), offer("peak-vr", "Verra", 25)],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});
const ironhouse = product({
  id: "c-ironhouse-creapure",
  slug: "ironhouse-creapure-micronised",
  brand: "Ironhouse",
  name: "Creapure Micronised",
  overallScore: 9.3,
  media: { primaryImage: img("tub-tall.svg", "Ironhouse Creapure Micronised, 300 g tub") },
  offers: [offer("iron-nl", "Northlane", 29, { isPrimaryPartner: true }), offer("iron-own", "Ironhouse", 32)],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});
const basics = product({
  id: "c-northlane-basics-1kg",
  slug: "northlane-basics-creatine-1kg",
  brand: "Northlane Basics",
  name: "Creatine Monohydrate 1 kg",
  overallScore: 8.9,
  media: { primaryImage: img("pouch-resealable.svg", "Northlane Basics Creatine, 1 kg resealable pouch") },
  offers: [offer("basics-nl", "Northlane", 32, { isPrimaryPartner: true })],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});
const fieldwork = product({
  id: "c-fieldwork-capsules",
  slug: "fieldwork-creatine-capsules",
  brand: "Fieldwork",
  name: "Creatine Capsules",
  overallScore: 8.5,
  media: { primaryImage: img("bottle-capsules.svg", "Fieldwork Creatine Capsules, 180-count bottle") },
  offers: [offer("fw-own", "Fieldwork", 27, { isPrimaryPartner: true }), offer("fw-vr", "Verra", 29)],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});

const purity = (lead: string, arsenic: string, moisture: string, moistureStatus: "pass" | "caution" = "pass") => [
  { label: "Lead", value: lead, limit: "≤ 0.5 µg", status: "pass" as const },
  { label: "Arsenic (inorganic)", value: arsenic, limit: "≤ 10 µg", status: "pass" as const },
  { label: "Dicyandiamide", value: "< 10 ppm", limit: "≤ 50 ppm", status: "pass" as const },
  { label: "Moisture", value: moisture, limit: "≤ 12.5%", status: moistureStatus },
];

export const creatineGuide: RoundupGuide = {
  id: "creatine",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Lab reports", href: "#lab" },
  ],
  title: "The best creatine, tested in a lab",
  dek: "We bought eighteen creatine supplements at retail and sent them, blinded, to an accredited lab. Four contain what the label says and nothing they shouldn't.",
  author: { name: "Dr. Priya Raman", role: "Lab director", avatar: { src: "/fixtures/portrait-raman.jpg", alt: "Dr. Priya Raman" }, href: "#priya" },
  testedWith: "an ISO 17025 lab, every batch assayed twice",
  updatedAt: "2026-10-29T08:00:00Z",
  metrics: [
    { key: "accuracy", label: "Label accuracy", note: "Measured creatine as a share of the label claim, mean of two HPLC runs." },
    { key: "metals", label: "Heavy metals" },
    { key: "cost", label: "Cost per 5 g" },
  ],
  picks: [
    {
      product: peak,
      award: "Our pick",
      bestFor: "most people",
      verdict: "Exactly the dose on the label, clean on every contaminant we screened, and the lowest price per serving of anything that passed.",
      body: [
        "Peak Supply's monohydrate measured 100.4% of its label claim across two HPLC runs, the closest of any product we tested. Lead, arsenic and cadmium were all under 20% of their limits, and the synthesis by-products that show up in cheap creatine were below quantitation.",
        "It is plain, unflavoured monohydrate — the form with the most research behind it — and at $0.21 per 5 g serving it costs less than every other product that passed.",
      ],
      likes: ["100.4% of label claim, the most accurate we tested", "All heavy metals under 20% of their limits", "$0.21 per serving"],
      caveats: ["Not micronised: slightly gritty in cold water", "Scoop is 3.5 g, not 5 g"],
      facts: [
        { label: "Form", value: "Monohydrate, unflavoured" },
        { label: "Servings", value: "100 × 5 g" },
        { label: "Third-party batch", value: "2214, assayed Oct 2026" },
      ],
      metrics: { accuracy: { value: "100.4%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.21" } },
      evidence: { kind: "results", heading: "Lab results per 5 g serving", items: purity("0.08 µg", "0.21 µg", "11.9%", "caution") },
    },
    {
      product: ironhouse,
      award: "Best micronised",
      bestFor: "mixing into cold drinks",
      verdict: "Dissolves fully in cold water, tests clean, and costs about twice as much as our pick.",
      body: [
        "If grit in a cold shake bothers you, Ironhouse is the answer: it dissolved completely at 20 °C in our saturation test. Label accuracy was 99.1% and every contaminant was well inside its limit.",
      ],
      likes: ["Fully dissolves in cold water", "99.1% of label claim", "True 5 g scoop"],
      caveats: ["$0.48 per serving, more than double our pick"],
      facts: [
        { label: "Form", value: "Micronised monohydrate" },
        { label: "Servings", value: "60 × 5 g" },
      ],
      metrics: { accuracy: { value: "99.1%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.48" } },
      evidence: { kind: "results", heading: "Lab results per 5 g serving", items: purity("0.11 µg", "0.30 µg", "10.8%") },
    },
    {
      product: basics,
      award: "Budget pick",
      bestFor: "the lowest cost per dose",
      verdict: "The cheapest creatine that passed every test, if you can live with a pouch and a gritty mix.",
      body: [
        "At $0.16 per serving, Northlane Basics is the least expensive creatine that passed our panel. It measured 98.2% of its claim — inside the acceptance window, though the lowest of our picks.",
      ],
      likes: ["$0.16 per serving", "Passed every purity screen"],
      caveats: ["98.2% of claim, lowest of our picks", "Pouch is awkward to scoop from"],
      facts: [
        { label: "Form", value: "Monohydrate, unflavoured" },
        { label: "Servings", value: "200 × 5 g" },
      ],
      metrics: { accuracy: { value: "98.2%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.16" } },
    },
    {
      product: fieldwork,
      award: "Best capsules",
      bestFor: "people who hate powders",
      verdict: "Six capsules make one 5 g dose; they are accurate and clean, but you pay for the convenience.",
      body: [
        "Capsules solve the taste and texture problem entirely. Fieldwork's measured 96.5% of claim, inside the window, and passed every contaminant screen.",
      ],
      likes: ["No taste, no mixing", "Passed every purity screen"],
      caveats: ["Six capsules per dose", "$0.54 per serving"],
      facts: [
        { label: "Form", value: "Monohydrate in vegan capsules" },
        { label: "Servings", value: "30 × 5 g (180 capsules)" },
      ],
      metrics: { accuracy: { value: "96.5%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.54" } },
    },
  ],
  notRecommended: [
    { name: "Volt Labs Creatine Gummies", reason: "Contained 62% of the creatine on the label.", metrics: { accuracy: { value: "62.0%", status: "fail" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$1.10" } } },
    { name: "Apex Stack Creatine HCl", reason: "Lead at 140% of the limit in both runs.", metrics: { accuracy: { value: "97.0%", status: "pass" }, metals: { value: "Fail", status: "fail" }, cost: { value: "$0.62" } } },
  ],
  methodology: {
    body: [
      "We buy every product at retail from three different merchants, remove the labels, and send blinded samples to an ISO 17025-accredited lab. Creatine content is measured by HPLC in duplicate; heavy metals by ICP-MS; by-products and moisture by the methods in USP <2040>.",
      "A product passes when it lands within 95–110% of its label claim and every contaminant is inside its limit. Brands cannot pay for testing or for placement.",
    ],
    facts: [
      { value: "18", label: "products bought at retail" },
      { value: "36", label: "blinded lab assays" },
      { value: "14", label: "failed at least one test" },
    ],
  },
};
