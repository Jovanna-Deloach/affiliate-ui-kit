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
   * The audit fails a page whose author or tester lacks the page’s category.
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
/* Products                                                               */
/* ---------------------------------------------------------------------- */

export interface KitProduct {
  id: string;
  slug: string;
  brand: string;
  name: string;
  offers: MerchantOffer[];
  /** When prices were last checked (ISO). */
  lastVerifiedAt?: string;
  /**
   * Studio photography: a background-free cut-out (transparent WebP or PNG),
   * set on the theme’s studio well with a soft contact shadow. Required: a
   * product is never stood in for by a drawing or a chart.
   */
  image: ProductImage;
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
 * What the lab or bench measured, set as telemetry rows in the review’s
 * scorecard (and, for supplements, the assay badge on the photograph).
 * Photography shows the object; these show the numbers.
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
  /** The header’s testing summary card. */
  telemetry: { stats: TestingStat[]; reference: string };
  metrics: Metric[];
  picks: Pick[];
  /** Jump-link label from the verdict to each deep dive: "Read the full review". */
  jumpLabel: string;
  /** Heading for the collector’s catalog of every piece. */
  railHeading?: string;
  /** The comparison section: a heading that says something, and an optional intro. */
  compare: { heading: string; intro?: string };
  notRecommended?: NotRecommended[];
  methodology: { heading: string; summary: string; steps: MethodStep[] };
}

/* ---------------------------------------------------------------------- */
/* Reviews                                                                */
/* ---------------------------------------------------------------------- */

/**
 * How a review reached the site, shown on it so readers can weigh it:
 * `verified` matched to a purchase · `invited` asked for by the brand or the
 * site · `unprompted` written on the reader’s own · `incentivized` written
 * after a free product or payment · `tester` written by one of the site’s
 * testers. A review can carry more than one (`verified` and `invited`).
 */
export type ReviewLabel = "verified" | "invited" | "unprompted" | "incentivized" | "tester";

/** Who wrote a review: a reader, or one of the site’s testers. */
export interface Reviewer {
  name: string;
  /** Where they live, as a two-letter country code (“US”). */
  country?: string;
  /** How many reviews they have written on the site. */
  reviewCount?: number;
  /** For a tester: their role (“Lab director”). */
  role?: string;
  avatar?: { src: string; alt: string };
}

/** The brand’s public answer to a review. */
export interface ReviewReply {
  /** Who answered: the brand’s name. */
  author: string;
  body: string;
  /** When it was posted (ISO). */
  postedAt: string;
}

export interface Review {
  id: string;
  /** Whole stars, 1 to 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  author: Reviewer;
  /** When it was posted (ISO). */
  postedAt: string;
  /** When the reviewer used the product (ISO date), if they said. */
  experiencedAt?: string;
  labels: ReviewLabel[];
  /** Changed by its author after it was posted. */
  edited?: boolean;
  /** How many readers marked it useful. */
  useful?: number;
  reply?: ReviewReply;
  /** The ids of the `ReviewTopic`s it mentions. */
  topics?: string[];
  /** Its language, as a code (“en”). */
  language?: string;
}

/** A product’s (or a brand’s) reviews in numbers. */
export interface RatingSummary {
  /** The average, 1 to 5, one decimal. */
  average: number;
  /** All reviews. */
  count: number;
  /** Reviews posted in the last 12 months. */
  recentCount?: number;
  /** How many reviews gave each rating, from 1 star to 5 stars. */
  distribution: [number, number, number, number, number];
}

/** Something reviewers mention, counted across the reviews. */
export interface ReviewTopic {
  id: string;
  /** A word or two, sentence case (“Mixes well”). */
  label: string;
  /** How many reviews mention it. */
  mentions: number;
}

/** A generated summary of the reviews, always shown as one. */
export interface AiSummary {
  /** A short paragraph: what most reviewers say, and where they disagree. */
  body: string;
  /** How many reviews it read. */
  basedOn: number;
  /** The oldest review it read (ISO). */
  since: string;
  /** The ids of two or three reviews it draws on, shown under it. */
  sources: string[];
}

/** How a brand handles its reviews, as the site has observed it. */
export interface TrustSignals {
  /** Whether the brand asks its customers for reviews (`rarely`: not in the last 12 months). */
  asksForReviews: "always" | "sometimes" | "rarely";
  /** The share of negative reviews (1 or 2 stars) it has replied to, 0 to 1. */
  replyRate?: number;
  /** How long it usually takes to reply (“48 hours”). */
  replyTime?: string;
  /** Since when the brand has managed its page (ISO). */
  claimedSince?: string;
}

/** What a reader has asked the review list for. */
export interface ReviewQuery {
  /** Ratings to show; empty shows all. */
  stars: number[];
  verifiedOnly: boolean;
  withReplies: boolean;
  /** Posted within: `all`, the last 30 days, 3, 6 or 12 months. */
  posted: "all" | "30d" | "3m" | "6m" | "12m";
  /** A topic id; reviews that mention it. */
  topic?: string;
  /** Words to find in the title or body. */
  search: string;
  sort: "recent" | "relevant" | "highest" | "lowest";
}

/* ---------------------------------------------------------------------- */
/* Discovery                                                              */
/* ---------------------------------------------------------------------- */

/**
 * A letter grade, for test results or for the strength of evidence, from A+
 * (best) to F. Written with a hyphen for minus (`B-`); shown with a true
 * minus sign.
 */
export type Grade = "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "C-" | "D+" | "D" | "D-" | "F";

/**
 * Where a product stands in the site’s testing program: `certified` passed
 * its latest test · `expired` its certification lapsed and it has not been
 * retested · `upcoming` bought and in the lab · `untested` not tested yet.
 */
export interface Certification {
  status: "certified" | "expired" | "upcoming" | "untested";
  /** The date that goes with the status (ISO): certified until, expired on, results due by. */
  date?: string;
}

/** A brand, as its card and its page show it. */
export interface Brand {
  slug: string;
  name: string;
  /** Its page on the site. */
  href: string;
  /** Its own website, shown as a bare domain, not a link: `peaksupply.example`. */
  website?: string;
  /** Its logo, square, on white. Without one the card shows its initials. */
  logo?: { src: string; alt: string };
  /** Readers’ reviews of the brand, in numbers. */
  rating?: { average: number; count: number };
  /** How many of its products the site has tested. */
  tested?: number;
}

/** A kind of product the site covers, and how much of it the site has tested: Creatine, 18 reports. */
export interface ProductCategory {
  slug: string;
  /** Sentence case: “Creatine”, “Fish oil”. */
  name: string;
  href: string;
  /** How many reports or reviews it holds. */
  count: number;
  /** What `count` counts, plural (default “reports”). */
  noun?: string;
  /** A product in it, usually its best-rated one: the card shows its photograph. */
  product?: KitProduct;
}

/**
 * A product as a card, a ranking row or a reader’s list shows it: the
 * product with all its offers, where its review is, and how it tested.
 */
export interface ProductSummary {
  product: KitProduct;
  /** Its review or lab report on the site. */
  href: string;
  /** The grade for its test results. */
  grade?: Grade;
  /** The site’s score, out of 10, one decimal. */
  score?: number;
  certification?: Certification;
  /** Readers’ reviews, in numbers. */
  rating?: { average: number; count: number };
  /** What a serving costs at the lowest price, and what a serving is: `{ amount: 0.21, serving: "5 g" }`. */
  perServing?: { amount: number; serving: string };
  /** One line on how it tested, for a ranking row: “Contained 62% of the creatine on the label.” */
  note?: string;
}

/** What a site search can find. */
export type SearchKind = "product" | "brand" | "ingredient" | "guide" | "category";

/** One thing a site search found. */
export interface SearchHit {
  id: string;
  kind: SearchKind;
  title: string;
  href: string;
  /** A line of context, ideally holding the words searched for; the result marks them. */
  snippet?: string;
  /** A product’s cut-out or a brand’s logo. */
  image?: { src: string; alt: string };
  /** One short fact: “Grade A+”, “18 reports”, “Updated Oct 29, 2026”. */
  meta?: string;
}

/* ---------------------------------------------------------------------- */
/* Returning readers                                                      */
/* ---------------------------------------------------------------------- */

/**
 * A product or guide in a reader’s history, saved items or compare tray:
 * enough to show it again, small enough to keep on their device. A price is
 * what it cost when they looked: a reminder, not an offer.
 */
export interface ReaderItem {
  kind: "product" | "guide";
  /** The product’s or guide’s id. */
  id: string;
  /** Products: the name without the brand (“Creatine Monohydrate”). Guides: the headline. */
  title: string;
  href: string;
  /** Products: the brand, shown above the name. */
  brand?: string;
  /** Products: the photograph. */
  image?: ProductImage;
  /** Products: the lowest price when they looked. */
  price?: { amount: number; currency?: string };
  /** Products: the grade for its test results. */
  grade?: Grade;
  /** Guides: how far they read, from 0 to 1. */
  progress?: number;
  /** Guides: the section they reached, linked. */
  section?: { title: string; href: string };
  /** When they last looked, or saved it (ISO). */
  at: string;
  /** Saved items: their own note. */
  note?: string;
}
