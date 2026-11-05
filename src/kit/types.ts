import type { AffiliateProductEntity, SubScoreItem } from "@/types/affiliate";

/**
 * Page-level contracts for the kit. A template renders a page from one of
 * these; agents generate pages by filling them, not by inventing markup.
 */

export interface Person {
  name: string;
  role?: string;
  avatar?: { src: string; alt: string };
  href?: string;
}

export interface Crumb {
  label: string;
  href: string;
}

export interface SiteChrome {
  publication: { name: string; href: string; tagline?: string };
  nav: { label: string; href: string; current?: boolean }[];
  footer: { heading: string; links: { label: string; href: string }[] }[];
  /** One sentence, plain words. */
  disclosure: string;
  disclosureHref: string;
  copyright: string;
}

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
  product: AffiliateProductEntity;
  /** The award, sentence case: "Our pick", "Budget pick". */
  award: string;
  /** Who it is for, completing "Best for …": "most people". */
  bestFor: string;
  /** The verdict in one sentence. */
  verdict: string;
  body: string[];
  likes: string[];
  caveats: string[];
  facts: { label: string; value: string }[];
  metrics: Record<string, MetricValue>;
  evidence?: Evidence;
  quote?: { text: string; person: Person };
}

export interface NotRecommended {
  name: string;
  reason: string;
  metrics: Record<string, MetricValue>;
}

export interface RoundupGuide {
  id: string;
  crumbs: Crumb[];
  title: string;
  dek: string;
  author: Person;
  /** Completes "Tested with …": "three other reviewers over 30 days". */
  testedWith: string;
  updatedAt: string;
  metrics: Metric[];
  picks: Pick[];
  notRecommended?: NotRecommended[];
  methodology: { body: string[]; facts: { value: string; label: string }[] };
}
