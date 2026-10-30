import type { AffiliateProductEntity } from "@/types/affiliate";
import type {
  ComplianceCopy,
  DirectoryColumn,
  NavGuide,
  NavVertical,
  NavWinner,
  RibbonItem,
  TrustStat,
} from "@/types/navigation";

import { productCreatine, productShoe01, productShoe02, productShoe03, productWatch } from "./products";

/**
 * Site-chrome fixtures: three verticals with their silos, most-read guides,
 * spotlight and top-three winners; the ribbon for the running hub; and the
 * footer's trust stats, directory and compliance copy. Names are distinct
 * and realistic — never concatenated loop indices.
 */

const derive = (
  base: AffiliateProductEntity,
  patch: Pick<AffiliateProductEntity, "id" | "slug" | "name" | "brand" | "eyebrow" | "overallScore"> & { rank: number },
): AffiliateProductEntity => ({ ...base, ...patch, awardBadge: undefined });

const creatineRunnerUp = derive(productCreatine, {
  id: "prod-ironhouse-creapure",
  slug: "ironhouse-creapure",
  name: "Creapure Micronised 300 g",
  brand: "Ironhouse",
  eyebrow: "Best Solubility",
  overallScore: 9.3,
  rank: 2,
});
const creatineBudget = derive(productCreatine, {
  id: "prod-northlane-creatine-1kg",
  slug: "northlane-creatine-1kg",
  name: "Creatine Monohydrate 1 kg",
  brand: "Northlane Basics",
  eyebrow: "Best Value per Serving",
  overallScore: 8.9,
  rank: 3,
});
const watchRunnerUp = derive(productWatch, {
  id: "prod-halden-meridian-40",
  slug: "halden-meridian-40",
  name: "Meridian 40",
  brand: "Halden",
  eyebrow: "Best Field Watch",
  overallScore: 9.1,
  rank: 2,
});
const watchBudget = derive(productWatch, {
  id: "prod-okada-tide-38",
  slug: "okada-tide-38",
  name: "Tide 38",
  brand: "Okada",
  eyebrow: "Best Under $1,000",
  overallScore: 8.8,
  rank: 3,
});

const guideShoes: NavGuide[] = [
  {
    id: "guide-daily-trainers",
    title: "The best daily trainers of 2026",
    href: "#guide-daily-trainers",
    image: productShoe01.media.primaryImage,
    updatedAt: "2026-10-27T14:00:00Z",
    tested: 24,
    winners: 5,
  },
  {
    id: "guide-carbon-plated",
    title: "Best carbon-plated racers, lab-timed",
    href: "#guide-carbon-plated",
    image: productShoe02.media.primaryImage,
    updatedAt: "2026-10-12T09:00:00Z",
    tested: 11,
    winners: 3,
  },
];

const guideSupplements: NavGuide[] = [
  {
    id: "guide-creatine",
    title: "Best creatine monohydrate, assayed in duplicate",
    href: "#guide-creatine",
    image: productCreatine.media.primaryImage,
    updatedAt: "2026-10-21T10:00:00Z",
    tested: 18,
    winners: 4,
  },
  {
    id: "guide-whey",
    title: "Best whey protein by label accuracy",
    href: "#guide-whey",
    image: productCreatine.media.secondaryImage ?? productCreatine.media.primaryImage,
    updatedAt: "2026-09-30T10:00:00Z",
    tested: 22,
    winners: 5,
  },
];

const guideWatches: NavGuide[] = [
  {
    id: "guide-dive-watches",
    title: "The best dive watches under $5,000",
    href: "#guide-dive-watches",
    image: productWatch.media.primaryImage,
    updatedAt: "2026-10-18T12:00:00Z",
    tested: 14,
    winners: 4,
  },
  {
    id: "guide-dress-watches",
    title: "Dress watches worth the wrist time",
    href: "#guide-dress-watches",
    image: productWatch.media.primaryImage,
    updatedAt: "2026-08-22T12:00:00Z",
    tested: 11,
    winners: 3,
  },
];

const winnersRunning: NavWinner[] = [
  { product: productShoe01, accolade: "Best overall", href: "#review-aerolite-3" },
  { product: productShoe02, accolade: "Best for speed work", href: "#review-tempo-pro" },
  { product: productShoe03, accolade: "Best budget", href: "#review-cumulus-max" },
];
const winnersSupplements: NavWinner[] = [
  { product: productCreatine, accolade: "Best overall", href: "#review-creatine-mono" },
  { product: creatineRunnerUp, accolade: "Best solubility", href: "#review-ironhouse-creapure" },
  { product: creatineBudget, accolade: "Best value", href: "#review-northlane-creatine" },
];
const winnersWatches: NavWinner[] = [
  { product: productWatch, accolade: "Best overall", href: "#review-ardent-38" },
  { product: watchRunnerUp, accolade: "Best field watch", href: "#review-halden-meridian-40" },
  { product: watchBudget, accolade: "Best under $1,000", href: "#review-okada-tide-38" },
];

export const navRunning: NavVertical = {
  id: "running",
  label: "Running",
  href: "#running",
  description: "Shoes, logged by the mile",
  categories: [
    { id: "daily-trainers", label: "Daily trainers", href: "#running/daily-trainers", count: 24 },
    { id: "carbon-plated", label: "Carbon plated", href: "#running/carbon-plated", count: 11 },
    { id: "trail", label: "Trail", href: "#running/trail", count: 15 },
    { id: "stability", label: "Stability", href: "#running/stability", count: 9 },
    { id: "recovery", label: "Recovery", href: "#running/recovery", count: 7 },
    { id: "racing-flats", label: "Racing flats", href: "#running/racing-flats", count: 5 },
  ],
  guides: guideShoes,
  spotlight: {
    kind: "winner",
    eyebrow: "#1 overall · daily trainers",
    product: productShoe01,
    verdict: "The most consistent energy return of any shoe we have logged — 412 miles, four testers, no instability.",
    href: "#review-aerolite-3",
  },
  winners: winnersRunning,
};

export const navSupplements: NavVertical = {
  id: "supplements",
  label: "Supplements",
  href: "#supplements",
  description: "Assayed in duplicate, ISO 17025",
  categories: [
    { id: "creatine", label: "Creatine", href: "#supplements/creatine", count: 18 },
    { id: "protein", label: "Protein", href: "#supplements/protein", count: 22 },
    { id: "electrolytes", label: "Electrolytes", href: "#supplements/electrolytes", count: 12 },
    { id: "pre-workout", label: "Pre-workout", href: "#supplements/pre-workout", count: 14 },
    { id: "omega-3", label: "Omega-3", href: "#supplements/omega-3", count: 9 },
  ],
  guides: guideSupplements,
  spotlight: {
    kind: "tool",
    eyebrow: "Interactive tool",
    title: "Protein dose calculator",
    description: "Body weight, training load and goal in; grams per meal and a cost-per-serving ranking of every assayed powder out.",
    href: "#tools/protein-calculator",
    ctaLabel: "Open the calculator",
  },
  winners: winnersSupplements,
};

export const navWatches: NavVertical = {
  id: "watches",
  label: "Watches",
  href: "#watches",
  description: "Thirty days on the wrist, minimum",
  categories: [
    { id: "dive", label: "Dive", href: "#watches/dive", count: 14 },
    { id: "dress", label: "Dress", href: "#watches/dress", count: 11 },
    { id: "field", label: "Field", href: "#watches/field", count: 9 },
    { id: "chronograph", label: "Chronograph", href: "#watches/chronograph", count: 8 },
    { id: "under-1000", label: "Under $1,000", href: "#watches/under-1000", count: 16 },
  ],
  guides: guideWatches,
  spotlight: {
    kind: "winner",
    eyebrow: "#1 overall · dive watches",
    product: productWatch,
    verdict: "Lost four seconds in thirty days and the best bracelet articulation we have measured under $5,000.",
    href: "#review-ardent-38",
  },
  winners: winnersWatches,
};

export const siteNavigation: NavVertical[] = [navRunning, navSupplements, navWatches];

/** Secondary masthead links (not menus). */
export const siteUtilityLinks = [
  { label: "How we test", href: "#how-we-test" },
  { label: "Tools", href: "#tools" },
];

/** Sticky ribbon for the running hub — wide enough to overflow at 375px. */
export const runningRibbon: RibbonItem[] = [
  { id: "all", label: "All", href: "#running", count: 68 },
  { id: "daily-trainers", label: "Daily trainers", href: "#running/daily-trainers", count: 24 },
  { id: "carbon-plated", label: "Carbon plated", href: "#running/carbon-plated", count: 11 },
  { id: "trail", label: "Trail", href: "#running/trail", count: 15 },
  { id: "stability", label: "Stability", href: "#running/stability", count: 9 },
  { id: "under-150", label: "Under $150", href: "#running/under-150", count: 18 },
  { id: "recovery", label: "Recovery", href: "#running/recovery", count: 7 },
  { id: "racing-flats", label: "Racing flats", href: "#running/racing-flats", count: 5 },
  { id: "wide-fit", label: "Wide fit", href: "#running/wide-fit", count: 6 },
];

export const trustStats: TrustStat[] = [
  { value: "14,200+", label: "Lab hours" },
  { value: "480+", label: "Products assayed" },
  { value: "0", label: "Sponsored placements" },
  { value: "ISO 17025", label: "Lab partner" },
];

export const footerDirectory: DirectoryColumn[] = [
  {
    heading: "Categories",
    links: [
      { label: "Running", href: "#running" },
      { label: "Supplements", href: "#supplements" },
      { label: "Watches", href: "#watches" },
      { label: "Trail", href: "#running/trail" },
      { label: "Recovery", href: "#running/recovery" },
    ],
  },
  {
    heading: "Buying guides",
    links: [
      { label: "Best daily trainers", href: "#guide-daily-trainers" },
      { label: "Best carbon-plated racers", href: "#guide-carbon-plated" },
      { label: "Best creatine monohydrate", href: "#guide-creatine" },
      { label: "Best whey protein", href: "#guide-whey" },
      { label: "Best dive watches", href: "#guide-dive-watches" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { label: "Protein dose calculator", href: "#tools/protein-calculator" },
      { label: "Race pace calculator", href: "#tools/pace-calculator" },
      { label: "Price tracker", href: "#tools/price-tracker" },
      { label: "Compare products", href: "#tools/compare" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "How we test", href: "#how-we-test" },
      { label: "Our testers", href: "#testers" },
      { label: "Editorial charter", href: "#charter" },
      { label: "Corrections", href: "#corrections" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Affiliate disclosure", href: "#affiliate-disclosure" },
      { label: "Privacy", href: "#privacy" },
      { label: "Terms", href: "#terms" },
      { label: "Cookie settings", href: "#cookies" },
    ],
  },
];

export const complianceCopy: ComplianceCopy = {
  disclosure:
    "When you buy through links on this site we may earn an affiliate commission at no extra cost to you. Commissions never influence which products we test, how we score them, or where they rank — every product is purchased at retail with our own money.",
  charter: [
    "No sponsored placements, no paid rankings, no manufacturer loaners we are not free to criticise.",
    "Every score is reproducible: the protocol, the instruments and the raw numbers are published with the review.",
    "Corrections are logged in the open and dated on the page they amend.",
  ],
  copyright: "© 2026 Proving Ground Media. All rights reserved.",
  legalLinks: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Affiliate disclosure", href: "#affiliate-disclosure" },
  ],
};

export const publication = {
  name: "Proving Ground",
  tagline: "Tested, timed, assayed.",
  href: "#home",
};
