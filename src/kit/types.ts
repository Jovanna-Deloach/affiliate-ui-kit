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
  /**
   * A warning about the product (a recall, a regulator’s warning, a failed
   * safety test, fake reviews). While it is `active`, every part withholds
   * the product’s buy links, its score and its certification, and shows the
   * warning instead.
   */
  warning?: ProductWarning;
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
  /** The expert who checked the facts, shown beside the author in the byline. */
  reviewedBy?: ExpertReview;
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
  /** Every batch tested, newest first. */
  history?: CertificationRecord[];
}

/** One batch the lab tested, for a certification’s history. */
export interface CertificationRecord {
  /** The batch or lot number. */
  batch: string;
  /** When the lab tested it (ISO). */
  testedAt: string;
  /** Passed (and was certified until `until`), or failed. */
  passed: boolean;
  /** Certified until (ISO), for a batch that passed. */
  until?: string;
  /** Its grade for the results. */
  grade?: Grade;
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
  /** One line on what it covers: “Monohydrate, micronized, HCl and gummies”. */
  description?: string;
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

/* ---------------------------------------------------------------------- */
/* Safety and alerts                                                      */
/* ---------------------------------------------------------------------- */

/**
 * A warning the site raises about a product: `recall` the maker or a
 * regulator recalled it · `regulator` a regulator warned about it (an FDA
 * warning letter) · `failed-test` it failed the site’s own safety test ·
 * `fake-reviews` the brand bought, faked or hid reviews. Active warnings
 * replace the product’s score and buy links; resolved ones stay as history.
 */
export interface ProductWarning {
  kind: "recall" | "regulator" | "failed-test" | "fake-reviews";
  status: "active" | "resolved";
  /** What happened, in a line: “Recalled: milk in capsules labeled dairy-free”. */
  title: string;
  /** What happened, in two or three sentences. */
  summary: string;
  /** Which batches, lots or dates it covers: “Lots 0912 and 0913, sold August to October 2026”. */
  affected?: string;
  /** What a reader who has the product should do, in plain words. */
  action: string;
  /** When it was issued (ISO). */
  issuedAt: string;
  /** When it was resolved (ISO), for a resolved warning. */
  resolvedAt?: string;
  /** Who issued it, and where to read it: the regulator, the maker or the site’s lab. */
  source: { name: string; href: string };
}

/** One thing to know about a supplement’s safety. */
export interface SafetyNote {
  /** `avoid` who should not take it · `interaction` a medicine or supplement it interacts with · `side-effect` what some people feel. */
  kind: "avoid" | "interaction" | "side-effect";
  /** `serious` ask a doctor first · `moderate` take care · `mild` common and passing. */
  severity: "serious" | "moderate" | "mild";
  /** In a few words: “Kidney disease”, “Caffeine”, “Bloating”. */
  title: string;
  /** What to know, in a sentence or two. */
  detail: string;
}

/** A product’s lowest in-stock price on one day, across its retailers. */
export interface PricePoint {
  /** The day (ISO date). */
  date: string;
  /** The lowest in-stock price that day; `null` when it was sold out everywhere. */
  price: number | null;
  /** The retailer with that price. */
  merchant?: string;
}

/** What a reader asks to be told about a product’s price. */
export interface PriceAlertRequest {
  productId: string;
  /** `below` when the lowest price drops under `price` · `in-stock` when any retailer has it again. */
  kind: "below" | "in-stock";
  /** For `below`: the price to drop under. */
  price?: number;
  /** For a reader without an account: where to send the one email. */
  email?: string;
}

/** A reader’s price alert, as their account lists it. */
export interface PriceAlert {
  id: string;
  /** The product, as the reader’s lists keep it. */
  item: ReaderItem;
  kind: "below" | "in-stock";
  /** For `below`: the price to drop under. */
  price?: number;
  /** `active` watching · `paused` kept, not watching · `met` it happened and the email went out. */
  status: "active" | "paused" | "met";
  /** When it was set (ISO). */
  createdAt: string;
  /** For `met`: when, and the price and retailer that met it. */
  met?: { at: string; price: number; merchant: string };
}

/* ---------------------------------------------------------------------- */
/* Research and lab reports                                               */
/* ---------------------------------------------------------------------- */

/**
 * How well the research supports an outcome: `A` several mostly consistent
 * studies show at least a moderate effect · `B` fewer studies, or a smaller
 * effect · `C` a possible effect, with few studies or mixed results · `D`
 * too little research, results that disagree, or an effect too small to
 * matter · `F` the research points to harm. Shown with `GradeBadge` on its
 * evidence scale (`scale="evidence"`), where D is gray: little or no effect
 * is not harm.
 */
export type EvidenceGrade = "A" | "B" | "C" | "D" | "F";

/** Which way an outcome moved in the research: up, down, not at all, or both ways across studies. */
export type Effect = "increase" | "decrease" | "none" | "mixed";

/** How much an outcome moved, when it moved. */
export type EffectSize = "small" | "moderate" | "large";

/** One thing a supplement is studied for, and what the research says about it. */
export interface Outcome {
  id: string;
  /** What was measured, as readers say it: “Muscle strength”, “Lean mass”. */
  name: string;
  effect: Effect;
  /** How much it moved; leave out for `none`. */
  size?: EffectSize;
  /** How well the studies agree; leave out when there is one study. */
  consistency?: "high" | "moderate" | "low";
  /** How many studies (trials, and meta-analyses of them) the grade rests on. */
  studies: number;
  grade: EvidenceGrade;
  /** What it means for a reader, in a sentence: “About 8% more strength gained over 8 to 12 weeks of training.” */
  summary?: string;
  /** The outcome’s own page or section. */
  href?: string;
}

/** How a study was run, strongest first: a meta-analysis pools trials; a case report describes one person. */
export type StudyDesign = "meta-analysis" | "randomized-trial" | "observational" | "case-report";

/** A source, as a reference list cites it. */
export interface Reference {
  /** Unique on the page: `Citation` links to it and the list anchors it (`ref-{id}`). */
  id: string;
  /** Surname and initials, in the paper’s order: “Okafor AN”. The list shows three, then “et al.” */
  authors: string[];
  title: string;
  /** The journal, or the body that published a report. */
  source: string;
  year: number;
  /** Volume, issue and pages as the journal prints them: “21(4):112–120”. */
  details?: string;
  /** The DOI, without the resolver: “10.1186/s12970-017-0173-z”. */
  doi?: string;
  /** The PubMed id. */
  pmid?: string;
  /** A link for a source with neither: a report, a regulator’s page. */
  url?: string;
  /** When the site last opened it (ISO date), for pages that change. */
  accessedAt?: string;
}

/** One study, summed up for readers. */
export interface Study {
  id: string;
  /** What it tested, as a plain headline: “Creatine and strength in women over 60”. */
  title: string;
  design: StudyDesign;
  /** Who took part: “Trained women aged 60 to 75”. */
  population: string;
  /** How many people took part; for a meta-analysis, across its trials. */
  participants: number;
  /** How long it ran: “12 weeks”. Leave out for a meta-analysis. */
  duration?: string;
  /** What it found, in a sentence or two. */
  result: string;
  /** Which way it moved its outcome. */
  effect?: Effect;
  /** The outcome it adds to, by `Outcome.id`; the research feed filters on it. */
  outcome?: string;
  /** When it was published (ISO date). */
  publishedAt: string;
  /** Who paid for it, when a reader should know: “Funded by a creatine maker”. */
  funding?: string;
  /** Where it was published. */
  reference: Reference;
}

/** One ingredient: what the label claims and what the lab found, per serving. */
export interface AssayIngredient {
  /** As the label names it: “Folate (as methylfolate)”. */
  name: string;
  claimed: number;
  found: number;
  /** The unit both are in: “mg”, “mcg”, “IU”. */
  unit: string;
}

/** One contaminant the lab tested for, against its limit, per serving. */
export interface AssayContaminant {
  name: string;
  /** What the lab found; `null` when it was below the lowest amount the lab can measure (its LOQ). */
  found: number | null;
  /** The most a serving may contain, in the same unit. */
  limit: number;
  unit: string;
  /** Whose limit it is: “California Prop 65”, “USP”. */
  standard?: string;
}

/** An additive worth knowing about, and why it is flagged. It is legal; some readers avoid it. */
export interface WatchlistIngredient {
  /** As the label names it: “Red 40”, “Titanium dioxide”. */
  name: string;
  /** Why it is on the watchlist, in a sentence. */
  reason: string;
  /** More about it: the site’s page on the additive. */
  href?: string;
}

/** What the lab found in one batch of one product. */
export interface LabReport {
  /** The result in one sentence: “Contains what the label says, and nothing it shouldn’t.” */
  finding: string;
  /** How many tests the lab ran. */
  tests: number;
  /** The lot or batch number tested. */
  batch: string;
  /** When the batch was tested (ISO date). */
  testedAt: string;
  /** Who tested it: “Meridian Analytical, ISO 17025”. */
  lab: string;
  /** The serving every figure is for: “1 scoop (5 g)”. */
  serving: string;
  /** What a serving costs at today’s lowest price. */
  perServing?: { amount: number; currency: string };
  /** How far from the claim still counts as accurate, in percent either way (default 10). */
  tolerance?: number;
  ingredients: AssayIngredient[];
  contaminants: AssayContaminant[];
  /** Additives worth knowing about; empty when there are none. */
  watchlist: WatchlistIngredient[];
}

/** How to take a supplement, from the doses the research used. */
export interface Dosage {
  /** The everyday dose: “3 to 5 g a day”. */
  dose: string;
  /** When to take it. */
  timing: string;
  /** The form to buy, and why. */
  form: string;
  /** A loading phase, when the research used one: “20 g a day for 5 to 7 days, in four doses”. */
  loading?: string;
  /** Doses that scale with body weight, per kilogram a day, for the worked example: `{ label: "Loading phase", perKg: 0.3, unit: "g" }`. */
  byWeight?: { label: string; perKg: number; unit: "g" | "mg" }[];
}

/** The expert who checked a page’s facts, beside its author. */
export interface ExpertReview {
  /** The reviewer; their `beats` must cover the page’s category, as an author’s do. */
  person: Person;
  /** Their qualifications, as they sign them: “PhD, exercise physiology; registered dietitian”. */
  credentials: string;
  /** When they last checked the page (ISO date). */
  reviewedAt: string;
}

/** A question readers ask, and the answer. */
export interface FaqItem {
  question: string;
  /** The answer, a paragraph each. Plain text: it goes into the page’s FAQ structured data as is. */
  answer: string[];
}

/** How every product in a category tested: what the category report charts. */
export interface CategoryResults {
  /** The category, as readers say it, lowercase: “creatine”. */
  name: string;
  /** When the last product was tested (ISO date). */
  testedAt: string;
  /** Every product tested: its main ingredient as a share of its claim (101.2 = 101.2%) and whether it passed every contaminant limit. */
  products: { brand: string; name: string; href?: string; accuracy: number; purity: boolean }[];
  /** How far from the claim still counts as accurate, in percent either way (default 10). */
  tolerance?: number;
}

/** A reader’s suggestion of a product to test. */
export interface ProductSuggestion {
  /** The product, with its brand, as the reader typed it. */
  product: string;
  /** Where they buy it: a link to the product. */
  url?: string;
  /** Where to tell them when it is tested. */
  email?: string;
}

/* ---------------------------------------------------------------------- */
/* Supplement pages                                                       */
/* ---------------------------------------------------------------------- */

/** A paragraph of a research page and the sources it rests on: the template sets a `Citation` after it for each. */
export interface CitedParagraph {
  text: string;
  /** The `Reference.id`s it cites, in order; each must be in the page’s `references`. */
  cites?: string[];
}

/**
 * Everything a product’s own page shows: the review, the lab report, the
 * evidence for what’s in it, its price over time, and readers’ reviews.
 * Rendered by `ProductPage`.
 */
export interface ProductReport {
  id: string;
  category: Category;
  crumbs: Crumb[];
  /** The page’s own address, for the reader’s history and saved items. */
  href: string;
  /** The page’s title: the product and what the page is, “Peak Supply Creatine Monohydrate: lab report and reviews”. */
  title: string;
  /** The verdict in a sentence or two. */
  dek: string;
  author: Person;
  reviewedBy?: ExpertReview;
  /** Completes “Tested with …”. */
  testedWith?: string;
  updatedAt: string;
  /** The header’s testing card: what the lab ran, and against what. */
  telemetry?: { stats: TestingStat[]; reference: string };
  /** The review: photograph, award, score and sub-scores, measurements, narrative, what we like and what to know, a tester’s words, specifications, and the product with its offers and any warning. */
  pick: Pick;
  /** The grade for its test results. */
  grade: Grade;
  /** The certification and every batch tested. */
  certification: Certification;
  lab: LabReport;
  /** The research on its main ingredient: a few outcomes and the ingredient’s page. */
  evidence?: { ingredient: string; href: string; outcomes: Outcome[] };
  /** Its lowest price over the last 90 days. */
  priceHistory?: PricePoint[];
  /** Readers’ reviews of it: the list, its topics, the AI summary, and how the brand handles reviews. */
  reviews?: { items: Review[]; topics?: ReviewTopic[]; aiSummary?: AiSummary; trust?: TrustSignals };
  /** Products readers of this page also looked at. */
  alsoLookedAt?: ProductSummary[];
  faq?: FaqItem[];
  /** How the site tests, the testing card’s “Read the full method” target. */
  methodology?: RoundupGuide["methodology"];
}

/** A brand’s page: who it is, how it handles reviews, what the site tested, and what readers say. Rendered by `BrandPage`. */
export interface BrandProfile {
  id: string;
  category: Category;
  crumbs: Crumb[];
  brand: Brand;
  /** What the brand makes, and how its products tested, in a sentence or two. */
  dek: string;
  /** How the brand asks for, answers and handles reviews. */
  trust: TrustSignals;
  /** A warning about the brand itself (fake reviews, a regulator’s letter), shown first. */
  warning?: ProductWarning;
  /** Its products the site tested, every one photographed. */
  products: ProductSummary[];
  /** Readers’ reviews of its products. */
  reviews?: { items: Review[]; topics?: ReviewTopic[]; aiSummary?: AiSummary };
  /** Brands readers of this page also looked at. */
  similar?: Brand[];
}

/**
 * A category’s page: every product the site recommends in it, ranked, how
 * the whole category tested, and the questions readers ask, with sources.
 * Rendered by `CategoryPage`.
 */
export interface CategoryGuide {
  id: string;
  category: Category;
  crumbs: Crumb[];
  title: string;
  dek: string;
  author: Person;
  reviewedBy?: ExpertReview;
  testedWith?: string;
  updatedAt: string;
  telemetry?: { stats: TestingStat[]; reference: string };
  /** The ranking: its heading, the line under it (default: how many tested and certified), and the products, every one photographed. */
  ranking: { heading: string; summary?: string; products: ProductSummary[] };
  /** How every product in the category tested, the ones not in the ranking included. */
  results: CategoryResults;
  /** The questions readers ask about the category. */
  faq: FaqItem[];
  /** The sources behind the answers. */
  references?: Reference[];
  /** What the category is, singular and lowercase, for “Don’t see your creatine?”. */
  noun: string;
  /** How the site tests, the testing card’s “Read the full method” target. */
  methodology?: RoundupGuide["methodology"];
}

/**
 * A supplement’s or ingredient’s page: what it is, what the research says
 * outcome by outcome, how to take it, who should not, the studies, the
 * products the site tested that contain it, and every source. Rendered by
 * `IngredientPage`.
 */
export interface IngredientGuide {
  id: string;
  category: Category;
  crumbs: Crumb[];
  /** The supplement, as readers say it: “Creatine”. */
  name: string;
  title: string;
  dek: string;
  author: Person;
  reviewedBy?: ExpertReview;
  updatedAt: string;
  /** Its other names, and what it should not be confused with. */
  names: string[];
  notConfusedWith?: { name: string; note?: string; href?: string }[];
  /** What it is and what it does, a paragraph each, with their sources. */
  overview: CitedParagraph[];
  outcomes: Outcome[];
  dosage: Dosage;
  safety: { summary?: string; notes: SafetyNote[] };
  studies: Study[];
  /** The products the site tested that contain it, every one photographed. */
  products: ProductSummary[];
  faq: FaqItem[];
  /** Every source the page cites, in the order the overview first cites them. */
  references: Reference[];
}
