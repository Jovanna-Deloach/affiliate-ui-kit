"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

export interface MethodologyFact {
  /** "3", "Dual-run", "ISO 17025" — set in the metric voice. */
  value: ReactNode;
  /** "Retail batches", "HPLC assay", "Laboratory". */
  label: ReactNode;
}

/**
 * "How we tested" disclosure for bylines. A two-cell header grid — the
 * verification line on the left keyline, the trigger on the right — with the
 * protocol revealed underneath across the full width (SEO-safe: forceMount +
 * CSS grid 0fr → 1fr, `inert` while closed). When `facts` are supplied they
 * render as a three-column testing-metric summary above the prose.
 */
export function MethodologyDisclosure({
  leading,
  trigger = "How we tested",
  facts,
  children,
  defaultOpen = false,
  className,
}: {
  /** Left-hand content of the header row (verification line). */
  leading?: ReactNode;
  trigger?: ReactNode;
  facts?: MethodologyFact[];
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="methodology-disclosure"
      className={cn("group/collapse flex min-w-0 flex-col", className)}
    >
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack gap-y-cluster">
        <div className="min-w-0">{leading}</div>
        <Collapsible.Trigger
          className={cn(
            "focus-ring inline-flex w-fit cursor-pointer items-center gap-[0.4em] type-eyebrow text-ink",
            "underline decoration-strong underline-offset-[0.3em] decoration-[length:var(--border-width)] hover:decoration-ink",
            "transition-colors duration-interactive ease-standard",
          )}
        >
          <span>{trigger}</span>
          <ChevronDown
            size="1.1em"
            strokeWidth={1.5}
            aria-hidden="true"
            className="shrink-0 transition-transform duration-interactive ease-standard group-data-[state=open]/collapse:rotate-180"
          />
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content forceMount className="reveal-grid">
        <div inert={!open} className="min-w-0">
          <div data-slot="methodology-panel" className="flex flex-col gap-stack pt-stack">
            {facts && facts.length > 0 && (
              <dl className="m-0 grid grid-cols-3 gap-x-stack border-y border-hairline py-cluster">
                {facts.map((f, i) => (
                  <div key={i} className="flex min-w-0 flex-col gap-hairline">
                    <dd className="type-metric m-0 truncate text-body text-ink">{f.value}</dd>
                    <dt className="truncate text-caption text-ink-tertiary">{f.label}</dt>
                  </div>
                ))}
              </dl>
            )}
            <div className="max-w-prose text-body-sm leading-body text-ink-secondary">{children}</div>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
