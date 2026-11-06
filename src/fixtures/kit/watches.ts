import { typesetDeep } from "@/kit/lib/typeset";
import type { Person, RoundupGuide } from "@/kit/types";

import { offer, product } from "./build";

/** Atelier proof page: everyday watches under $5,000 (all brands fictional). */

const marchetti: Person = { name: "Celeste Marchetti", role: "Watches editor", avatar: { src: "/fixtures/portrait-marchetti.jpg", alt: "Celeste Marchetti" }, href: "#celeste", beats: ["watches"] };
const aalto: Person = { name: "Henrik Aalto", role: "Watchmaker", href: "#henrik", beats: ["watches"] };
const lindgren: Person = { name: "Mara Lindgren", role: "Reviewer", href: "#mara", beats: ["watches"] };

const POSITIONS = ["Dial up", "Dial down", "Crown up", "Crown down", "Crown left", "Crown right"];
const timing = (rates: number[]) => ({
  kind: "timing" as const,
  positions: rates.map((rate, i) => ({ label: POSITIONS[i]!, rate })),
  tolerance: [-4, 6] as [number, number],
  reference: "Bench test on a timegrapher after 30 days of wear.",
});

/** Studio cut-outs (Unsplash and Pexels, see public/fixtures/ATTRIBUTION.md), shown on the theme’s studio well. */
const photo = (file: string, alt: string, width: number, height: number) => ({ src: `/fixtures/kit/${file}`, alt, width, height });

const meridian = product({
  id: "w-halden-meridian-40",
  slug: "halden-meridian-40-gmt",
  brand: "Halden",
  name: "Meridian 40 GMT",
  image: photo("watch-meridian.webp", "Halden Meridian 40 GMT, steel case and bracelet with a red and blue bezel", 686, 1023),
  offers: [
    offer("meridian-hf", "Haus & Field", 3950, { isPrimaryPartner: true, shippingNote: "Free 2-day shipping" }),
    offer("meridian-verra", "Verra", 3990, { shippingNote: "Free shipping over $500" }),
    offer("meridian-ws", "Watchstore", 4100, { inStock: false }),
  ],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const ardent = product({
  id: "w-lindqvist-ardent-38",
  slug: "lindqvist-ardent-38",
  brand: "Lindqvist",
  name: "Ardent 38",
  image: photo("watch-ardent.webp", "Lindqvist Ardent 38, white dial on a brown leather strap", 1015, 1171),
  offers: [offer("ardent-hf", "Haus & Field", 4850, { isPrimaryPartner: true, shippingNote: "Free 2-day shipping" }), offer("ardent-verra", "Verra", 4990, { inStock: false })],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const marine = product({
  id: "w-sato-marine-38",
  slug: "sato-marine-38",
  brand: "Sato",
  name: "Marine 38",
  image: photo("watch-sato.webp", "Sato Marine 38, black dive bezel on an orange rubber strap", 867, 1069),
  offers: [offer("marine-ws", "Watchstore", 420, { isPrimaryPartner: true, shippingNote: "Free shipping" }), offer("marine-verra", "Verra", 449, { shippingNote: "Free shipping over $500" })],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const tide = product({
  id: "w-okada-tide-40",
  slug: "okada-tide-40",
  brand: "Okada",
  name: "Tide 40 Diver",
  image: photo("watch-okada.webp", "Okada Tide 40 Diver, black dial and bezel on a steel bracelet", 644, 1200),
  offers: [offer("tide-hf", "Haus & Field", 1695, { shippingNote: "Free 2-day shipping" }), offer("tide-verra", "Verra", 1650, { isPrimaryPartner: true, shippingNote: "Free shipping over $500" })],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});
const field = product({
  id: "w-brennan-field-36",
  slug: "brennan-field-36",
  brand: "Brennan",
  name: "Field 36",
  image: photo("watch-brennan.webp", "Brennan Field 36, navy dial with large numerals on a navy canvas strap", 585, 1200),
  offers: [offer("field-bren", "Brennan", 890, { isPrimaryPartner: true, shippingNote: "Free shipping and returns" }), offer("field-ws", "Watchstore", 910, { shippingNote: "Free shipping" })],
  lastVerifiedAt: "2026-10-28T10:00:00Z",
});

export const watchesGuide: RoundupGuide = typesetDeep<RoundupGuide>({
  id: "everyday-watches",
  category: "watches",
  crumbs: [
    { label: "Watches", href: "#watches" },
    { label: "Buying guides", href: "#guides" },
  ],
  title: "The best everyday watches under $5,000",
  dek: "We wore fourteen watches for thirty days each, timed them against an atomic clock and opened every one at the bench. Five earned a place on the wrist.",
  author: marchetti,
  testedWith: "two other reviewers and a watchmaker",
  updatedAt: "2026-10-28T10:00:00Z",
  telemetry: {
    stats: [
      { value: "14", label: "watches bought at retail" },
      { value: "420", label: "days of wear" },
      { value: "30", label: "mornings timed per watch" },
    ],
    reference: "Every reading taken against a GPS-disciplined atomic clock.",
  },
  metrics: [
    { key: "case", label: "Case" },
    { key: "accuracy", label: "Accuracy", note: "Mean daily deviation over 30 days, on the wrist and resting overnight." },
    { key: "water", label: "Water resistance" },
  ],
  jumpLabel: "Read the full review",
  compare: { heading: "Compare our picks" },
  picks: [
    {
      product: meridian,
      award: "Our pick",
      descriptor: "Automatic GMT, 40 mm steel",
      bestFor: "the office, the pool and a second time zone",
      verdict: "The one watch that travels, swims and dresses up without asking you to choose.",
      synthesis: "+1.6 s/day over 30 days of wrist and nightstand timing, the best of any automatic we tested.",
      rating: { score: 9.2, tier: "Exceptional", standing: "1st of 14 tested" },
      scores: [
        { label: "Accuracy", score: 9.6 },
        { label: "Wearability", score: 9.4 },
        { label: "Legibility", score: 9.1 },
        { label: "Finishing", score: 8.9 },
        { label: "Value", score: 9.2 },
      ],
      measurements: timing([0.9, 2.1, 1.4, 2.3, 1.2, 1.7]),
      body: [
        "The Meridian is the watch we kept reaching for after testing ended. At 40 mm across and 11.8 mm thick it slips under a cuff, the bracelet tapers from 20 to 16 mm so it never feels like a tool watch, and the 24-hour hand keeps home time while you travel.",
        "Its movement is a widely serviced caliber, which matters more than finishing when you plan to wear a watch for twenty years. Any competent watchmaker can regulate it, and parts are inexpensive.",
      ],
      likes: ["Local hour hand jumps on its own for travel", "Clasp micro-adjusts without tools", "Date and hands legible at a glance"],
      caveats: ["Polished center links scratch quickly", "Lume fades after about four hours"],
      facts: [
        { label: "Case", value: "40 mm steel, 11.8 mm thick" },
        { label: "Lug to lug", value: "47 mm" },
        { label: "Movement", value: "Automatic GMT, 42-hour reserve" },
        { label: "Water resistance", value: "100 m" },
        { label: "Crystal", value: "Flat sapphire, anti-reflective inside" },
      ],
      metrics: { case: { value: "40 mm" }, accuracy: { value: "+1.6 s/day" }, water: { value: "100 m" } },
      quote: { text: "I stopped thinking about which watch to wear in the morning. That is the whole review.", person: marchetti, proof: "64 days on the wrist" },
    },
    {
      product: ardent,
      award: "Upgrade pick",
      descriptor: "Hand-wound dress watch, 38 mm",
      bestFor: "a dress watch you can wear every day",
      verdict: "Enamel, a hand-wound movement and proportions that suit a knit as well as a dinner jacket.",
      synthesis: "8.9 mm thin with a 72-hour hand-wound reserve, and the finest finishing we found under $5,000.",
      rating: { score: 9.1, tier: "Exceptional", standing: "2nd of 14 tested" },
      scores: [
        { label: "Accuracy", score: 8.8 },
        { label: "Wearability", score: 9.5 },
        { label: "Legibility", score: 9.2 },
        { label: "Finishing", score: 9.8 },
        { label: "Value", score: 8.6 },
      ],
      measurements: timing([2.2, 4, 3.4, 2.6, 3.9, 2.5]),
      body: [
        "Dress watches usually wait for an occasion. The Ardent does not: it slides under any sleeve, and the grand feu enamel dial has a depth you notice from across a room without ever looking loud.",
        "Winding it becomes a small morning ritual. The in-house caliber is built to be serviced by any competent watchmaker, not only the manufacturer, which is rare at this price.",
      ],
      likes: ["Grand feu enamel dial with real depth", "Slim hands and indices keep the dial quiet", "Thin without feeling fragile"],
      caveats: ["30 m water resistance: keep it dry", "No quick-release on the strap", "Runs slow as the reserve nears empty"],
      facts: [
        { label: "Case", value: "38 mm steel, 8.9 mm thick" },
        { label: "Lug to lug", value: "45 mm" },
        { label: "Movement", value: "Hand-wound, 72-hour reserve" },
        { label: "Water resistance", value: "30 m" },
        { label: "Dial", value: "Grand feu enamel" },
      ],
      metrics: { case: { value: "38 mm" }, accuracy: { value: "+3.1 s/day" }, water: { value: "30 m" } },
      quote: { text: "The bridges are finished better than watches at twice the price, and nothing is hidden behind the caseback.", person: aalto, proof: "Opened at the bench" },
    },
    {
      product: marine,
      award: "Budget pick",
      descriptor: "Automatic diver, 38 mm",
      bestFor: "trying a mechanical watch without spending much",
      verdict: "Solid steel, sapphire and a serviceable automatic for less than a good pair of shoes.",
      synthesis: "Sapphire, solid steel and a serviceable automatic for $420, running a steady +9.4 s/day.",
      rating: { score: 8.1, tier: "Very good", standing: "Best under $500" },
      scores: [
        { label: "Accuracy", score: 7.4 },
        { label: "Wearability", score: 8.8 },
        { label: "Legibility", score: 8.2 },
        { label: "Finishing", score: 7.6 },
        { label: "Value", score: 9.7 },
      ],
      measurements: timing([7.8, 11.2, 9, 10.6, 8.3, 9.5]),
      body: [
        "The Marine is the only watch under $500 we would keep. Finishing is simple, but the case is solid steel, the crystal is sapphire, and the movement is the same workhorse caliber found in watches three times the price.",
        "It ran fast but steadily, which a watchmaker can regulate in minutes. The rubber strap is comfortable from the first day and takes seconds to swap.",
      ],
      likes: ["Sapphire crystal at this price", "Workhorse movement, cheap to service", "Light enough to forget on the wrist"],
      caveats: ["Bezel action is loose", "Lume is weak"],
      facts: [
        { label: "Case", value: "38 mm steel, 12 mm thick" },
        { label: "Lug to lug", value: "46 mm" },
        { label: "Movement", value: "Automatic, 41-hour reserve" },
        { label: "Water resistance", value: "100 m" },
        { label: "Strap", value: "Rubber, 20 mm" },
      ],
      metrics: { case: { value: "38 mm" }, accuracy: { value: "+9.4 s/day" }, water: { value: "100 m" } },
      quote: { text: "It is the watch I would hand a friend who wants to try mechanical without spending much.", person: lindgren, proof: "30 days on the wrist" },
    },
    {
      product: tide,
      award: "Best dive watch",
      descriptor: "Automatic diver, 40 mm, 200 m",
      bestFor: "swimming and travel",
      verdict: "A real dive watch that wears like a smaller one and survives the open water.",
      synthesis: "Rated to 200 m, ran +4.8 s/day, and had the cleanest bezel of the fourteen: 120 firm clicks, no back-play.",
      rating: { score: 8.9, tier: "Excellent", standing: "3rd of 14 tested" },
      scores: [
        { label: "Accuracy", score: 8.6 },
        { label: "Wearability", score: 9 },
        { label: "Legibility", score: 9.3 },
        { label: "Finishing", score: 8.4 },
        { label: "Value", score: 9.5 },
      ],
      measurements: timing([3.9, 5.6, 4.4, 5.9, 4.1, 4.9]),
      body: [
        "Most dive watches are thick and top-heavy. The Tide’s short lugs and 12.4 mm case keep it planted, and the bracelet extends on the fly when your wrist swells in the heat.",
        "It survived three weeks of open-water swims without a mark on the sapphire, and stayed comfortably inside its own accuracy specification throughout.",
      ],
      likes: ["Screw-down crown and 200 m rating", "On-the-fly bracelet extension", "Wears smaller than its 40 mm"],
      caveats: ["Date window breaks the dial’s symmetry", "Clasp sits proud on smaller wrists"],
      facts: [
        { label: "Case", value: "40 mm steel, 12.4 mm thick" },
        { label: "Lug to lug", value: "47 mm" },
        { label: "Movement", value: "Automatic, 70-hour reserve" },
        { label: "Water resistance", value: "200 m" },
        { label: "Bezel", value: "Unidirectional, 120 clicks" },
      ],
      metrics: { case: { value: "40 mm" }, accuracy: { value: "+4.8 s/day" }, water: { value: "200 m" } },
      quote: { text: "Three weeks of open water and the bezel still clicks like it did on the first day.", person: lindgren, proof: "3 weeks of open water" },
    },
    {
      product: field,
      award: "Best field watch",
      descriptor: "Automatic field watch, 36 mm",
      bestFor: "smaller wrists and rough use",
      verdict: "The smallest, most legible watch here, built for rough use and smaller wrists.",
      synthesis: "The most legible dial we tested, on a 36 mm case that shrugged off a season of hiking.",
      rating: { score: 8.7, tier: "Excellent", standing: "4th of 14 tested" },
      scores: [
        { label: "Accuracy", score: 8.3 },
        { label: "Wearability", score: 9.1 },
        { label: "Legibility", score: 9.8 },
        { label: "Finishing", score: 8 },
        { label: "Value", score: 9 },
      ],
      measurements: timing([4.1, 6.3, 5, 6.1, 4.6, 5.1]),
      body: [
        "The Field 36 is the smallest watch on this list and the easiest to read: a matte dial, large numerals and hands you can read at a glance in low light.",
        "We wore it through a season of hiking and garden work. The bead-blasted case hides scratches, the canvas strap dries in minutes, and the automatic movement is simple enough for any watchmaker.",
      ],
      likes: ["Reads at a glance, even at dusk", "Bead-blasted case hides wear", "Simple automatic, easy to service"],
      caveats: ["Day-date window crowds the 3", "Acrylic option scratches; choose sapphire"],
      facts: [
        { label: "Case", value: "36 mm steel, 10.2 mm thick" },
        { label: "Lug to lug", value: "43 mm" },
        { label: "Movement", value: "Automatic, 41-hour reserve" },
        { label: "Water resistance", value: "100 m" },
        { label: "Crystal", value: "Sapphire or acrylic" },
      ],
      metrics: { case: { value: "36 mm" }, accuracy: { value: "+5.2 s/day" }, water: { value: "100 m" } },
      quote: { text: "A simple, honest movement. Anyone can service it, and it will outlive its owner.", person: aalto, proof: "Serviced after testing" },
    },
  ],
  methodology: {
    heading: "How we tested 14 watches",
    summary: "We buy every watch at retail, wear it, time it and open it. A brand cannot pay to be included, and nothing goes back to a manufacturer for review.",
    steps: [
      { title: "Bought at retail", body: "Every watch came from the retailers we link to, at full price, so we went through the same purchase you will. Nothing was loaned." },
      { title: "Worn for thirty days", body: "Each watch spent a month on one of three reviewers’ wrists, through office days, travel and at least one swim where the rating allowed it." },
      { title: "Timed every morning", body: "We logged the deviation each morning against our reference, on the wrist and resting crown-up overnight, and report the mean daily rate." },
      { title: "Opened at the bench", body: "Our watchmaker removed every caseback, timed each movement in six positions and judged how easily it can be serviced." },
      { title: "Prices checked weekly", body: "We re-check every retailer each week and always lead with the lowest in-stock price, whoever sells it." },
    ],
  },
});
