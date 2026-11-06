"use client";

import { useCallback, useState } from "react";

/**
 * Overlays render in a portal, outside the element that carries
 * `data-theme` (and `data-category`), so they would lose the theme’s roles.
 * Render the returned anchor beside the trigger; the overlay then portals
 * into the nearest themed ancestor and keeps its look.
 *
 * ```tsx
 * const [anchor, container] = useThemeRoot();
 * return <>{anchor}<Popover.Portal container={container}>…</Popover.Portal></>;
 * ```
 */
export function useThemeRoot() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const ref = useCallback((node: HTMLSpanElement | null) => {
    setContainer(node?.closest<HTMLElement>("[data-theme]") ?? null);
  }, []);
  const anchor = <span ref={ref} hidden />;
  return [anchor, container ?? undefined] as const;
}
