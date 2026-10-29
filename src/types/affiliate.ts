/**
 * CANONICAL DATA CONTRACTS
 * -----------------------------------------------------------------------
 * Every commerce primitive consumes *slices* of these interfaces. Primitives
 * never widen them with private fields — if a primitive needs more data, the
 * contract is extended here first so every vertical benefits.
 */

export interface MerchantOffer {
  id: string;
  merchantName: string;
  merchantLogoUrl?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  affiliateUrl: string;
  inStock: boolean;
  promoCode?: string;
  promoDescription?: string;
  isPrimaryPartner?: boolean;
  isBestPrice?: boolean;
}

export interface ProductSpecItem {
  label: string;
  value: string | number;
  unit?: string;
  tooltip?: string;
  isHighlight?: boolean;
}

export interface SubScoreItem {
  label: string;
  score: number; // e.g. 9.4
  maxScore?: number; // default 10
  weight?: number;
}

export type AwardTier = "winner" | "runner-up" | "callout";

export interface AwardBadgeData {
  label: string;
  tier: AwardTier;
}

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface AffiliateProductEntity {
  id: string;
  slug: string;
  name: string;
  brand: string;
  eyebrow?: string;
  rank?: number;
  awardBadge?: AwardBadgeData;
  overallScore?: number;
  subScores?: SubScoreItem[];
  verdictSummary: string;
  pros: string[];
  cons: string[];
  specs: ProductSpecItem[];
  media: {
    primaryImage: ProductImage;
    secondaryImage?: ProductImage;
    cutoutBlend?: boolean;
  };
  offers: MerchantOffer[];
  lastVerifiedAt?: string;
}

/* ---------------------------------------------------------------------- */
/* Attribution                                                            */
/* ---------------------------------------------------------------------- */

/**
 * Tracking context injected into every monetized outbound link.
 * `subId` maps to the network's sub-tracking param (SubId / sid / u1 / clickref).
 */
export interface AffiliateAttribution {
  /** Campaign source, e.g. "kit-editorial" */
  source?: string;
  /** Campaign medium, e.g. "affiliate" */
  medium?: string;
  /** Campaign name, usually the article slug */
  campaign?: string;
  /** Placement/content slot, e.g. "scorecard-cta" */
  content?: string;
  /** Network sub-tracking id (product id, position, variant…) */
  subId?: string;
  /** Query parameter name the network expects for subId (default "subId") */
  subIdParam?: string;
}

export interface AffiliateClickEvent {
  href: string;
  merchant?: string;
  productId?: string;
  offerId?: string;
  placement?: string;
  /** "primary" | "auxiliary" (middle-click / ctrl-click opens) */
  trigger: "primary" | "auxiliary";
  timestamp: number;
}
