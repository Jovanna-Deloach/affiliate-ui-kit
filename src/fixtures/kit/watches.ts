import type { RoundupGuide } from "@/kit/types";
import type { AffiliateProductEntity, MerchantOffer } from "@/types/affiliate";

/** Atelier proof page: everyday watches under $5,000 (all brands fictional). */

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
const product = (p: Omit<AffiliateProductEntity, "pros" | "cons" | "specs" | "verdictSummary"> & { verdictSummary?: string }): AffiliateProductEntity => ({
  pros: [],
  cons: [],
  specs: [],
  verdictSummary: "",
  ...p,
});

const meridian = product({
  id: "w-halden-meridian-40",
  slug: "halden-meridian-40-gmt",
  brand: "Halden",
  name: "Meridian 40 GMT",
  overallScore: 9.3,
  media: { primaryImage: img("watch-gmt-bracelet.svg", "Halden Meridian 40 GMT on its steel bracelet") },
  offers: [offer("meridian-hf", "Haus & Field", 3950, { isPrimaryPartner: true }), offer("meridian-verra", "Verra", 3990), offer("meridian-ws", "Watchstore", 4100, { inStock: false })],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const ardent = product({
  id: "w-lindqvist-ardent-38",
  slug: "lindqvist-ardent-38",
  brand: "Lindqvist",
  name: "Ardent 38",
  overallScore: 9.4,
  media: { primaryImage: img("watch-dress-light.svg", "Lindqvist Ardent 38 with a light dial on a leather strap") },
  offers: [offer("ardent-hf", "Haus & Field", 4850, { isPrimaryPartner: true }), offer("ardent-verra", "Verra", 4990, { inStock: false })],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const tide = product({
  id: "w-okada-tide-40",
  slug: "okada-tide-40",
  brand: "Okada",
  name: "Tide 40 Diver",
  overallScore: 8.9,
  media: { primaryImage: img("watch-dive-dark.svg", "Okada Tide 40 Diver with a dark dial and bracelet") },
  offers: [offer("tide-verra", "Verra", 1650, { isPrimaryPartner: true }), offer("tide-hf", "Haus & Field", 1695)],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const field = product({
  id: "w-brennan-field-36",
  slug: "brennan-field-36",
  brand: "Brennan",
  name: "Field 36",
  overallScore: 8.7,
  media: { primaryImage: img("watch-field-mid.svg", "Brennan Field 36 on a canvas strap") },
  offers: [offer("field-bren", "Brennan", 890, { isPrimaryPartner: true }), offer("field-ws", "Watchstore", 910)],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const marine = product({
  id: "w-sato-marine-38",
  slug: "sato-marine-38",
  brand: "Sato",
  name: "Marine 38",
  overallScore: 8.2,
  media: { primaryImage: img("watch-small-dark.svg", "Sato Marine 38 with a black dial on a rubber strap") },
  offers: [offer("marine-ws", "Watchstore", 420, { isPrimaryPartner: true }), offer("marine-verra", "Verra", 449)],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});

export const watchesGuide: RoundupGuide = {
  id: "everyday-watches",
  crumbs: [
    { label: "Watches", href: "#watches" },
    { label: "Buying guides", href: "#guides" },
  ],
  title: "The best everyday watches under $5,000",
  dek: "We wore fourteen watches for thirty days each, timed them against an atomic clock, and took them apart at the bench. Five earned a place on the wrist.",
  author: { name: "Celeste Marchetti", role: "Watches editor", avatar: { src: "/fixtures/portrait-marchetti.jpg", alt: "Celeste Marchetti" }, href: "#celeste" },
  testedWith: "two other reviewers over 420 days of wear",
  updatedAt: "2026-10-28T10:00:00Z",
  metrics: [
    { key: "case", label: "Case" },
    { key: "accuracy", label: "Accuracy", note: "Average daily deviation over 30 days, measured against an atomic reference." },
    { key: "water", label: "Water resistance" },
  ],
  picks: [
    {
      product: meridian,
      award: "Our pick",
      bestFor: "most people",
      verdict: "One watch that handles an office, a swim and a second time zone without asking you to choose.",
      body: [
        "The Meridian is the watch we kept reaching for after the testing ended. At 40 mm and 11.8 mm thick it sits under a cuff, the bracelet tapers from 20 to 16 mm so it never feels like a tool watch, and the 24-hour hand tracks home while you travel.",
        "It was also the most accurate automatic we tested: +1.6 seconds a day across thirty days, regardless of whether it lived on the wrist or on the nightstand. The movement is a widely serviced calibre, which matters more than finishing when you plan to wear a watch for twenty years.",
      ],
      likes: ["+1.6 s/day, the best of any automatic we timed", "Bracelet with tool-free micro-adjustment", "True GMT: the local hour hand jumps independently"],
      caveats: ["The polished centre links scratch quickly", "Lume fades after about four hours"],
      facts: [
        { label: "Case", value: "40 mm steel, 11.8 mm thick" },
        { label: "Movement", value: "Automatic GMT, 42-hour reserve" },
        { label: "Water resistance", value: "100 m" },
        { label: "Crystal", value: "Flat sapphire, anti-reflective inside" },
        { label: "Lug to lug", value: "47 mm" },
      ],
      metrics: { case: { value: "40 mm" }, accuracy: { value: "+1.6 s/day" }, water: { value: "100 m" } },
      evidence: {
        kind: "scores",
        heading: "How it scored",
        items: [
          { label: "Accuracy", score: 9.6 },
          { label: "Wearability", score: 9.4 },
          { label: "Finishing", score: 8.9 },
          { label: "Value", score: 9.2 },
        ],
      },
      quote: {
        text: "I stopped thinking about which watch to wear in the morning. That is the whole review.",
        person: { name: "Celeste Marchetti", role: "Wore it for 64 days" },
      },
    },
    {
      product: ardent,
      award: "Upgrade pick",
      bestFor: "a dress watch you will wear every day",
      verdict: "Enamel, a hand-wound movement and 38 mm proportions that work with a knit as well as a dinner jacket.",
      body: [
        "Dress watches usually ask for a special occasion. The Ardent does not: at 8.9 mm it slides under any sleeve, and the enamel dial has a depth you notice from across a room without ever looking loud.",
        "The in-house calibre is hand-wound with a 72-hour reserve. Winding it becomes a small morning ritual, and the movement is designed to be serviced by any competent watchmaker, not only the manufacturer.",
      ],
      likes: ["Grand feu enamel dial with real depth", "72-hour reserve on a serviceable movement", "8.9 mm thin without feeling fragile"],
      caveats: ["30 m water resistance: keep it dry", "No quick-release on the strap"],
      facts: [
        { label: "Case", value: "38 mm steel, 8.9 mm thick" },
        { label: "Movement", value: "Hand-wound, 72-hour reserve" },
        { label: "Water resistance", value: "30 m" },
        { label: "Dial", value: "Grand feu enamel" },
      ],
      metrics: { case: { value: "38 mm" }, accuracy: { value: "+3.1 s/day" }, water: { value: "30 m" } },
      evidence: {
        kind: "scores",
        heading: "How it scored",
        items: [
          { label: "Accuracy", score: 8.8 },
          { label: "Wearability", score: 9.5 },
          { label: "Finishing", score: 9.8 },
          { label: "Value", score: 8.6 },
        ],
      },
    },
    {
      product: tide,
      award: "Best dive watch",
      bestFor: "swimming and travel",
      verdict: "A 200 m diver that wears like a 38 mm watch and costs a third of the Meridian.",
      body: [
        "Most dive watches are thick and top-heavy. The Tide's short lugs and 12.4 mm case keep it planted, and the bezel has the cleanest action we tested: 120 firm clicks with no back-play.",
        "It ran at +4.8 seconds a day, comfortably inside its own specification, and survived three weeks of open-water swims without a scratch on the sapphire.",
      ],
      likes: ["200 m with a screw-down crown", "Crisp 120-click bezel", "Bracelet with an on-the-fly extension"],
      caveats: ["Date window breaks the dial's symmetry", "Clasp sits proud on smaller wrists"],
      facts: [
        { label: "Case", value: "40 mm steel, 12.4 mm thick" },
        { label: "Movement", value: "Automatic, 70-hour reserve" },
        { label: "Water resistance", value: "200 m" },
      ],
      metrics: { case: { value: "40 mm" }, accuracy: { value: "+4.8 s/day" }, water: { value: "200 m" } },
      evidence: {
        kind: "scores",
        heading: "How it scored",
        items: [
          { label: "Accuracy", score: 8.6 },
          { label: "Wearability", score: 9.0 },
          { label: "Finishing", score: 8.4 },
          { label: "Value", score: 9.5 },
        ],
      },
    },
    {
      product: field,
      award: "Best field watch",
      bestFor: "smaller wrists and rough use",
      verdict: "A 36 mm field watch that shrugs off a season of hiking and still looks right with a suit.",
      body: [
        "The Field 36 is the smallest watch on this list and the most legible: a matte dial, large numerals and hands that read at a glance in low light. It took a season of hiking and garden work without complaint.",
      ],
      likes: ["Highly legible at small size", "Hand-wound, easy to service", "Matte case hides scratches"],
      caveats: ["No date", "Acrylic option scratches; choose sapphire"],
      facts: [
        { label: "Case", value: "36 mm steel, 10.2 mm thick" },
        { label: "Movement", value: "Hand-wound, 46-hour reserve" },
        { label: "Water resistance", value: "100 m" },
      ],
      metrics: { case: { value: "36 mm" }, accuracy: { value: "+5.2 s/day" }, water: { value: "100 m" } },
    },
    {
      product: marine,
      award: "Budget pick",
      bestFor: "under $500",
      verdict: "The least expensive watch we would wear every day, with a movement you can service for decades.",
      body: [
        "At $420 the Marine is the only watch here under $500 that we would keep. Finishing is simple, but the case is solid steel, the crystal is sapphire and the movement is the same workhorse calibre found in watches three times the price.",
      ],
      likes: ["Sapphire crystal at $420", "Comfortable rubber strap", "Common, cheap-to-service movement"],
      caveats: ["Bezel action is loose", "Lume is weak"],
      facts: [
        { label: "Case", value: "38 mm steel, 12 mm thick" },
        { label: "Movement", value: "Automatic, 41-hour reserve" },
        { label: "Water resistance", value: "100 m" },
      ],
      metrics: { case: { value: "38 mm" }, accuracy: { value: "+9.4 s/day" }, water: { value: "100 m" } },
    },
  ],
  methodology: {
    body: [
      "We buy every watch at retail. Each was worn for at least thirty days by one of three reviewers, timed every morning against an atomic reference, and then opened at the bench to inspect the movement and the finishing.",
      "Prices are checked every week at the retailers we link to. A brand cannot pay to be included, and we return nothing to a manufacturer for review.",
    ],
    facts: [
      { value: "14", label: "watches bought at retail and worn" },
      { value: "420", label: "days of wear across three reviewers" },
      { value: "30", label: "mornings of timing per watch" },
    ],
  },
};
