import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must learn our token-bridged class groups, otherwise
 * `rounded-surface` and `rounded-none` (or `p-card-pad` vs `p-0`) would both
 * survive a merge and the consumer override would silently fail.
 */
const twMerge = extendTailwindMerge<"type-style">({
  extend: {
    theme: {
      radius: ["surface", "interactive", "badge", "media", "control"],
      spacing: [
        "card-pad",
        "grid-gap",
        "row-pad",
        "cluster-gap",
        "section-gap",
        "control",
        "pin",
        "dock-offset",
      ],
      shadow: ["surface", "surface-hover", "overlay", "dock"],
      ease: ["spring", "exit"],
      tracking: ["eyebrow", "display"],
      text: ["eyebrow", "display", "display-sm", "metric"],
      leading: ["display"],
      font: ["display", "body", "metric"],
      color: [
        "background",
        "surface",
        "surface-sunken",
        "foreground",
        "muted",
        "accent",
        "accent-foreground",
        "accent-soft",
        "border",
        "positive",
        "negative",
        "caution",
        "award",
        "award-foreground",
        "focus-ring",
      ],
    },
    classGroups: {
      duration: ["duration-interactive", "duration-reveal", "duration-micro"],
      "border-w": ["border-surface-w", "border-interactive-w", "border-emphasis-w"],
      "border-w-b": ["border-b-surface-w"],
      "border-w-t": ["border-t-surface-w"],
      "border-w-l": ["border-l-emphasis-w"],
      "font-weight": [
        "font-weight-display",
        "font-weight-eyebrow",
        "font-weight-metric",
      ],
      "text-transform": ["transform-eyebrow"],
      "type-style": ["type-eyebrow", "type-display", "type-display-sm", "type-metric"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
