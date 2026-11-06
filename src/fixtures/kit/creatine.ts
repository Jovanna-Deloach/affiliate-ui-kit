import { typesetDeep } from "@/kit/lib/typeset";
import type { Measurements, Person, RoundupGuide } from "@/kit/types";

import { offer, product } from "./build";

/** Assay proof page: creatine, assayed in an accredited lab (all brands fictional). */

const raman: Person = { name: "Dr. Priya Raman", role: "Lab director", avatar: { src: "/fixtures/portrait-raman.jpg", alt: "Dr. Priya Raman" }, href: "#priya", beats: ["supplements"] };
const ibarra: Person = { name: "Tomás Ibarra", role: "Analytical chemist", href: "#tomas", beats: ["supplements"] };

/** Studio cut-outs (Unsplash, see public/fixtures/ATTRIBUTION.md), shown on the theme’s studio well. */
const photo = (file: string, alt: string, width: number, height: number) => ({ src: `/fixtures/kit/${file}`, alt, width, height });

const peak = product({
  id: "c-peak-mono-500",
  slug: "peak-supply-creatine-500",
  brand: "Peak Supply",
  name: "Creatine Monohydrate",
  image: photo("supp-peak.webp", "Peak Supply Creatine Monohydrate, a black-lidded 500 g jar", 572, 562),
  offers: [
    offer("peak-nl", "Northlane", 24, { shippingNote: "Free 2-day shipping" }),
    offer("peak-own", "Peak Supply", 21, { isPrimaryPartner: true, originalPrice: 26, shippingNote: "Free shipping over $35" }),
    offer("peak-vr", "Verra", 25, { shippingNote: "Free shipping over $50" }),
  ],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});
const ironhouse = product({
  id: "c-ironhouse-creapure",
  slug: "ironhouse-creapure-micronised",
  brand: "Ironhouse",
  name: "Creapure Micronised",
  image: photo("supp-ironhouse.webp", "Ironhouse Creapure Micronised, a white 300 g bottle", 660, 1200),
  offers: [offer("iron-nl", "Northlane", 29, { isPrimaryPartner: true, shippingNote: "Free 2-day shipping" }), offer("iron-own", "Ironhouse", 32, { shippingNote: "Ships in 3 days" })],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});
const basics = product({
  id: "c-northlane-basics-1kg",
  slug: "northlane-basics-creatine-1kg",
  brand: "Northlane Basics",
  name: "Creatine Monohydrate 1 kg",
  image: photo("supp-northlane.webp", "Northlane Basics Creatine Monohydrate, a white 1 kg tub", 796, 1200),
  offers: [offer("basics-nl", "Northlane", 32, { isPrimaryPartner: true, shippingNote: "Free 2-day shipping" })],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});
const fieldwork = product({
  id: "c-fieldwork-capsules",
  slug: "fieldwork-creatine-capsules",
  brand: "Fieldwork",
  name: "Creatine Capsules",
  image: photo("supp-fieldwork.webp", "Fieldwork Creatine Capsules, a clear jar of 180 capsules", 718, 1200),
  offers: [offer("fw-own", "Fieldwork", 27, { isPrimaryPartner: true, shippingNote: "Free shipping" }), offer("fw-vr", "Verra", 29, { shippingNote: "Free shipping over $50" })],
  lastVerifiedAt: "2026-10-29T08:00:00Z",
});

/** A certificate of analysis: runs, minor peaks, dose against its window, metals in ppb, other checks. */
const assay = (
  batch: string,
  runs: number[],
  impurities: number[],
  measured: number,
  metals: [lead: number, arsenic: number, cadmium: number, mercury: number],
  dcd: string,
  moisture: string,
  moistureStatus: "pass" | "caution" = "pass",
): Measurements => ({
  kind: "assay",
  batch,
  assayedAt: "2026-10-14T00:00:00Z",
  runs,
  impurities,
  claim: { label: "Creatine per 5 g serving", measured, low: 4.75, high: 5.5, unit: "g" },
  metals: [
    { label: "Lead", ppb: metals[0], limitPpb: 100 },
    { label: "Arsenic", ppb: metals[1], limitPpb: 2000 },
    { label: "Cadmium", ppb: metals[2], limitPpb: 100 },
    { label: "Mercury", ppb: metals[3], limitPpb: 40 },
  ],
  checks: [
    { label: "Dicyandiamide", value: dcd, limit: "≤ 50 ppm", status: "pass" },
    { label: "Moisture", value: moisture, limit: "≤ 12.5%", status: moistureStatus },
  ],
});

export const creatineGuide: RoundupGuide = typesetDeep<RoundupGuide>({
  id: "creatine",
  category: "supplements",
  crumbs: [
    { label: "Supplements", href: "#supplements" },
    { label: "Lab reports", href: "#lab" },
  ],
  title: "The best creatine, tested in a lab",
  dek: "We bought eighteen creatine supplements at retail and sent them, blinded, to an accredited lab. Four contain what the label says and nothing they shouldn't.",
  author: raman,
  testedWith: "an ISO 17025 lab, every batch assayed twice",
  updatedAt: "2026-10-29T08:00:00Z",
  telemetry: {
    stats: [
      { value: "18", label: "products bought at retail" },
      { value: "36", label: "blinded HPLC assays" },
      { value: "14", label: "failed at least one test" },
    ],
    reference: "Assays run by an ISO 17025-accredited lab, blinded to brand.",
  },
  metrics: [
    { key: "accuracy", label: "Label accuracy", note: "Measured creatine as a share of the label claim, mean of two HPLC runs." },
    { key: "metals", label: "Heavy metals" },
    { key: "cost", label: "Cost per 5 g" },
  ],
  jumpLabel: "See the lab data",
  compare: { heading: "The lab results", intro: "Every product, the same tests. Products that failed are listed so you know which to avoid." },
  picks: [
    {
      product: peak,
      award: "Our pick",
      descriptor: "Creatine monohydrate, 500 g tub",
      bestFor: "most people who want plain, proven creatine",
      verdict: "Plain, unflavored monohydrate that does exactly what the label promises, at a fair price.",
      synthesis: "100.4% of label claim across two blinded HPLC runs, at $0.21 a serving.",
      rating: { score: 9.6, tier: "Lab verified", standing: "100.4% of claim" },
      scores: [
        { label: "Label accuracy", score: 9.9 },
        { label: "Purity", score: 9.7 },
        { label: "Value", score: 9.4 },
        { label: "Mixability", score: 7.8 },
        { label: "Dosing", score: 7.6 },
      ],
      measurements: assay("2214", [100.2, 100.6], [0.018, 0.009], 5.02, [16, 42, 6, 1.8], "< 10 ppm", "11.9%", "caution"),
      body: [
        "Peak Supply’s monohydrate was the closest to its label of anything we tested. Lead, arsenic and cadmium all came in under a fifth of their limits, and the synthesis by-products that turn up in cheap creatine were below quantitation.",
        "It is plain, unflavored monohydrate, the form with the most research behind it, and it mixes into anything without changing the taste.",
      ],
      likes: ["Closest to its label of all eighteen", "Every contaminant under a fifth of its limit", "Unflavored, mixes into anything"],
      caveats: ["Not micronised: slightly gritty in cold water", "Scoop holds 3.5 g, not 5 g", "Moisture near its limit in one run"],
      facts: [
        { label: "Form", value: "Monohydrate, unflavored" },
        { label: "Net weight", value: "500 g" },
        { label: "Servings", value: "100 × 5 g" },
        { label: "Batch tested", value: "2214, assayed October 2026" },
      ],
      metrics: { accuracy: { value: "100.4%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.21" } },
      quote: { text: "Two runs, two days apart, within half a percent of each other. That is a well-made product.", person: ibarra, proof: "Ran both HPLC assays" },
    },
    {
      product: ironhouse,
      award: "Best micronised",
      descriptor: "Micronised creatine, 300 g bottle",
      bestFor: "mixing into cold drinks without grit",
      verdict: "The creatine to buy if grit in a cold shake is why you stopped taking it.",
      synthesis: "Fully dissolved at 20 °C in our saturation test, and 99.1% of its claim in both runs.",
      rating: { score: 9.3, tier: "Lab verified", standing: "99.1% of claim" },
      scores: [
        { label: "Label accuracy", score: 9.7 },
        { label: "Purity", score: 9.6 },
        { label: "Value", score: 7.9 },
        { label: "Mixability", score: 9.8 },
        { label: "Dosing", score: 9.5 },
      ],
      measurements: assay("IH-77", [98.9, 99.3], [0.012, 0.006], 4.96, [22, 60, 8, 2.1], "< 10 ppm", "10.8%"),
      body: [
        "If grit in a cold shake bothers you, Ironhouse is the answer. Micronising shrinks the particles so they dissolve completely, and it costs a little more per serving to get there.",
        "Every contaminant we screened for was well inside its limit, and the scoop holds a true 5 g, so a dose is one level scoop.",
      ],
      likes: ["No grit, even in cold water", "True 5 g scoop", "Creapure raw material"],
      caveats: ["$0.48 per serving, more than double our pick", "Pouch gets harder to scoop from as it empties"],
      facts: [
        { label: "Form", value: "Micronised monohydrate" },
        { label: "Net weight", value: "300 g" },
        { label: "Servings", value: "60 × 5 g" },
        { label: "Raw material", value: "Creapure" },
      ],
      metrics: { accuracy: { value: "99.1%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.48" } },
      quote: { text: "If texture is why you stopped taking creatine, start here.", person: raman, proof: "Ran the solubility test" },
    },
    {
      product: basics,
      award: "Budget pick",
      descriptor: "Creatine monohydrate, 1 kg tub",
      bestFor: "the lowest cost per dose that still passed",
      verdict: "The cheapest creatine that passed our full panel, in a tub that lasts 200 servings.",
      synthesis: "98.2% of claim and clean on every screen, at $0.16 a serving, the lowest of any product that passed.",
      rating: { score: 8.9, tier: "Lab verified", standing: "98.2% of claim" },
      scores: [
        { label: "Label accuracy", score: 9.1 },
        { label: "Purity", score: 9.2 },
        { label: "Value", score: 9.9 },
        { label: "Mixability", score: 7.6 },
        { label: "Dosing", score: 7.4 },
      ],
      measurements: assay("N-0931", [97.9, 98.5], [0.024, 0.011, 0.007], 4.91, [38, 84, 11, 2.6], "18 ppm", "11.2%"),
      body: [
        "Northlane Basics is the least expensive creatine that cleared our full panel. It landed inside the acceptance window, though at the low end, and dicyandiamide was detectable but far below its limit.",
        "The 1 kg tub lasts 200 servings. It is plain monohydrate with nothing added, so it mixes the same as our pick.",
      ],
      likes: ["Lowest cost per serving that passed", "Clean on every purity screen", "200 servings in one tub"],
      caveats: ["Lowest label accuracy of our picks", "Wide tub takes up shelf space"],
      facts: [
        { label: "Form", value: "Monohydrate, unflavored" },
        { label: "Net weight", value: "1 kg" },
        { label: "Servings", value: "200 × 5 g" },
        { label: "Batch tested", value: "N-0931, assayed October 2026" },
      ],
      metrics: { accuracy: { value: "98.2%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.16" } },
      quote: { text: "Inside the window on both runs. Cheap does not have to mean dirty.", person: ibarra, proof: "Checked the by-products" },
    },
    {
      product: fieldwork,
      award: "Best capsules",
      descriptor: "Creatine capsules, 180 count",
      bestFor: "people who hate powders",
      verdict: "Accurate, clean creatine for people who will only ever take a capsule.",
      synthesis: "96.5% of claim in vegan capsules, with the lowest moisture we measured; six make one 5 g dose.",
      rating: { score: 8.5, tier: "Lab verified", standing: "96.5% of claim" },
      scores: [
        { label: "Label accuracy", score: 8.6 },
        { label: "Purity", score: 9.5 },
        { label: "Value", score: 7.2 },
        { label: "Mixability", score: 10 },
        { label: "Dosing", score: 8.2 },
      ],
      measurements: assay("FW-4410", [96.1, 96.9], [0.02, 0.015], 4.83, [18, 50, 7, 1.5], "< 10 ppm", "6.1%"),
      body: [
        "Capsules solve the taste and texture problem entirely. Fieldwork’s landed inside the acceptance window and passed every contaminant screen.",
        "You pay for the convenience: at $0.54 a serving it is the most expensive of our picks, and six capsules a day is a lot of swallowing.",
      ],
      likes: ["No taste, no mixing", "Driest product we tested", "Travels without spilling"],
      caveats: ["Six capsules per dose", "Most expensive per serving of our picks"],
      facts: [
        { label: "Form", value: "Monohydrate in vegan capsules" },
        { label: "Count", value: "180 capsules" },
        { label: "Servings", value: "30 × 5 g" },
        { label: "Capsule", value: "Pullulan, size 00" },
      ],
      metrics: { accuracy: { value: "96.5%", status: "pass" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$0.54" } },
      quote: { text: "Accurate enough, clean, and the only format some people will actually take every day.", person: raman, proof: "Reviewed the results" },
    },
  ],
  notRecommended: [
    { name: "Volt Labs Creatine Gummies", reason: "Contained 62% of the creatine on the label.", metrics: { accuracy: { value: "62.0%", status: "fail" }, metals: { value: "Pass", status: "pass" }, cost: { value: "$1.10" } } },
    { name: "Apex Stack Creatine HCl", reason: "Lead at 140% of the limit in both runs.", metrics: { accuracy: { value: "97.0%", status: "pass" }, metals: { value: "Fail", status: "fail" }, cost: { value: "$0.62" } } },
  ],
  methodology: {
    heading: "How we tested 18 creatine supplements",
    summary: "We buy at retail, remove the labels and send blinded samples to an accredited lab. Brands cannot pay for testing or for placement.",
    steps: [
      { title: "Bought from three merchants", body: "Each product was bought at retail from three different merchants, so one bad batch cannot decide a result." },
      { title: "Blinded before testing", body: "We removed every label and coded the containers. The lab never knew which brand it was testing." },
      { title: "Creatine measured by HPLC", body: "Creatine content was measured by high-performance liquid chromatography, twice per sample, on different days." },
      { title: "Contaminants screened", body: "Lead, arsenic, cadmium and mercury were measured by ICP-MS; dicyandiamide and moisture by the methods in USP <2040>." },
      { title: "Pass or fail", body: "A product passes when it lands within 95-110% of its label claim and every contaminant is inside its limit." },
    ],
  },
});
