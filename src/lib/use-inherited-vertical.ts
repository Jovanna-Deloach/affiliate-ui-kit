"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";

import type { Vertical } from "@/lib/verticals";

/**
 * Portalled surfaces (sheets, popovers, docks) render outside the DOM subtree
 * that carries `[data-vertical]`, so they would fall back to the `:root`
 * profile. This hook reads the nearest vertical of an in-place anchor so the
 * surface can stamp the same `data-vertical` on itself and inherit the exact
 * token profile of the place it was opened from — including nested verticals
 * on one page and Storybook's decorator wrapper.
 */
export function useInheritedVertical<T extends HTMLElement = HTMLSpanElement>(): [
  RefObject<T | null>,
  Vertical | undefined,
] {
  const anchorRef = useRef<T>(null);
  const [vertical, setVertical] = useState<Vertical | undefined>(undefined);

  useLayoutEffect(() => {
    const host = anchorRef.current?.closest<HTMLElement>("[data-vertical]");
    const value = host?.dataset.vertical as Vertical | undefined;
    if (value) setVertical(value);
  }, []);

  return [anchorRef, vertical];
}
