import { AlertTriangle, Check, X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The award a pick holds: a solid pill in mono micro-caps. Written in
 * sentence case (“Our pick”), set in capitals by CSS; never numbered.
 */
export function Award({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-slot="award" className={cn("inline-flex items-center self-start justify-self-start rounded-ctl border border-award-line bg-award px-2 py-1 t-micro-sm text-on-award", className)}>
      {children}
    </span>
  );
}

const RESULT = {
  pass: { icon: Check, cls: "bg-pass-soft text-pass" },
  fail: { icon: X, cls: "bg-fail-soft text-fail" },
  caution: { icon: AlertTriangle, cls: "bg-warn-soft text-warn" },
} as const;

/** Pass / fail / near limit, with an icon, so colour is never the only signal. */
export function ResultMark({ status, children, className }: { status: keyof typeof RESULT; children: ReactNode; className?: string }) {
  const { icon: Icon, cls } = RESULT[status];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full py-0.5 pr-2 pl-1.5 t-micro-sm", cls, className)}>
      <Icon size="1.2em" strokeWidth={2.25} aria-hidden="true" />
      {children}
    </span>
  );
}

/** “Best price”: shown beside a lead price only when another retailer has it in stock for more. */
export function BestPrice({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-pass-soft px-2 py-0.5 t-micro-sm text-pass", className)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-pass" />
      Best price
    </span>
  );
}

/** A decorative middle-dot separator for micro-caps rows (screen readers skip it). */
export function Sep({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("px-1.5 opacity-60", className)}>
      ·
    </span>
  );
}

/** A merchant’s initials in a bordered square: “Haus & Field” → HF. Decorative; the name sits beside it. */
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
