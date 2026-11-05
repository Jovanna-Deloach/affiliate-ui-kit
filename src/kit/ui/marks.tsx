import { AlertTriangle, Check, X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * The award a pick holds, in sentence case. Information, not decoration;
 * set in the section’s category colour, never numbered.
 */
export function Award({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-slot="award" className={cn("inline-flex items-center self-start justify-self-start rounded-ctl bg-accent-category-soft px-2 py-1 t-caption font-medium text-accent-category", className)}>
      {children}
    </span>
  );
}

const RESULT = {
  pass: { icon: Check, cls: "bg-pass-soft text-pass" },
  fail: { icon: X, cls: "bg-fail-soft text-fail" },
  caution: { icon: AlertTriangle, cls: "bg-warn-soft text-warn" },
} as const;

/** Pass / fail / caution with an icon, so colour is never the only signal. */
export function ResultMark({ status, children, className }: { status: keyof typeof RESULT; children: ReactNode; className?: string }) {
  const { icon: Icon, cls } = RESULT[status];
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full py-0.5 pr-2.5 pl-1.5 t-caption font-medium", cls, className)}>
      <Icon size="1.05em" strokeWidth={2} aria-hidden="true" />
      {children}
    </span>
  );
}

/** “Best price”: shown beside a lead price only when another retailer has it in stock for more. */
export function BestPrice({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full bg-pass-soft px-2 py-0.5 t-caption font-medium text-pass", className)}>Best price</span>;
}
