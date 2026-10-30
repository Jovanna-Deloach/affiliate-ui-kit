import type { AffiliateProductEntity, ProductImage } from "./affiliate";

/**
 * SITE-CHROME DATA CONTRACTS
 * -----------------------------------------------------------------------
 * The navigation ecosystem (mega-menu, ribbon, mobile drill-down, footer)
 * consumes these slices. Internal links are plain hrefs — only merchant
 * links are monetized, and those always arrive as a product's offers so the
 * CTA can route through <AffiliateAction />.
 */

export interface NavLink {
  label: string;
  href: string;
}

/** One silo inside a vertical ("Daily Trainers · 24 tested"). */
export interface NavCategory extends NavLink {
  id: string;
  /** Products tested in this silo — rendered as the mono count on the keyline. */
  count: number;
}

/** A roundup buying guide surfaced in the menu. */
export interface NavGuide {
  id: string;
  title: string;
  href: string;
  image: ProductImage;
  /** ISO date of the last editorial update. */
  updatedAt: string;
  tested?: number;
  winners?: number;
}

export type NavSpotlight =
  | {
      kind: "winner";
      eyebrow: string;
      product: AffiliateProductEntity;
      /** One-line verdict under the title. */
      verdict: string;
      /** The review page (internal). */
      href: string;
    }
  | {
      kind: "tool";
      eyebrow: string;
      title: string;
      description: string;
      href: string;
      ctaLabel: string;
    };

/** A category's #1–#3 as listed in the mobile drill-down. */
export interface NavWinner {
  product: AffiliateProductEntity;
  accolade: string;
  /** The review page (internal). */
  href: string;
}

export interface NavVertical {
  id: string;
  label: string;
  href: string;
  description?: string;
  categories: NavCategory[];
  guides: NavGuide[];
  spotlight: NavSpotlight;
  winners: NavWinner[];
}

/** One item of the sticky sub-category ribbon. */
export interface RibbonItem extends NavLink {
  id: string;
  count?: number;
}

export interface TrustStat {
  value: string;
  label: string;
}

export interface DirectoryColumn {
  heading: string;
  links: NavLink[];
}

export interface ComplianceCopy {
  /** FTC affiliate disclosure, one paragraph. */
  disclosure: string;
  /** Editorial / clinical independence charter, short declarative lines. */
  charter: string[];
  copyright: string;
  legalLinks: NavLink[];
}
