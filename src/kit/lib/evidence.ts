import type { AssayContaminant, AssayIngredient, CategoryResults, Effect, EffectSize, EvidenceGrade, FaqItem, Grade, LabReport, Outcome, Reference, StudyDesign } from "@/kit/types";

const NBSP = " ";

/** What each evidence grade means, best first: the grade legend’s and the evidence table’s default words. */
export const EVIDENCE_GRADES: readonly { grade: EvidenceGrade; meaning: string }[] = [
  { grade: "A", meaning: "Several studies, mostly in agreement, show at least a moderate effect." },
  { grade: "B", meaning: "Fewer studies, or a smaller effect, but they point the same way." },
  { grade: "C", meaning: "A possible effect: few studies, or results that disagree." },
  { grade: "D", meaning: "Too little research, results that conflict, or an effect too small to matter." },
  { grade: "F", meaning: "The research points to harm." },
];

/** What each band of lab grades means, with the scores out of 10 behind it (`gradeFor` in `@/kit/lib/discovery`). */
export const LAB_GRADES: readonly { grade: Grade; meaning: string }[] = [
  { grade: "A", meaning: "8.5 and up: matches its label, with every contaminant far under its limit." },
  { grade: "B", meaning: "7.0 to 8.4: close to its label, with every contaminant under its limit." },
  { grade: "C", meaning: "5.5 to 6.9: off its label, or close to a contaminant limit." },
  { grade: "D", meaning: "4.0 to 5.4: well off its label, or over a limit in one test." },
  { grade: "F", meaning: "Under 4.0: over a contaminant limit, or missing what it claims." },
];

const SIZE_WORD: Record<EffectSize, string> = { small: "Small", moderate: "Moderate", large: "Large" };

/** An effect in words: “Moderate increase”, “Decrease”, “No effect”, “Mixed results”. */
export function effectWords(effect: Effect, size?: EffectSize): string {
  if (effect === "none") return "No effect";
  if (effect === "mixed") return "Mixed results";
  if (size) return `${SIZE_WORD[size]} ${effect}`;
  return effect === "increase" ? "Increase" : "Decrease";
}

/** How each study design is named on the page. */
export const STUDY_DESIGN_LABEL: Record<StudyDesign, string> = {
  "meta-analysis": "Meta-analysis",
  "randomized-trial": "Randomized controlled trial",
  observational: "Observational study",
  "case-report": "Case report",
};

/** The orders an evidence table offers: by grade (best first), by number of studies (most first), or by name. */
export type OutcomeSort = "grade" | "studies" | "name";

const GRADE_ORDER: readonly EvidenceGrade[] = ["A", "B", "C", "D", "F"];
const byName = (a: Outcome, b: Outcome) => a.name.localeCompare(b.name, "en-US");
const byGrade = (a: Outcome, b: Outcome) => GRADE_ORDER.indexOf(a.grade) - GRADE_ORDER.indexOf(b.grade) || b.studies - a.studies || byName(a, b);
const byStudies = (a: Outcome, b: Outcome) => b.studies - a.studies || byGrade(a, b);

/** Outcomes in the order an evidence table asks for. */
export function sortOutcomes(outcomes: readonly Outcome[], by: OutcomeSort): Outcome[] {
  return [...outcomes].sort(by === "grade" ? byGrade : by === "studies" ? byStudies : byName);
}

/** The anchor a reference list gives a source: `ref-{id}`. */
export const referenceId = (id: string) => `ref-${id}`;

/** The anchor of a citation of a source: `cite-{id}`, then `cite-{id}-2` for its second citation. */
export const citationId = (id: string, occurrence = 1) => (occurrence > 1 ? `cite-${id}-${occurrence}` : `cite-${id}`);

/** Authors as a reference list prints them: up to three, then “et al.” */
export function formatAuthors(authors: readonly string[]): string {
  return authors.length > 3 ? `${authors.slice(0, 3).join(", ")}, et al.` : authors.join(", ");
}

/** A source in a few words, as a study card cites it: “Okafor et al., 2024”. */
export function shortCitation(ref: Pick<Reference, "authors" | "year">): string {
  const first = ref.authors[0]?.split(" ")[0] ?? "Anonymous";
  return `${first}${ref.authors.length > 2 ? " et al." : ref.authors.length === 2 ? ` and ${ref.authors[1]!.split(" ")[0]}` : ""}, ${ref.year}`;
}

/** Where a reference links: its DOI, else its PubMed page, else its URL. */
export function referenceHref(ref: Pick<Reference, "doi" | "pmid" | "url">): string | undefined {
  if (ref.doi) return `https://doi.org/${ref.doi}`;
  if (ref.pmid) return `https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`;
  return ref.url;
}

/** Found against claimed, as a percent difference: 5,050 of a claimed 5,000 mg is +1.0. */
export const percentOff = (found: number, claimed: number) => (found / claimed - 1) * 100;

/** A difference in percent, signed with a true minus: “+1.0%”, “−17.6%”, “0.0%”. */
export function formatDifference(diff: number): string {
  const rounded = Math.round(diff * 10) / 10;
  if (rounded === 0) return "0.0%";
  return `${rounded > 0 ? "+" : "−"}${Math.abs(rounded).toFixed(1)}%`;
}

/** An amount and its unit, tied with a no-break space, to the precision a lab reports: “5,020 mg”, “27.1 mcg”, “0.21 mcg”. */
export function formatAmount(value: number, unit: string): string {
  const digits = Math.abs(value) < 1 ? 2 : Math.abs(value) < 100 ? 1 : 0;
  return `${value.toLocaleString("en-US", { maximumFractionDigits: digits })}${NBSP}${unit}`;
}

/** Whether an ingredient is within the tolerance of its claim, in percent either way (default 10). */
export const withinTolerance = (ingredient: Pick<AssayIngredient, "found" | "claimed">, tolerance = 10) => Math.abs(percentOff(ingredient.found, ingredient.claimed)) <= tolerance;

/** Whether a contaminant came in over its limit; one below the lab’s LOQ never does. */
export const overLimit = (contaminant: Pick<AssayContaminant, "found" | "limit">) => contaminant.found !== null && contaminant.found > contaminant.limit;

/** Whether every contaminant came in at or under its limit. */
export const passesPurity = (report: Pick<LabReport, "contaminants">) => !report.contaminants.some(overLimit);

/** A category’s results summed up: how many were tested, the average label accuracy, how many came within tolerance, and how many failed a contaminant limit. */
export function summarizeResults(results: CategoryResults) {
  const tolerance = results.tolerance ?? 10;
  const { products } = results;
  const tested = products.length;
  const average = tested ? products.reduce((sum, p) => sum + p.accuracy, 0) / tested : 0;
  const within = products.filter((p) => Math.abs(p.accuracy - 100) <= tolerance).length;
  const failed = products.filter((p) => !p.purity).length;
  const both = products.filter((p) => p.purity && Math.abs(p.accuracy - 100) <= tolerance).length;
  return { tested, average, within, failed, both, tolerance };
}

/** The schema.org FAQPage structured data for a list of questions, for a JSON-LD script. */
export function faqStructuredData(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer.join("\n\n") } })),
  };
}

/** Pounds in a kilogram. */
export const LB_PER_KG = 2.20462;
