"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query. The server snapshot defaults to `serverMatches`
 * (desktop), so a sheet trigger hydrates identically on both platforms and
 * only the portal'd surface — which is not rendered while closed — switches.
 */
export function useMediaQuery(query: string, serverMatches = true): boolean {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => (typeof window === "undefined" ? serverMatches : window.matchMedia(query).matches),
    () => serverMatches,
  );
}

/** Desktop breakpoint shared by every responsive surface in the kit. */
export const DESKTOP_QUERY = "(min-width: 768px)";
