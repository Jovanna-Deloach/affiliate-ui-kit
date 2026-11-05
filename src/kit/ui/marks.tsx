import { AlertTriangle, Check, X } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

/** The award a pick holds, in sentence case. Information, not decoration. */
export function Award({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-ctl bg-accent-soft px-2 py-1 t-caption font-medium text-accent", className)}>{children}</span>;
}

const RESULT = {
  pass: { icon: Check, cls: "bg-pass-soft text-pass" },
  fail: { icon: X, cls: "bg-fail-soft text-fail" },
  caution: { icon: AlertTriangle, cls: "bg-caution-soft text-caution" },
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
