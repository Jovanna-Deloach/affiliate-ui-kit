/** Deterministic formatters (identical on server and client — no locale drift). */

export function formatPrice(
  amount: number,
  currency = "USD",
  { compact = true }: { compact?: boolean } = {},
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: compact && amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: compact && amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

/** "+$10" / "−$4" relative to a reference price; empty string when equal. */
export function formatPriceDelta(amount: number, reference: number, currency = "USD"): string {
  const delta = Math.round((amount - reference) * 100) / 100;
  if (delta === 0) return "";
  const abs = formatPrice(Math.abs(delta), currency);
  return delta > 0 ? `+${abs}` : `−${abs}`;
}

/** "Oct 27, 2026" — UTC so SSR and hydration agree regardless of viewer zone. */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

/** Score with one decimal, tabular ("9.0" not "9"). */
export function formatScore(score: number, decimals = 1): string {
  return score.toFixed(decimals);
}

/** Initials for avatar monograms: "Dr. Priya Raman" → "PR". */
export function initials(name: string): string {
  return name
    .replace(/\b(dr|mr|mrs|ms|prof)\.?\s+/gi, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
