import { typesetDeep } from "@/kit/lib/typeset";
import type { Person, RoundupGuide } from "@/kit/types";

import { offer, product } from "./build";

/**
 * Proving Ground, running section: the running guide folded in from the
 * frozen library, rebuilt on the kit. Same publication as the creatine
 * report; only --accent-category differs. The Tempo Pro is the merchant
 * order proof: the partner sells it for $160, Verra for $149, and Verra
 * leads.
 */

const whitfield: Person = { name: "Marcus Whitfield", role: "Running editor", href: "#marcus", beats: ["running"] };
const okafor = (role: string): Person => ({ name: "Ana Okafor", role, href: "#ana", beats: ["running"] });

const aerolite = product({
  id: "r-meridian-aerolite-3",
  slug: "meridian-aerolite-3",
  brand: "Meridian",
  name: "Aerolite 3",
  offers: [
    offer("aero-nl", "Northlane", 189, { isPrimaryPartner: true, originalPrice: 220 }),
    offer("aero-hf", "Haus & Field", 199),
    offer("aero-ps", "Peak Supply", 205, { inStock: false }),
    offer("aero-vr", "Verra", 210),
  ],
  lastVerifiedAt: "2026-10-30T09:00:00Z",
});
const tempo = product({
  id: "r-halvard-tempo-pro",
  slug: "halvard-tempo-pro",
  brand: "Halvard",
  name: "Tempo Pro",
  offers: [offer("tempo-nl", "Northlane", 160, { isPrimaryPartner: true }), offer("tempo-vr", "Verra", 149, { originalPrice: 160 })],
  lastVerifiedAt: "2026-10-30T09:00:00Z",
});
const cumulus = product({
  id: "r-oriel-cumulus-max",
  slug: "oriel-cumulus-max",
  brand: "Oriel",
  name: "Cumulus Max",
  offers: [offer("cumulus-hf", "Haus & Field", 99), offer("cumulus-ps", "Peak Supply", 89, { originalPrice: 110 })],
  lastVerifiedAt: "2026-10-30T09:00:00Z",
});

export const runningGuide: RoundupGuide = typesetDeep<RoundupGuide>({
  id: "daily-running-shoes",
  category: "running",
  crumbs: [
    { label: "Running", href: "#running" },
    { label: "Shoe reviews", href: "#shoes" },
  ],
  title: "The best running shoes for daily training",
  dek: "Four testers ran 720 miles in twelve pairs. Then we cut every shoe in half to measure stack, foam rebound and wear at the bench. Three earned a place in the rotation.",
  author: whitfield,
  testedWith: "three other testers",
  updatedAt: "2026-10-30T09:00:00Z",
  telemetry: {
    stats: [
      { value: "12", label: "pairs bought at retail" },
      { value: "720", label: "miles on the road" },
      { value: "300", label: "miles before the wear test" },
    ],
    reference: "Stack measured on a sawn shoe; rebound in a drop test, new and worn.",
  },
  metrics: [
    { key: "weight", label: "Weight", note: "One shoe, US men's 10." },
    { key: "stack", label: "Heel / forefoot" },
    { key: "drop", label: "Drop" },
    { key: "energy", label: "Energy return", note: "Share of impact energy returned in a drop test, new shoe." },
    { key: "wear", label: "Rebound at 300 mi", note: "Change in energy return after 300 miles on the road." },
  ],
  bentoCount: 3,
  jumpLabel: "Read the full review",
  compare: { heading: "How they measured up", intro: "Weighed, sawn in half and drop-tested new and at 300 miles." },
  picks: [
    {
      product: aerolite,
      award: "Our pick",
      bestFor: "most runners, most days",
      synthesis: "71% energy return that lost only 4% after 300 miles, in an 8.4 oz shoe.",
      body: [
        "The Aerolite 3 is the shoe our testers reached for on days they did not want to think about shoes. The knit upper locks the midfoot without pressure points, and the 8 mm drop suits heel and midfoot strikers alike.",
        "Its supercritical foam feels soft at easy pace and firms up when you push. It wears well too: the outsole showed under a millimetre of wear at 300 miles.",
      ],
      likes: ["Soft at easy pace, firm when pushed", "Under 1 mm of outsole wear at 300 miles", "Secure midfoot without pressure points"],
      caveats: ["Knit upper runs warm in summer", "Narrow toe box for wide feet"],
      facts: [
        { label: "Weight", value: "8.4 oz (238 g)" },
        { label: "Stack", value: "38 mm heel, 30 mm forefoot" },
        { label: "Drop", value: "8 mm" },
        { label: "Midsole", value: "Supercritical EVA blend" },
        { label: "Plate", value: "None" },
      ],
      metrics: { weight: { value: "8.4 oz" }, stack: { value: "38 / 30 mm" }, drop: { value: "8 mm" }, energy: { value: "71%" }, wear: { value: "-4%" } },
      evidence: {
        kind: "scores",
        heading: "How it scored",
        items: [
          { label: "Cushioning", score: 9.2 },
          { label: "Responsiveness", score: 8.8 },
          { label: "Stability", score: 9 },
          { label: "Durability", score: 9.4 },
          { label: "Fit", score: 8.7 },
        ],
      },
      specimen: { kind: "shoe", heelStackMm: 38, forefootStackMm: 30, weightOz: 8.4, plate: "none", rocker: 0.45, upper: "knit" },
      quote: { text: "It disappears on the foot. Ten miles in, I was thinking about the run, not the shoe.", person: okafor("Tester, ran 190 miles in it") },
    },
    {
      product: tempo,
      award: "Best for fast days",
      bestFor: "tempo runs and intervals",
      synthesis: "76% energy return, the highest we measured, from a nylon-plated 7.6 oz shoe.",
      body: [
        "The Tempo Pro is the lightest shoe in our test and the most eager. A nylon plate and an aggressive rocker roll you forward at faster paces, and the mesh upper breathes well enough for summer intervals.",
        "It gives up cushioning on long easy runs, and the plate makes it stiff at a jog. As a second shoe for speed work, it is the best value we found.",
      ],
      likes: ["Highest energy return in the test", "Lightest pair we weighed", "Breathable mesh for hot days"],
      caveats: ["Stiff and firm at easy pace", "Lost 7% of its rebound by 300 miles"],
      facts: [
        { label: "Weight", value: "7.6 oz (215 g)" },
        { label: "Stack", value: "36 mm heel, 28 mm forefoot" },
        { label: "Drop", value: "8 mm" },
        { label: "Midsole", value: "PEBA blend" },
        { label: "Plate", value: "Nylon" },
      ],
      metrics: { weight: { value: "7.6 oz" }, stack: { value: "36 / 28 mm" }, drop: { value: "8 mm" }, energy: { value: "76%" }, wear: { value: "-7%" } },
      evidence: {
        kind: "scores",
        heading: "How it scored",
        items: [
          { label: "Cushioning", score: 7.9 },
          { label: "Responsiveness", score: 9.6 },
          { label: "Stability", score: 8.1 },
          { label: "Durability", score: 8.2 },
          { label: "Fit", score: 8.9 },
        ],
      },
      specimen: { kind: "shoe", heelStackMm: 36, forefootStackMm: 28, weightOz: 7.6, plate: "nylon", rocker: 0.75, upper: "mesh" },
      quote: { text: "Every interval session felt a few seconds a mile easier. I would not take it on a long, slow day.", person: { ...whitfield, role: "Running editor, ran 160 miles in it" } },
    },
    {
      product: cumulus,
      award: "Budget pick",
      bestFor: "recovery runs and high mileage on a budget",
      synthesis: "The tallest stack we measured, 42 mm at the heel, for $89, and the least rebound lost by 300 miles.",
      body: [
        "The Cumulus Max is a lot of shoe for the money. The tallest stack in our test makes it a forgiving choice for recovery days and long runs on tired legs.",
        "It is heavy at 10.6 oz and feels it at faster paces, but the foam barely changed over 300 miles, so it should outlast shoes that cost twice as much.",
      ],
      likes: ["Most cushioning in the test", "Foam barely changed after 300 miles", "Wide, stable base"],
      caveats: ["Heaviest pair we tested", "Feels sluggish at tempo pace"],
      facts: [
        { label: "Weight", value: "10.6 oz (300 g)" },
        { label: "Stack", value: "42 mm heel, 36 mm forefoot" },
        { label: "Drop", value: "6 mm" },
        { label: "Midsole", value: "EVA with a rubberised top layer" },
        { label: "Plate", value: "None" },
      ],
      metrics: { weight: { value: "10.6 oz" }, stack: { value: "42 / 36 mm" }, drop: { value: "6 mm" }, energy: { value: "64%" }, wear: { value: "-3%" } },
      evidence: {
        kind: "scores",
        heading: "How it scored",
        items: [
          { label: "Cushioning", score: 9.7 },
          { label: "Responsiveness", score: 7.4 },
          { label: "Stability", score: 9.1 },
          { label: "Durability", score: 9.6 },
          { label: "Fit", score: 8.4 },
        ],
      },
      specimen: { kind: "shoe", heelStackMm: 42, forefootStackMm: 36, weightOz: 10.6, plate: "none", rocker: 0.55, upper: "engineered" },
      quote: { text: "On the morning after a long run, this is the pair I wanted.", person: okafor("Tester, ran 140 miles in it") },
    },
  ],
  notRecommended: [
    {
      name: "Volt Stride 2",
      reason: "Lost 31% of its rebound by 300 miles, and the heel foam collapsed on one side.",
      metrics: { weight: { value: "9.1 oz" }, stack: { value: "35 / 27 mm" }, drop: { value: "8 mm" }, energy: { value: "58%" }, wear: { value: "-31%", status: "fail" } },
    },
  ],
  methodology: {
    heading: "How we tested 12 running shoes",
    summary: "We buy every pair at retail, run in it, then cut it apart. Brands cannot pay to be included, and we keep no free shoes.",
    steps: [
      { title: "Bought at retail", body: "Every pair came from the retailers we link to, in each tester’s usual size." },
      { title: "Run for 60 miles each", body: "Four testers rotated the shoes through easy runs, long runs and speed sessions, logging every mile." },
      { title: "Rebound measured twice", body: "We measure energy return in a drop test on a new pair and again after 300 miles on the road." },
      { title: "Cut in half", body: "A second pair of each shoe is sawn lengthwise so we can measure the true stack and drop with calipers, and the foam hardness with a durometer." },
      { title: "Prices checked weekly", body: "We re-check every retailer each week and always lead with the lowest in-stock price, whoever sells it." },
    ],
  },
});
