import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must learn our token-bridged class groups, otherwise
 * `rounded-surface` and `rounded-none` (or `p-card-pad` vs `p-0`) would both
 * survive a merge and the consumer override would silently fail.
 */
const twMerge = extendTailwindMerge<"type-style" | "object-fit-token">({
  extend: {
    theme: {
      radius: ["surface", "interactive", "badge", "media", "control"],
      spacing: [
        "card-pad",
        "grid-gap",
        "row-pad",
        "cluster-gap",
        "section-gap",
        "media-inset",
        "pedestal-inset",
        "overlay-inset",
        "badge-x",
        "badge-y",
        "control",
        "seal",
        "pin",
        "dock-offset",
      ],
      shadow: ["surface", "surface-hover", "badge", "overlay", "dock"],
      ease: ["spring", "exit", "media"],
      tracking: ["eyebrow", "label", "display"],
      text: ["eyebrow", "display", "display-sm", "metric"],
      leading: ["display"],
      font: ["display", "sans", "mono"],
      blur: ["glass"],
      color: [
        "background",
        "surface",
        "surface-pedestal",
        "foreground",
        "muted",
        "border",
        "border-strong",
        "accent",
        "accent-foreground",
        "accent-soft",
        "badge-primary-bg",
        "badge-primary-fg",
        "badge-secondary-bg",
        "badge-secondary-fg",
        "positive",
        "negative",
        "caution",
        "focus-ring",
      ],
    },
    classGroups: {
      duration: [
        "duration-interactive",
        "duration-reveal",
        "duration-micro",
        "duration-media",
      ],
      "border-w": ["border-surface-w", "border-interactive-w", "border-emphasis-w"],
      "border-w-b": ["border-b-surface-w"],
      "border-w-t": ["border-t-surface-w"],
      "border-w-l": ["border-l-surface-w", "border-l-emphasis-w"],
      "font-weight": ["font-weight-display", "font-weight-eyebrow", "font-weight-metric"],
      "text-transform": ["transform-eyebrow"],
      "object-fit-token": ["object-media-fit"],
      "type-style": [
        "type-eyebrow",
        "type-label-mono",
        "type-display",
        "type-display-sm",
        "type-metric",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
