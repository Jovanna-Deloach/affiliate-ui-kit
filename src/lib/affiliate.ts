import type { AffiliateAttribution, AffiliateClickEvent } from "@/types/affiliate";

/**
 * Attribution + tracking primitives shared by every monetized link.
 * Pure functions — unit tested in affiliate.test.ts.
 */

/** Link relation every monetized outbound link MUST carry (FTC / Google). */
export const AFFILIATE_REL = "sponsored nofollow noopener" as const;

/** DOM event name dispatched on `window` for every tracked click. */
export const AFFILIATE_CLICK_EVENT = "affiliate:click" as const;

/**
 * Appends UTM + network sub-id parameters to a merchant URL.
 * - Existing parameters are preserved; ours never overwrite them unless
 *   `overwrite` is set (a merchant deep link may already carry its own UTMs).
 * - Relative or malformed URLs are returned untouched.
 */
export function buildAffiliateHref(
  href: string,
  attribution?: AffiliateAttribution,
  { overwrite = false }: { overwrite?: boolean } = {},
): string {
  if (!attribution) return href;
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return href;
  }
  const set = (key: string, value?: string) => {
    if (!value) return;
    if (!overwrite && url.searchParams.has(key)) return;
    url.searchParams.set(key, value);
  };
  set("utm_source", attribution.source);
  set("utm_medium", attribution.medium);
  set("utm_campaign", attribution.campaign);
  set("utm_content", attribution.content);
  set(attribution.subIdParam ?? "subId", attribution.subId);
  return url.toString();
}

/** Merge a consumer-supplied `rel` with the mandatory affiliate relation. */
export function mergeRel(rel?: string): string {
  const tokens = new Set(AFFILIATE_REL.split(" "));
  for (const t of (rel ?? "").split(/\s+/)) if (t) tokens.add(t);
  return Array.from(tokens).join(" ");
}

/**
 * Fan-out for a click: the optional callback (prop-level) AND a global
 * `affiliate:click` CustomEvent so analytics can subscribe once at the app
 * shell (`window.addEventListener("affiliate:click", e => sendBeacon(...))`).
 */
export function emitAffiliateClick(
  input: Omit<AffiliateClickEvent, "timestamp"> & { timestamp?: number },
  onTrack?: (event: AffiliateClickEvent) => void,
) {
  // Stamped here, at dispatch time — never during a component render.
  const event: AffiliateClickEvent = { ...input, timestamp: input.timestamp ?? Date.now() };
  onTrack?.(event);
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent(AFFILIATE_CLICK_EVENT, { detail: event }));
  }
}

declare global {
  interface WindowEventMap {
    "affiliate:click": CustomEvent<AffiliateClickEvent>;
  }
}
