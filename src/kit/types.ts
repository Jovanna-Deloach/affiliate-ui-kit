import type { MerchantOffer, ProductImage, SubScoreItem } from "@/types/affiliate";

/**
 * Page-level contracts for the kit. A template renders a page from one of
 * these; agents generate pages by filling them, not by inventing markup.
 * Copy is plain text: the kit typesets it (src/kit/lib/typeset.ts).
 */

/** A section of the publication. Drives the nav marker and --accent-category. */
export type Category = "watches" | "supplements" | "running";

export interface Person {
  name: string;
  role?: string;
  avatar?: { src: string; alt: string };
  href?: string;
  /**
   * The categories this person is qualified to byline or be quoted in.
   * The audit fails a page whose author or tester lacks the page's category.
   */
  beats: Category[];
}

export interface Crumb {
  label: string;
  href: string;
}

export interface SiteChrome {
  publication: { name: string; href: string; tagline?: string };
  nav: { label: string; href: string; category?: Category }[];
  footer: { heading: string; links: { label: string; href: string }[] }[];
  /** Footer statement: who pays for what, in plain words. */
  disclosure: string;
  /** Article-header notice, shown in the byline before any buy link on the page. Different words from `disclosure`. */
  disclosureNotice: string;
  disclosureHref: string;
  copyright: string;
}

/* ---------------------------------------------------------------------- */
/* Products and specimens                                                 */
/* ---------------------------------------------------------------------- */

export interface KitProduct {
  id: string;
  slug: string;
  brand: string;
  name: string;
  offers: MerchantOffer[];
  /** When prices were last checked (ISO). */
  lastVerifiedAt?: string;
  /** Photography, when the site has it. Without it the pick's specimen is drawn. */
  image?: ProductImage;
}

/** Watches: drawn front and profile, at one constant millimetre scale. */
export interface WatchSpecimen {
  kind: "watch";
  caseDiameterMm: number;
  lugToLugMm: number;
  thicknessMm: number;
  lugWidthMm: number;
  complicationType: "gmt" | "dress-subdial" | "diver-bezel" | "field-arabic";
  strapType: "bracelet" | "leather" | "nato";
  dialTone: "light" | "dark";
  date?: boolean;
}

/* ---------------------------------------------------------------------- */
/* Evidence                                                               */
/* ---------------------------------------------------------------------- */

/** A comparison column: what every pick is measured on. */
export interface Metric {
  key: string;
  label: string;
  /** Short explanation shown under the table. */
  note?: string;
  /** Shown as a pill on the condensed phone row (the first three are used when none is marked). */
  compact?: boolean;
}

export interface MetricValue {
  value: string;
  status?: "pass" | "fail" | "caution";
}

/** The composite score: the focal point of a review. */
export interface Rating {
  /** Out of 10, one decimal. */
  score: number;
  /** “Exceptional”, “Lab verified”. */
  tier: string;
  /** Where it stands, in plain words: “1st of 14 tested”, “100.4% of claim”. */
  standing: string;
}

/**
 * What the lab or bench measured, drawn as a data graphic. Never an
 * illustration of the product: photography shows the object, these show
 * the numbers.
 */
export type Measurements =
  | {
      /** Watches: rate in six positions against chronometer tolerance. */
      kind: "timing";
      positions: { label: string; rate: number }[];
      /** Tolerance band in s/day, e.g. [-4, 6]. */
      tolerance: [number, number];
      reference: string;
    }
  | {
      /** Supplements: the certificate of analysis. */
      kind: "assay";
      batch: string;
      assayedAt: string;
      /** Each HPLC run as a share of the label claim (100.2 = 100.2%). */
      runs: number[];
      /** Minor peaks as a share of the main peak, in elution order. */
      impurities: number[];
      claim: { label: string; measured: number; low: number; high: number; unit: string };
      metals: { label: string; ppb: number; limitPpb: number }[];
      checks: { label: string; value: string; limit: string; status: "pass" | "caution" | "fail" }[];
    }
  | {
      /** Running shoes: cushioning geometry and energy return against the test average. */
      kind: "biomech";
      heelMm: number;
      forefootMm: number;
      energyReturn: number;
      energyAverage: number;
      /** Rebound lost after 300 miles, percent (smaller is better). */
      reboundLoss: number;
      reboundAverage: number;
      weightOz: number;
      weightAverage: number;
    };

export interface Pick {
  product: KitProduct;
  /** The award, sentence case: “Our pick”, “Budget pick”. Never numbered. */
  award: string;
  /** What it is, for the card header: “Automatic GMT, 40 mm steel”. */
  descriptor: string;
  /** Who it is for, completing “Best for …”. Shown in compact verdict cards and rails. */
  bestFor: string;
  /** The hero verdict (two lines) when this pick leads the page. Never a measurement. */
  verdict: string;
  /**
   * The deep-dive subhead: the measured result in one sentence
   * (“+1.6 s/day over 30 days of wrist and nightstand timing”).
   */
  synthesis: string;
  rating: Rating;
  /** Sub-scores under the composite (five is the norm). */
  scores: SubScoreItem[];
  measurements: Measurements;
  body: string[];
  likes: string[];
  caveats: string[];
  /** Specifications, label and value. */
  facts: { label: string; value: string }[];
  metrics: Record<string, MetricValue>;
  /** Watches: a drafting plate drawn from the case geometry. */
  specimen?: WatchSpecimen;
  /** A tester’s words, and the proof they earned the right to say them (“160 miles logged”). */
  quote: { text: string; person: Person; proof: string };
}

export interface NotRecommended {
  name: string;
  reason: string;
  metrics: Record<string, MetricValue>;
}

export interface TestingStat {
  /** "14" — a figure, set large. */
  value: string;
  /** "watches bought at retail" — completes the figure. */
  label: string;
}

export interface MethodStep {
  title: string;
  body: string;
}

export interface RoundupGuide {
  id: string;
  category: Category;
  crumbs: Crumb[];
  title: string;
  dek: string;
  author: Person;
  /** Completes "Tested with …": "two other reviewers". */
  testedWith: string;
  updatedAt: string;
  /** The header's testing summary card. */
  telemetry: { stats: TestingStat[]; reference: string };
  metrics: Metric[];
  picks: Pick[];
  /** Jump-link label from the verdict to each deep dive: "Read the full review". */
  jumpLabel: string;
  /** Heading for picks 4+ in the verdict bento, and for the collector’s catalogue. */
  railHeading?: string;
  /** The comparison section: a heading that says something, and an optional intro. */
  compare: { heading: string; intro?: string };
  notRecommended?: NotRecommended[];
  methodology: { heading: string; summary: string; steps: MethodStep[] };
}
