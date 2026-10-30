import type { AccountMenuItem, Member, PersonalizationProfile, PriceAlert, SavedGuide, SavedProduct } from "@/types/account";

import { guideCarbonPlated, guideCreatine, guideDailyTrainers, guideDiveWatches } from "./guides";
import { directoryProducts, productCreatine, productShoe01, productShoe02, productShoe03, productWatch } from "./products";

/** A signed-in member with a verified address. */
export const member: Member = {
  id: "member-jd",
  name: "Jovanna Deloach",
  email: "jovanna@marketkarma.com",
  verified: true,
  memberSince: "2025-03-02T00:00:00Z",
};

export const accountMenuItems: AccountMenuItem[] = [
  { id: "dossier", label: "Saved dossier", href: "#account/dossier", count: 12 },
  { id: "watches", label: "Active price watches", href: "#account/alerts", count: 4 },
  { id: "profile", label: "Personalization profile", href: "#account/profile" },
  { id: "settings", label: "Account settings", href: "#account/settings" },
];

/** Member value propositions for the auth dialog. */
export const memberBenefits = [
  { id: "save", title: "Save products & guides", description: "Build a dossier of what you are weighing; we keep the prices current." },
  { id: "alerts", title: "Instant price-drop alerts", description: "Name a price; we watch every merchant we track and tell you the moment it hits." },
  { id: "presets", title: "Sync calculator presets", description: "Your dose, pace and fit profiles follow you across every tool and directory." },
];

export const savedProducts: SavedProduct[] = [
  { product: productShoe01, savedAt: "2026-10-12T10:00:00Z", savedPrice: 210 },
  { product: productShoe02, savedAt: "2026-10-14T10:00:00Z", savedPrice: 149 },
  { product: productShoe03, savedAt: "2026-09-30T10:00:00Z", savedPrice: 84 },
  { product: productWatch, savedAt: "2026-10-02T10:00:00Z", savedPrice: 4850 },
  { product: productCreatine, savedAt: "2026-10-20T10:00:00Z", savedPrice: 24 },
  { product: directoryProducts[3]!, savedAt: "2026-10-05T10:00:00Z", savedPrice: 189 },
  { product: directoryProducts[8]!, savedAt: "2026-09-22T10:00:00Z", savedPrice: 95 },
  { product: directoryProducts[13]!, savedAt: "2026-10-25T10:00:00Z", savedPrice: 189 },
];

export const savedGuides: SavedGuide[] = [
  { guide: guideDailyTrainers, savedAt: "2026-10-12T10:00:00Z" },
  { guide: guideCarbonPlated, savedAt: "2026-10-14T10:00:00Z" },
  { guide: guideCreatine, savedAt: "2026-10-21T10:00:00Z" },
  { guide: guideDiveWatches, savedAt: "2026-10-18T10:00:00Z" },
];

export const priceAlerts: PriceAlert[] = [
  {
    id: "alert-aerolite",
    kind: "price-drop",
    product: productShoe01,
    merchantName: "Northlane",
    targetPrice: 170,
    currentPrice: 189,
    inStock: true,
    active: true,
    createdAt: "2026-10-12T10:00:00Z",
  },
  {
    id: "alert-tempo",
    kind: "price-drop",
    product: productShoe02,
    merchantName: "Verra",
    targetPrice: 140,
    currentPrice: 149,
    inStock: true,
    active: true,
    createdAt: "2026-10-14T10:00:00Z",
  },
  {
    id: "alert-watch",
    kind: "price-drop",
    product: productWatch,
    merchantName: "Haus & Field",
    targetPrice: 4500,
    currentPrice: 4850,
    inStock: true,
    active: false,
    createdAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "alert-creatine",
    kind: "restock",
    product: productCreatine,
    merchantName: "Peak Supply",
    currentPrice: 21,
    inStock: false,
    active: true,
    createdAt: "2026-10-20T10:00:00Z",
  },
];

export const profileKeto: PersonalizationProfile = {
  id: "profile-keto",
  name: "Keto",
  parameters: ["≤ 2 g net carbs", "Third-party tested", "No artificial sweeteners"],
  matchCount: 18,
};

export const profileRunner: PersonalizationProfile = {
  id: "profile-runner",
  name: "Runner",
  parameters: ["Neutral", "Size 10.5", "Daily mileage 30–40"],
  matchCount: 24,
};
