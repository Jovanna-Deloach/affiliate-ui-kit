/**
 * TYPESETTING — the kit sets editorial copy, so agents can pass plain text.
 *
 *   38 mm → 38 mm        a no-break space ties every number to its unit
 *   "quoted" → “quoted”  true quotes and apostrophes (don't → don’t)
 *   95-110% → 95–110%    an en dash in numeric ranges
 *   -0.4 s → −0.4 s      a true minus before a signed number
 *   40 x 47 → 40 × 47    a multiplication sign between numbers
 *   ... → …              one ellipsis glyph
 *
 * Idempotent: running it twice changes nothing. `audit:kit` fails a rendered
 * page that still contains any of the left-hand forms.
 */

const NBSP = " ";

/** Units and counted nouns that must never wrap away from their number. */
export const UNITS = [
  "mm",
  "cm",
  "m",
  "km",
  "mi",
  "g",
  "kg",
  "mg",
  "µg",
  "μg",
  "mcg",
  "oz",
  "lb",
  "ml",
  "L",
  "s",
  "ms",
  "min",
  "h",
  "hr",
  "ppm",
  "°C",
  "°F",
  "day",
  "days",
  "hour",
  "hours",
  "week",
  "weeks",
  "month",
  "months",
  "year",
  "years",
  "mile",
  "miles",
  "serving",
  "servings",
  "capsules",
] as const;

const UNIT_ALT = UNITS.map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
/** A number (optionally signed, with separators) + ordinary space + unit. */
export const LOOSE_UNIT = new RegExp(`(\\d)[ \\t]+(${UNIT_ALT})(?![\\p{L}\\d])`, "gu");

export function typeset(input: string): string {
  let s = input;
  // Ellipsis.
  s = s.replace(/\.\.\./g, "…");
  // Numeric ranges: 95-110 → 95–110 (digits on both sides, no spaces).
  s = s.replace(/(\d)-(?=\d)/g, "$1–");
  // Signed numbers: a hyphen-minus that starts a number becomes a true minus.
  s = s.replace(/(^|[\s(])-(?=\d)/g, "$1−");
  // Multiplication between numbers: 60 x 5 g → 60 × 5 g.
  s = s.replace(/(\d)\s?[xX]\s?(?=\d)/g, `$1${NBSP}×${NBSP}`);
  // Number + unit: tie them together; likewise a comparison sign and its number.
  s = s.replace(LOOSE_UNIT, `$1${NBSP}$2`);
  s = s.replace(/([≤≥<>±≈~]) (?=\d)/g, `$1${NBSP}`);
  // Paired figures (38 / 30 mm) stay on one line.
  s = s.replace(/(\d) \/ (?=\d)/g, `$1${NBSP}/${NBSP}`);
  // Quotes: opening after start, space or opening punctuation; the rest close.
  s = s.replace(/(^|[\s([{—–])"/g, "$1“").replace(/"/g, "”");
  s = s.replace(/(^|[\s([{—–])'/g, "$1‘").replace(/'/g, "’");
  return s;
}

/** Keys whose string values are prose. Everything else (ids, urls, enums, dates) is left alone. */
const PROSE = new Set([
  "title",
  "dek",
  "testedWith",
  "label",
  "value",
  "note",
  "award",
  "bestFor",
  "synthesis",
  "body",
  "likes",
  "caveats",
  "text",
  "role",
  "name",
  "brand",
  "reason",
  "heading",
  "summary",
  "limit",
  "railHeading",
  "jumpLabel",
  "reference",
  "intro",
  "unit",
  "disclosure",
  "disclosureNotice",
  "tagline",
]);

/** Typeset every prose string in a fixture or page contract, deeply. */
export function typesetDeep<T>(value: T, key?: string): T {
  if (typeof value === "string") return (key && PROSE.has(key) ? typeset(value) : value) as T;
  if (Array.isArray(value)) return value.map((v) => typesetDeep(v, key)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = typesetDeep(v, k);
    return out as T;
  }
  return value;
}

/** Rendered-text violations, for the audit. Returns a reason per offending fragment. */
export function typesettingIssues(text: string): string[] {
  const issues: string[] = [];
  const unit = new RegExp(LOOSE_UNIT.source, "gu");
  for (const m of text.matchAll(unit)) issues.push(`number and unit can wrap apart: “${m[0]}” (use a no-break space)`);
  if (/["']/.test(text)) issues.push(`straight quote in “${text.slice(0, 60)}” (use “ ” ‘ ’)`);
  for (const m of text.matchAll(/\d-\d/g)) issues.push(`hyphen in numeric range “${m[0]}” (use an en dash)`);
  for (const m of text.matchAll(/(?:^|\s)-\d/g)) issues.push(`hyphen as minus “${m[0].trim()}” (use −)`);
  for (const m of text.matchAll(/\d\s?[xX]\s?\d/g)) issues.push(`letter x as multiplication “${m[0]}” (use ×)`);
  if (text.includes("...")) issues.push("three dots (use …)");
  return issues;
}
