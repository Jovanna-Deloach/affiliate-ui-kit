import { cn } from "@/lib/cn";

/** A decorative middle-dot separator for micro-caps rows (screen readers skip it). */
export function Sep({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("px-1.5 opacity-60", className)}>
      ·
    </span>
  );
}

/**
 * A merchant’s initials in a bordered 28px square: “Haus & Field” → HF.
 * Decorative (the name is always beside it), so merchants never need a
 * wordmark.
 */
export function Monogram({ name, className }: { name: string; className?: string }) {
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
