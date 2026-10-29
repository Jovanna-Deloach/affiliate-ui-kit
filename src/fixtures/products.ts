import type {
  AffiliateProductEntity,
  MerchantOffer,
} from "@/types/affiliate";

/**
 * Story fixtures. One payload, rendered inside every vertical — the whole
 * point of the kit is that the *same data* reads as a luxury dossier in one
 * wrapper and as a lab scorecard in the other.
 *
 * Photography: real studio packshots (Unsplash — see public/fixtures/ATTRIBUTION.md).
 * `backdrop` is the sampled background colour of each shot so contain-fit
 * frames can match their tile to it; `cutoutBlend` is only set on the
 * genuinely white packshot, where mix-blend-multiply is invisible.
 */

const IMG = {
  aerolite: {
    src: "/fixtures/shoe-aerolite-01.jpg",
    alt: "Meridian Aerolite 3 running shoe, floating three-quarter view on grey studio backdrop",
    width: 1600,
    height: 1280,
    backdrop: "#c9cac4",
  },
  aeroliteAlt: {
    src: "/fixtures/shoe-aerolite-02.jpg",
    alt: "Meridian Aerolite 3 running shoe, medial side view on grey studio backdrop",
    width: 1600,
    height: 1280,
    backdrop: "#c9cac4",
  },
  tempo: {
    src: "/fixtures/shoe-tempo-01.jpg",
    alt: "Halvard Tempo Pro running shoe, floating side view on white",
    width: 1600,
    height: 1600,
  },
  cumulus: {
    src: "/fixtures/shoe-cumulus-01.jpg",
    alt: "Oriel Cumulus Max training shoe on volt backdrop",
    width: 1600,
    height: 2000,
    backdrop: "#b3e140",
  },
  watch: {
    src: "/fixtures/watch-ardent-01.jpg",
    alt: "Lindqvist Ardent 38 two-tone dive watch, dial detail on warm grey",
    width: 1600,
    height: 1067,
    backdrop: "#e4e2dd",
  },
  creatine: {
    src: "/fixtures/supplement-creatine-01.jpg",
    alt: "Peak Supply creatine capsule jar with blank label on cream backdrop",
    width: 1600,
    height: 1600,
    backdrop: "#e4d5b4",
  },
  creatineAlt: {
    src: "/fixtures/supplement-creatine-02.jpg",
    alt: "Peak Supply white supplement bottle with blank label on beige backdrop",
    width: 1600,
    height: 1600,
    backdrop: "#d1c3af",
  },
} as const;

const offersShoe01: MerchantOffer[] = [
  {
    id: "off-nl-01",
    merchantName: "Northlane",
    price: 189,
    originalPrice: 220,
    currency: "USD",
    affiliateUrl: "https://example-merchant.test/northlane/aerolite-3?ref=kit",
    inStock: true,
    promoCode: "KIT15",
    promoDescription: "15% off first order",
    shippingNote: "Free 2-day shipping",
    isPrimaryPartner: true,
    isBestPrice: true,
  },
  {
    id: "off-hf-01",
    merchantName: "Haus & Field",
    price: 199,
    currency: "USD",
    affiliateUrl: "https://example-merchant.test/hausfield/aerolite-3",
    inStock: true,
    shippingNote: "Free shipping over $150",
  },
  {
    id: "off-ps-01",
    merchantName: "Peak Supply",
    price: 205,
    currency: "USD",
    affiliateUrl: "https://example-merchant.test/peak/aerolite-3",
    inStock: false,
  },
  {
    id: "off-vr-01",
    merchantName: "Verra",
    price: 210,
    currency: "USD",
    affiliateUrl: "https://example-merchant.test/verra/aerolite-3",
    inStock: true,
  },
];

export const productShoe01: AffiliateProductEntity = {
  id: "prod-aerolite-3",
  slug: "aerolite-3",
  name: "Aerolite 3",
  brand: "Meridian",
  eyebrow: "Best Overall Daily Trainer",
  rank: 1,
  awardBadge: { label: "Best Overall", tier: "winner" },
  overallScore: 9.2,
  subScores: [
    { label: "Cushioning", score: 9.6, weight: 0.3 },
    { label: "Stability", score: 8.7, weight: 0.2 },
    { label: "Durability", score: 9.1, weight: 0.25 },
    { label: "Breathability", score: 8.9, weight: 0.15 },
    { label: "Value", score: 9.4, weight: 0.1 },
  ],
  verdictSummary:
    "After 412 logged miles across four testers, the Aerolite 3 delivered the most consistent energy return of any shoe in this round-up without the instability that usually comes with a tall stack.",
  pros: [
    "Exceptional energy return at 38 mm stack height",
    "Outsole showed only 1.2 mm wear after 300 miles",
    "True to size across all four testers",
  ],
  cons: ["Upper runs warm above 80°F", "Laces loosen on runs over 10 miles"],
  specs: [
    { label: "Weight", value: 8.4, unit: "oz", isHighlight: true, tooltip: "Men's US 9, measured on our calibrated scale." },
    { label: "Stack height", value: "38 / 30", unit: "mm", tooltip: "Heel / forefoot, measured to World Athletics spec." },
    { label: "Drop", value: 8, unit: "mm" },
    { label: "Upper", value: "Engineered mesh" },
    { label: "Midsole", value: "PEBA blend", tooltip: "Polyether block amide foam — lighter and more resilient than EVA." },
    { label: "Outsole rubber", value: "Carbon rubber heel, blown forefoot" },
    { label: "Energy return", value: 71, unit: "%", isHighlight: true, tooltip: "Lab-measured on a 4 kg drop rig, averaged over 20 drops." },
    { label: "Warranty", value: "30-day trial" },
  ],
  media: {
    primaryImage: IMG.aerolite,
    secondaryImage: IMG.aeroliteAlt,
    cutoutBlend: false,
  },
  offers: offersShoe01,
  lastVerifiedAt: "2026-10-27T14:00:00Z",
};

export const productShoe02: AffiliateProductEntity = {
  id: "prod-tempo-pro",
  slug: "tempo-pro",
  name: "Tempo Pro",
  brand: "Halvard",
  eyebrow: "Best for Speed Work",
  rank: 2,
  awardBadge: { label: "Editor's Pick", tier: "runner-up" },
  overallScore: 8.8,
  subScores: [
    { label: "Cushioning", score: 8.4, weight: 0.3 },
    { label: "Stability", score: 8.1, weight: 0.2 },
    { label: "Durability", score: 8.6, weight: 0.25 },
    { label: "Breathability", score: 9.5, weight: 0.15 },
    { label: "Value", score: 8.9, weight: 0.1 },
  ],
  verdictSummary:
    "The lightest shoe we tested, with a firmer ride that rewards faster paces. Not the pick for recovery days, but the one our testers reached for on track Tuesdays.",
  pros: ["Lightest in test at 7.1 oz", "Best breathability score", "Aggressive rocker geometry"],
  cons: ["Firm for easy miles", "Narrow toe box"],
  specs: [
    { label: "Weight", value: 7.1, unit: "oz", isHighlight: true },
    { label: "Stack height", value: "34 / 28", unit: "mm" },
    { label: "Drop", value: 6, unit: "mm" },
    { label: "Upper", value: "Mono mesh" },
    { label: "Midsole", value: "Supercritical EVA" },
    { label: "Outsole rubber", value: "Full-length blown" },
    { label: "Energy return", value: 66, unit: "%" },
    { label: "Warranty", value: "None" },
  ],
  media: {
    primaryImage: IMG.tempo,
    cutoutBlend: true,
  },
  offers: [
    { id: "off-nl-02", merchantName: "Northlane", price: 160, currency: "USD", affiliateUrl: "https://example-merchant.test/northlane/tempo-pro", inStock: true, isPrimaryPartner: true },
    { id: "off-vr-02", merchantName: "Verra", price: 149, originalPrice: 160, currency: "USD", affiliateUrl: "https://example-merchant.test/verra/tempo-pro", inStock: true, isBestPrice: true },
  ],
  lastVerifiedAt: "2026-10-26T09:30:00Z",
};

export const productShoe03: AffiliateProductEntity = {
  id: "prod-cumulus-max",
  slug: "cumulus-max",
  name: "Cumulus Max",
  brand: "Oriel",
  eyebrow: "Best Budget",
  rank: 3,
  awardBadge: { label: "Lab Tested", tier: "callout" },
  overallScore: 8.1,
  subScores: [
    { label: "Cushioning", score: 8.8, weight: 0.3 },
    { label: "Stability", score: 7.4, weight: 0.2 },
    { label: "Durability", score: 7.9, weight: 0.25 },
    { label: "Breathability", score: 7.8, weight: 0.15 },
    { label: "Value", score: 9.7, weight: 0.1 },
  ],
  verdictSummary:
    "Plush, forgiving, and a hundred dollars cheaper than the winner. The midsole packs out faster than we'd like, but at this price it's hard to argue.",
  pros: ["Outstanding value", "Plush, forgiving ride", "Wide fit available"],
  cons: ["Midsole compressed 14% by 250 miles", "Heavy at 10.2 oz", "Mediocre wet-grip"],
  specs: [
    { label: "Weight", value: 10.2, unit: "oz" },
    { label: "Stack height", value: "40 / 32", unit: "mm", isHighlight: true },
    { label: "Drop", value: 8, unit: "mm" },
    { label: "Upper", value: "Knit" },
    { label: "Midsole", value: "EVA" },
    { label: "Outsole rubber", value: "Carbon rubber" },
    { label: "Energy return", value: 58, unit: "%" },
    { label: "Warranty", value: "60-day trial" },
  ],
  media: {
    primaryImage: IMG.cumulus,
    cutoutBlend: false,
  },
  offers: [
    { id: "off-ps-03", merchantName: "Peak Supply", price: 89, originalPrice: 110, currency: "USD", affiliateUrl: "https://example-merchant.test/peak/cumulus-max", inStock: true, isBestPrice: true, promoCode: "PEAK10", promoDescription: "Extra 10% at checkout" },
    { id: "off-hf-03", merchantName: "Haus & Field", price: 99, currency: "USD", affiliateUrl: "https://example-merchant.test/hausfield/cumulus-max", inStock: true },
  ],
  lastVerifiedAt: "2026-10-20T16:45:00Z",
};

export const roundupProducts: AffiliateProductEntity[] = [
  productShoe01,
  productShoe02,
  productShoe03,
];

/**
 * Thirty-item directory payload to exercise the zero-runtime-JS loop rule.
 * Distinct, realistic brand + model names (never concatenated loop indices).
 */
const DIRECTORY_NAMES: ReadonlyArray<readonly [brand: string, name: string, eyebrow: string]> = [
  ["Meridian", "Aerolite 3", "Best Overall Daily Trainer"],
  ["Halvard", "Tempo Pro 2", "Best for Speed Work"],
  ["Oriel", "Cumulus Max", "Best Budget"],
  ["Veloce", "Carbon Elite", "Best Race Day"],
  ["Kinetix", "Stride GTX", "Best Waterproof"],
  ["Northwind", "Glide 7", "Best Recovery"],
  ["Ardent", "Pace Zero", "Lightest Tested"],
  ["Solace", "Float 2", "Plushest Ride"],
  ["Tessera", "Ridge Trail", "Best Trail"],
  ["Halvard", "Vanta Racer", "Fastest Lab Time"],
  ["Meridian", "Aerolite 3 Wide", "Best Wide Fit"],
  ["Oriel", "Nimbus Lite", "Best Under $100"],
  ["Lumen", "Arc 4", "Most Durable Outsole"],
  ["Veloce", "Strata", "Best Stability"],
  ["Kinetix", "Pulse 9", "Best Breathability"],
  ["Northwind", "Drift", "Best Long Run"],
  ["Ardent", "Momentum", "Best Tempo Value"],
  ["Solace", "Cloud Nine", "Softest Midsole"],
  ["Tessera", "Summit", "Best Rocky Trail"],
  ["Lumen", "Flux", "Best Gym-to-Run"],
  ["Meridian", "Helix 2", "Best Heel Lockdown"],
  ["Halvard", "Cadence", "Best Beginner"],
  ["Oriel", "Stratus", "Best Walking Comfort"],
  ["Veloce", "Ember", "Best Winter Grip"],
  ["Kinetix", "Orbit", "Best Treadmill"],
  ["Northwind", "Harbor", "Best Sustainable"],
  ["Ardent", "Verge", "Best Marathon"],
  ["Solace", "Lull", "Best Easy Days"],
  ["Tessera", "Scree", "Best Mud Shedding"],
  ["Lumen", "Beacon", "Best Visibility"],
];

export const directoryProducts: AffiliateProductEntity[] = DIRECTORY_NAMES.map(
  ([brand, name, eyebrow], i) => {
    const base = roundupProducts[i % 3]!;
    const slug = `${brand}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return {
      ...base,
      id: `prod-${slug}`,
      slug,
      brand,
      name,
      eyebrow,
      rank: i + 1,
      awardBadge: i < 3 ? base.awardBadge : undefined,
      // Descending scores with one decimal of precision — always render with formatScore().
      overallScore: Math.round((9.5 - i * 0.12) * 10) / 10,
    };
  },
);

/** Luxury Editorial fixture. */
export const productWatch: AffiliateProductEntity = {
  id: "prod-ardent-38",
  slug: "ardent-38",
  name: "Ardent 38",
  brand: "Lindqvist",
  eyebrow: "The Dress Watch, Reconsidered",
  rank: 1,
  awardBadge: { label: "Editor's Pick", tier: "winner" },
  overallScore: 9.4,
  subScores: [
    { label: "Movement", score: 9.7, weight: 0.35 },
    { label: "Finishing", score: 9.6, weight: 0.3 },
    { label: "Wearability", score: 9.1, weight: 0.2 },
    { label: "Value", score: 8.8, weight: 0.15 },
  ],
  verdictSummary:
    "A 38 mm case with a cream enamel dial and a movement you can actually service. The rare dress watch that works with a knit as well as a dinner jacket.",
  pros: ["Enamel dial with genuine depth", "In-house, serviceable movement", "Perfect 38 mm proportions"],
  cons: ["No quick-release strap", "Two-year waitlist at retail"],
  specs: [
    { label: "Case", value: 38, unit: "mm" },
    { label: "Thickness", value: 8.9, unit: "mm", isHighlight: true },
    { label: "Movement", value: "Manual, in-house cal. 11", tooltip: "Hand-wound calibre with a 72-hour power reserve." },
    { label: "Water resistance", value: 50, unit: "m" },
    { label: "Crystal", value: "Domed sapphire" },
  ],
  media: {
    primaryImage: IMG.watch,
    cutoutBlend: false,
  },
  offers: [
    { id: "off-w-1", merchantName: "Haus & Field", price: 4850, currency: "USD", affiliateUrl: "https://example-merchant.test/hausfield/ardent-38", inStock: true, isPrimaryPartner: true },
    { id: "off-w-2", merchantName: "Verra", price: 4990, currency: "USD", affiliateUrl: "https://example-merchant.test/verra/ardent-38", inStock: false },
  ],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
};

/** Clinical Performance fixture. */
export const productCreatine: AffiliateProductEntity = {
  id: "prod-creatine-mono",
  slug: "creatine-monohydrate-500",
  name: "Creatine Monohydrate 500 g",
  brand: "Peak Supply",
  eyebrow: "Lab Tested · Batch 2214",
  rank: 1,
  awardBadge: { label: "Lab Tested", tier: "winner" },
  overallScore: 9.6,
  subScores: [
    { label: "Label accuracy", score: 9.9, weight: 0.4 },
    { label: "Purity", score: 9.8, weight: 0.3 },
    { label: "Solubility", score: 8.7, weight: 0.15 },
    { label: "Value", score: 9.4, weight: 0.15 },
  ],
  verdictSummary:
    "Third-party assay found 99.6% of label claim with no detectable heavy metals. The best-priced creatine that also passed every purity screen we ran.",
  pros: ["99.6% of label claim", "Below detection on heavy metals", "Lowest cost per 5 g dose"],
  cons: ["Grittier mouthfeel than micronised rivals"],
  specs: [
    { label: "Creatine per serving", value: 5, unit: "g", isHighlight: true },
    { label: "Label accuracy", value: 99.6, unit: "%", isHighlight: true, tooltip: "HPLC assay, ISO 17025 lab, batch 2214." },
    { label: "Lead", value: "< 0.1", unit: "µg", tooltip: "Below limit of detection." },
    { label: "Cost per dose", value: 0.21, unit: "USD" },
    { label: "Servings", value: 100 },
  ],
  media: {
    primaryImage: IMG.creatine,
    secondaryImage: IMG.creatineAlt,
    cutoutBlend: false,
  },
  offers: [
    { id: "off-c-1", merchantName: "Peak Supply", price: 21, originalPrice: 26, currency: "USD", affiliateUrl: "https://example-merchant.test/peak/creatine", inStock: true, isPrimaryPartner: true, isBestPrice: true, promoCode: "LAB20", promoDescription: "20% off subscriptions" },
    { id: "off-c-2", merchantName: "Northlane", price: 24, currency: "USD", affiliateUrl: "https://example-merchant.test/northlane/creatine", inStock: true },
  ],
  lastVerifiedAt: "2026-10-29T08:15:00Z",
};

/** Best current price for caption / reference-price lockups. */
export function bestPrice(product: AffiliateProductEntity): string | undefined {
  const inStock = product.offers.filter((o) => o.inStock);
  const cheapest = (inStock.length ? inStock : product.offers).reduce<MerchantOffer | undefined>(
    (min, o) => (!min || o.price < min.price ? o : min),
    undefined,
  );
  if (!cheapest) return undefined;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cheapest.currency ?? "USD",
    maximumFractionDigits: cheapest.price % 1 === 0 ? 0 : 2,
  }).format(cheapest.price);
}
