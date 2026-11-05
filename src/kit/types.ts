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

/** Supplements: the container in elevation beside its HPLC purity trace. */
export interface SupplementSpecimen {
  kind: "supplement";
  formFactor: "wide-tub" | "micronised-pouch" | "capsule-bottle" | "gummy-jar";
  /** Net weight in grams. */
  netWeight: number;
  /** Measured active as a share of the label claim, mean of the lab runs (100.4 = 100.4%). */
  assayScore: number;
  /** Minor peaks as a share of the main peak (creatinine, DCD…), in elution order. */
  impurities: number[];
}

/** Running shoes: lateral elevation with the stack measured at heel and forefoot. */
export interface ShoeSpecimen {
  kind: "shoe";
  heelStackMm: number;
  forefootStackMm: number;
  /** Weight of one shoe, US men's 10. */
  weightOz: number;
  plate: "carbon" | "nylon" | "none";
  /** Toe spring, 0 (flat) to 1 (aggressive rocker). */
  rocker: number;
  upper: "knit" | "mesh" | "engineered";
}

export type Specimen = WatchSpecimen | SupplementSpecimen | ShoeSpecimen;

/* ---------------------------------------------------------------------- */
/* Evidence                                                               */
/* ---------------------------------------------------------------------- */

/** A comparison column: what every pick is measured on. */
export interface Metric {
  key: string;
  label: string;
  /** Short explanation shown under the table. */
  note?: string;
}

export interface MetricValue {
  value: string;
  status?: "pass" | "fail" | "caution";
}

export interface LabResult {
  label: string;
  value: string;
  limit: string;
  status: "pass" | "fail" | "caution";
}

export type Evidence =
  | { kind: "scores"; heading: string; items: SubScoreItem[] }
  | { kind: "results"; heading: string; items: LabResult[] };

export interface Pick {
  product: KitProduct;
  /** The award, sentence case: "Our pick", "Budget pick". Never numbered. */
  award: string;
  /**
   * The quick-verdict line: who it is for, completing "Best for …".
   * Shown once, in the bento or the also-great rail.
   */
  bestFor: string;
  /**
   * The deep-dive subhead: the measured result in one sentence
   * ("+1.6 s/day over 30 days of wrist and nightstand timing").
   * Never a restatement of `bestFor`.
   */
  synthesis: string;
  body: string[];
  likes: string[];
  caveats: string[];
  /** Specifications, label and value. */
  facts: { label: string; value: string }[];
  metrics: Record<string, MetricValue>;
  evidence: Evidence;
  specimen?: Specimen;
  quote: { text: string; person: Person };
}

export interface NotRecommended {
  name: string;
  reason: string;
  metrics: Record<string, MetricValue>;
}

export interface Telemetry {
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
  telemetry: { stats: Telemetry[]; reference: string };
  metrics: Metric[];
  picks: Pick[];
  /** How many picks the quick-verdict bento holds (2 or 3); the rest go to the also-great rail. */
  bentoCount?: 2 | 3;
  /** Jump-link label from the verdict to each deep dive: "Read the full review". */
  jumpLabel: string;
  railHeading?: string;
  /** The comparison section: a heading that says something, and an optional intro. */
  compare: { heading: string; intro?: string };
  notRecommended?: NotRecommended[];
  methodology: { heading: string; summary: string; steps: MethodStep[] };
}
