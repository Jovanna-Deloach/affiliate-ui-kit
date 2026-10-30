import type { GuideEntity } from "@/types/account";

import { authorClinical, authorEditorial } from "./authors";
import { directoryProducts, productCreatine, productShoe01, productShoe02, productShoe03, productWatch } from "./products";

/**
 * Roundup buying guides: the entities behind <GuideIndexCard />, the saved
 * dossier and the "Read next" endcap. Each carries its winners (the
 * miniature stack), tested/winner counts, the lead tester and a last-update.
 */

const testerRunning = {
  name: "Marcus Whitfield",
  role: "Lead tester · 1,200 mi logged",
  href: "#tester-whitfield",
};

export const guideDailyTrainers: GuideEntity = {
  id: "guide-daily-trainers",
  slug: "best-daily-trainers",
  title: "The best daily trainers of 2026",
  dek: "Twenty-four shoes, four testers, 412 logged miles — and only five we would buy again.",
  href: "#guide-daily-trainers",
  products: [productShoe01, productShoe02, productShoe03],
  tested: 24,
  winners: 5,
  updatedAt: "2026-10-27T14:00:00Z",
  leadTester: testerRunning,
  vertical: "running",
};

export const guideCarbonPlated: GuideEntity = {
  id: "guide-carbon-plated",
  slug: "best-carbon-plated-racers",
  title: "Best carbon-plated racers, lab-timed",
  dek: "Eleven plates on the force rig; three worth the money on race day.",
  href: "#guide-carbon-plated",
  products: [productShoe02, directoryProducts[3]!, directoryProducts[9]!],
  tested: 11,
  winners: 3,
  updatedAt: "2026-10-12T09:00:00Z",
  leadTester: testerRunning,
  vertical: "running",
};

export const guideTrail: GuideEntity = {
  id: "guide-trail",
  slug: "best-trail-shoes",
  title: "Best trail shoes for mud, scree and long days out",
  dek: "Fifteen shoes across two mountain ranges; four we trust on wet rock.",
  href: "#guide-trail",
  products: [directoryProducts[8]!, directoryProducts[18]!, directoryProducts[28]!],
  tested: 15,
  winners: 4,
  updatedAt: "2026-09-18T09:00:00Z",
  leadTester: testerRunning,
  vertical: "running",
};

export const guideCreatine: GuideEntity = {
  id: "guide-creatine",
  slug: "best-creatine-monohydrate",
  title: "Best creatine monohydrate, assayed in duplicate",
  dek: "Eighteen powders through HPLC and ICP-MS; four pass every USP limit.",
  href: "#guide-creatine",
  products: [productCreatine, { ...productCreatine, id: "prod-ironhouse-creapure", name: "Creapure Micronised 300 g", brand: "Ironhouse" }, { ...productCreatine, id: "prod-northlane-creatine-1kg", name: "Creatine Monohydrate 1 kg", brand: "Northlane Basics" }],
  tested: 18,
  winners: 4,
  updatedAt: "2026-10-21T10:00:00Z",
  leadTester: { name: authorClinical.name, role: authorClinical.role ?? "Lab director", avatar: authorClinical.avatar, href: authorClinical.href },
  vertical: "supplements",
};

export const guideDiveWatches: GuideEntity = {
  id: "guide-dive-watches",
  slug: "best-dive-watches-under-5000",
  title: "The best dive watches under $5,000",
  dek: "Fourteen divers, thirty days each on the wrist, timed daily against a reference clock.",
  href: "#guide-dive-watches",
  products: [productWatch, { ...productWatch, id: "prod-halden-meridian-40", name: "Meridian 40", brand: "Halden" }, { ...productWatch, id: "prod-okada-tide-38", name: "Tide 38", brand: "Okada" }],
  tested: 14,
  winners: 4,
  updatedAt: "2026-10-18T12:00:00Z",
  leadTester: { name: authorEditorial.name, role: authorEditorial.role ?? "Editor", avatar: authorEditorial.avatar, href: authorEditorial.href },
  vertical: "watches",
};

export const guides: GuideEntity[] = [guideDailyTrainers, guideCarbonPlated, guideTrail, guideCreatine, guideDiveWatches];
