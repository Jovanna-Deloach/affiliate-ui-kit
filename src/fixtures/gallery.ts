import type { Author } from "@/primitives/authority-byline";
import type { ProductImage } from "@/types/affiliate";

import { authorEditorial } from "./authors";

/**
 * Hands-on gallery and wear-comparison fixtures for the Meridian Aerolite 3.
 * All frames are the same two Unsplash photographs (public/fixtures/
 * ATTRIBUTION.md): two true angles plus two loupe crops; the "after" frame of
 * the comparison is a tonal derivative of the medial angle so both halves
 * share one framing.
 */

export interface LoupeFrame {
  id: string;
  image: ProductImage;
  /** Short angle label: "Three-quarter", "Medial side", "Midsole & outsole". */
  angle: string;
  /** The tester's inspection note for this angle. */
  note: string;
}

const AEROLITE_01: ProductImage = {
  src: "/fixtures/shoe-aerolite-01.jpg",
  alt: "Meridian Aerolite 3 running shoe, floating three-quarter view on grey studio backdrop",
  width: 1600,
  height: 1280,
  backdrop: "#c9cac4",
};
const AEROLITE_02: ProductImage = {
  src: "/fixtures/shoe-aerolite-02.jpg",
  alt: "Meridian Aerolite 3 running shoe, medial side view on grey studio backdrop",
  width: 1600,
  height: 1280,
  backdrop: "#c9cac4",
};

export const aeroliteLoupeFrames: LoupeFrame[] = [
  {
    id: "three-quarter",
    image: AEROLITE_01,
    angle: "Three-quarter",
    note: "Heel counter sits 4 mm taller than the Aerolite 2; the collar foam is noticeably firmer out of the box.",
  },
  {
    id: "medial",
    image: AEROLITE_02,
    angle: "Medial side",
    note: "Medial post is moulded, not glued — no visible seam after 300 miles, which is where the 2 started to peel.",
  },
  {
    id: "midsole",
    image: {
      src: "/fixtures/shoe-aerolite-03-midsole.jpg",
      alt: "Loupe view of the Meridian Aerolite 3 midsole and outsole",
      width: 640,
      height: 800,
      backdrop: "#c9cac4",
    },
    angle: "Midsole & outsole",
    note: "Carbon-rubber heel plug measured 1.2 mm of wear at 300 miles; the blown forefoot shows none.",
  },
  {
    id: "upper",
    image: {
      src: "/fixtures/shoe-aerolite-04-upper.jpg",
      alt: "Loupe view of the Meridian Aerolite 3 perforated upper and lacing",
      width: 640,
      height: 800,
      backdrop: "#c9cac4",
    },
    angle: "Upper & lacing",
    note: "Perforations run the full length of the toe box; laces loosened on two of four testers past 10 miles.",
  },
];

export interface WearComparison {
  before: ProductImage;
  after: ProductImage;
  beforeLabel: string;
  afterLabel: string;
  caption: string;
}

export const aeroliteWearComparison: WearComparison = {
  before: AEROLITE_02,
  after: {
    src: "/fixtures/shoe-aerolite-02-worn.jpg",
    alt: "Meridian Aerolite 3 after 400 logged miles, medial side view",
    width: 1600,
    height: 1280,
    backdrop: "#b9b8b2",
  },
  beforeLabel: "Out of box",
  afterLabel: "After 400 mi",
  caption: "Same pair, same framing. Upper and midsole after 400 logged miles across four testers.",
};

export interface TesterQuote {
  id: string;
  quote: string;
  tester: Author;
  /** Testing metric shown as a technical chip: "Logged 140 miles". */
  metric: string;
}

export const testerQuotes: TesterQuote[] = [
  {
    id: "marchetti-aerolite",
    quote:
      "By mile 60 the midsole stopped feeling like a demo and started feeling like a shoe I'd choose for a long Sunday — the energy return is real, and it does not come with the wobble a 38 mm stack usually brings.",
    tester: authorEditorial,
    metric: "Logged 140 miles",
  },
  {
    id: "whitfield-aerolite",
    quote: "Laces loosened twice on anything over ten miles. A runner's knot fixed it, but a $189 shoe should not need one.",
    tester: { name: "Jonah Whitfield", role: "Contributing tester" },
    metric: "Logged 112 miles",
  },
];
