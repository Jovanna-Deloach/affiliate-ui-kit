import { Minus, Plus } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Show and hide, with no script: a native <details>. Closed content stays in
 * the document, so search engines and find-in-page still reach it. Give a
 * set of disclosures the same `name` to make an accordion where opening one
 * closes the others.
 *
 *   <Disclosure>
 *     <DisclosureSummary>Label <DisclosureIcon /></DisclosureSummary>
 *     …content
 *   </Disclosure>
 *
 * The summary is a 44px target with the kit focus ring. The icon is a plus
 * that becomes a minus when open; `framed` sets it in a bordered 28px square
 * (a card footer), plain for lists of rows.
 */
export function Disclosure({ className, ...props }: ComponentProps<"details">) {
  return <details className={cn("group/disclosure", className)} {...props} />;
}

export function DisclosureSummary({ className, ...props }: ComponentProps<"summary">) {
  return (
    <summary
      className={cn("kit-focus flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden", className)}
      {...props}
    />
  );
}

export function DisclosureIcon({ framed = false, className }: { framed?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center text-fg transition-colors duration-(--dur) ease-(--ease)",
        framed ? "size-7 rounded-ctl border border-line-strong group-hover/disclosure:border-fg" : "size-6 text-fg-muted group-hover/disclosure:text-fg",
        className,
      )}
    >
      <Plus size={framed ? 14 : 18} strokeWidth={framed ? 2 : 1.75} className="group-open/disclosure:hidden" />
      <Minus size={framed ? 14 : 18} strokeWidth={framed ? 2 : 1.75} className="hidden group-open/disclosure:block" />
    </span>
  );
}
