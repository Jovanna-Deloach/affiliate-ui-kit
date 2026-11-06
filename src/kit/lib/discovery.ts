import { leadOffer } from "@/kit/lib/offers";
import type { Grade, ProductSummary, ReaderItem, SearchHit, SearchKind } from "@/kit/types";

/** Every grade, best first. */
export const GRADES: readonly Grade[] = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

/**
 * The grade for a score out of 10, in half-point steps: 9.5 and up is A+,
 * 9.0 A, 8.5 A−, down to D− at 4.0; under 4.0 is F.
 */
export function gradeFor(score: number): Grade {
  if (score >= 9.5) return "A+";
  const step = Math.ceil((9.5 - score) / 0.5 - 1e-9);
  return GRADES[Math.min(step, GRADES.length - 1)] ?? "F";
}

/** A grade as people say it: “A minus”, “B plus”. */
export function gradeWords(grade: Grade): string {
  return grade.replace("+", " plus").replace("-", " minus");
}

/** The orders a ranking offers: by test result, by cost per serving, certified first, or by name. */
export type RankingSort = "quality" | "value" | "certified" | "name";

const byQuality = (a: ProductSummary, b: ProductSummary) =>
  (b.score ?? -1) - (a.score ?? -1) || GRADES.indexOf(a.grade ?? "F") - GRADES.indexOf(b.grade ?? "F");
const byName = (a: ProductSummary, b: ProductSummary) => `${a.product.brand} ${a.product.name}`.localeCompare(`${b.product.brand} ${b.product.name}`, "en-US");

const ORDER: Record<RankingSort, (a: ProductSummary, b: ProductSummary) => number> = {
  quality: (a, b) => byQuality(a, b) || byName(a, b),
  value: (a, b) => (a.perServing?.amount ?? Infinity) - (b.perServing?.amount ?? Infinity) || byQuality(a, b),
  certified: (a, b) => Number(b.certification?.status === "certified") - Number(a.certification?.status === "certified") || byQuality(a, b),
  name: byName,
};

/** A category’s products in the order a ranking asks for. Products sold out everywhere keep their place: the ranking is about the test. */
export function sortProducts(products: readonly ProductSummary[], by: RankingSort): ProductSummary[] {
  return [...products].sort(ORDER[by]);
}

/** A product as a reader’s history, saved items or compare tray keep it: its lowest price now becomes “the price when they looked”. */
export function toReaderItem(summary: ProductSummary, at: string = new Date().toISOString()): ReaderItem {
  const { product } = summary;
  const offer = leadOffer(product.offers);
  return {
    kind: "product",
    id: product.id,
    title: product.name,
    brand: product.brand,
    href: summary.href,
    image: product.image,
    price: offer ? { amount: offer.price, currency: offer.currency } : undefined,
    grade: summary.grade,
    at,
  };
}

/** The order a search shows its groups in. */
export const SEARCH_KINDS: readonly SearchKind[] = ["product", "brand", "ingredient", "guide", "category"];

const fold = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();

/**
 * Search a small index in the browser: every word must appear in the title
 * or snippet; a title that starts with the words ranks first, then titles
 * with every word at the start of one of theirs, then titles holding them,
 * then snippets. Ties keep the index’s order. Accents and case are ignored.
 */
export function searchIndex(index: readonly SearchHit[], query: string): SearchHit[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: { hit: SearchHit; score: number }[] = [];
  for (const hit of index) {
    const title = fold(hit.title);
    const text = `${title} ${fold(hit.snippet ?? "")}`;
    if (!words.every((word) => text.includes(word))) continue;
    const phrase = words.join(" ");
    const score = title.startsWith(phrase) ? 0 : words.every((word) => new RegExp(`(^|\\s)${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)) ? 1 : words.every((word) => title.includes(word)) ? 2 : 3;
    scored.push({ hit, score });
  }
  // Ties keep the index’s own order, so the site decides which of two equal matches comes first.
  return scored.sort((a, b) => a.score - b.score).map(({ hit }) => hit);
}

/**
 * The parts of a text, with the words searched for marked, for a result to
 * set in bold: `[{ text: "Creatine", match: true }, { text: " monohydrate", match: false }]`.
 */
export function markWords(text: string, query: string): { text: string; match: boolean }[] {
  const words = fold(query).split(/\s+/).filter((word) => word.length > 1);
  if (!words.length) return [{ text, match: false }];
  const folded = fold(text);
  // Folding can change length (rare ligatures); fall back to no marks rather than mark the wrong letters.
  if (folded.length !== text.length) return [{ text, match: false }];
  const hits: [number, number][] = [];
  for (const word of words) {
    for (let at = folded.indexOf(word); at !== -1; at = folded.indexOf(word, at + word.length)) hits.push([at, at + word.length]);
  }
  hits.sort((a, b) => a[0] - b[0]);
  const parts: { text: string; match: boolean }[] = [];
  let cursor = 0;
  for (const [start, end] of hits) {
    if (end <= cursor) continue;
    const from = Math.max(start, cursor);
    if (from > cursor) parts.push({ text: text.slice(cursor, from), match: false });
    parts.push({ text: text.slice(from, end), match: true });
    cursor = end;
  }
  if (cursor < text.length) parts.push({ text: text.slice(cursor), match: false });
  return parts;
}
