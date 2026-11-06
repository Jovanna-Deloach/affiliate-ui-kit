import { cn } from "@/lib/cn";

export interface SepProps {
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The middle dot between parts of a micro-caps row: decorative, so screen
 * readers skip it and hear the parts as one phrase.
 *
 * **Use it for** a hand-built row of labels (an offer’s terms, a stamp).
 * Prefer `Eyebrow` with `items`, which places it for you. **Not for** a dot
 * typed into the copy: the audit fails a typed “ · ”.
 *
 * @summary The decorative middle dot between micro-caps parts; never type “ · ”.
 * @import import { Sep } from "@/kit/ui";
 */
export function Sep({ className }: SepProps) {
  return (
    <span aria-hidden="true" className={cn("px-1.5 opacity-60", className)}>
      ·
    </span>
  );
}

export interface MonogramProps {
  /** The merchant’s name: its first two words give the letters (“Haus & Field” becomes HF). */
  name: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A merchant’s initials in a bordered 28px square. Decorative (the name is
 * always written beside it), so a retailer never needs a wordmark or a logo
 * file.
 *
 * **Use it for** a retailer in an offer card or a retailer row (both already
 * include it). **Not for** a person (`Avatar`).
 *
 * @summary A retailer’s initials in a 28px square, beside the written merchant name.
 * @import import { Monogram } from "@/kit/ui";
 */
export function Monogram({ name, className }: MonogramProps) {
  const letters = name
    .split(/\s+/)
    .filter((w) => /^\p{L}/u.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return (
    <span aria-hidden="true" className={cn("grid size-7 shrink-0 place-items-center rounded-ctl border border-line-strong bg-paper t-micro-sm text-fg", className)}>
      {letters}
    </span>
  );
}
