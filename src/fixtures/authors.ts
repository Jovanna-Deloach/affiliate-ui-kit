import type { Author, Methodology } from "@/primitives/authority-byline";

/** Luxury Editorial reviewer. Monogram avatar — no stock portraits. */
export const authorEditorial: Author = {
  name: "Celeste Marchetti",
  role: "Watches & Jewellery Editor",
  credentials: ["14 yrs covering horology", "Former Christie's specialist"],
  bio: "Celeste has handled more than two thousand watches on the auction floor and writes the kit's long-form dossiers. She owns nothing she reviews.",
  href: "#author-celeste-marchetti",
};

/** Clinical Performance reviewer. */
export const authorClinical: Author = {
  name: "Dr. Priya Raman",
  role: "Lab Director, PhD",
  credentials: ["ISO 17025 accredited lab", "HPLC / ICP-MS", "Registered dietitian"],
  bio: "Priya runs the independent assay program behind every supplement score. Batches are purchased at retail, blinded and tested in duplicate.",
  href: "#author-priya-raman",
};

export const reviewerFactCheck: Author = {
  name: "Tomás Ferreira",
  role: "Fact-check",
};

export const methodologyEditorial: Methodology = {
  title: "How we tested",
  summary:
    "Each watch was worn for a minimum of 30 days across formal and everyday settings, timed daily against a reference clock, and inspected under 10× magnification for finishing. Retail prices are checked weekly; we hold no inventory and accept no loaners we are not free to criticise.",
};

export const methodologyClinical: Methodology = {
  title: "How we test",
  summary:
    "Products are purchased at retail from three merchants, blinded, and assayed in duplicate by an ISO 17025 laboratory (HPLC for actives, ICP-MS for heavy metals). Label accuracy is the mean of both runs; purity screens must pass USP limits. Scores are weighted 40 / 30 / 15 / 15 across accuracy, purity, solubility and value.",
};
