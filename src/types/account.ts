import type { AffiliateProductEntity, ProductImage } from "./affiliate";
import type { NavLink } from "./navigation";

/**
 * FIRST-PARTY ACCOUNT CONTRACTS
 * -----------------------------------------------------------------------
 * Member identity, saved items, price watches and personalization presets.
 * Saved products carry the price at save time so a surface can show the
 * delta without a second lookup; alerts carry the merchant they watch.
 */

export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: ProductImage;
  verified: boolean;
  /** ISO date. */
  memberSince?: string;
}

export interface AccountMenuItem extends NavLink {
  id: string;
  count?: number;
}

export interface GuideEntity {
  id: string;
  slug: string;
  title: string;
  /** One-line standfirst under the title. */
  dek?: string;
  href: string;
  /** Winners shown as the miniature stack (first = #1). */
  products: AffiliateProductEntity[];
  tested: number;
  winners: number;
  updatedAt: string;
  leadTester: { name: string; role: string; avatar?: { src: string; alt: string }; href?: string };
  vertical?: string;
}

export interface SavedProduct {
  product: AffiliateProductEntity;
  savedAt: string;
  /** Lowest in-stock price at save time. */
  savedPrice: number;
  currency?: string;
}

export interface SavedGuide {
  guide: GuideEntity;
  savedAt: string;
}

export type PriceAlertKind = "price-drop" | "restock";

export interface PriceAlert {
  id: string;
  kind: PriceAlertKind;
  product: AffiliateProductEntity;
  /** Merchant being watched (its offer supplies the current price). */
  merchantName: string;
  targetPrice?: number;
  currentPrice: number;
  inStock: boolean;
  active: boolean;
  createdAt: string;
}

export interface PersonalizationProfile {
  id: string;
  /** "Keto", "Runner" — the profile's name. */
  name: string;
  /** Ordered parameters, rendered as technical chips. */
  parameters: string[];
  /** Products in the current directory matching the profile. */
  matchCount?: number;
}
