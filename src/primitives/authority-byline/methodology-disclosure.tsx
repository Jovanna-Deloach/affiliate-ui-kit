"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { useId, useState, type ReactNode } from "react";

import { cn } from "@/lib/cn";

/**
 * SEO-safe progressive disclosure for "How we tested".
 * Radix Collapsible with `forceMount` keeps the methodology in the SSR DOM for
 * crawlers; the reveal is a CSS grid 0fr → 1fr transition (`reveal-grid`);
 * the collapsed panel is `inert` so it is out of the tab order and the
 * accessibility tree until opened. The only state is a boolean.
 */
export function MethodologyDisclosure({
  trigger,
  children,
  defaultOpen = false,
  className,
  triggerClassName,
}: {
  trigger: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      data-slot="methodology-disclosure"
      className={cn("group/disc flex min-w-0 flex-col", className)}
    >
      <Collapsible.Trigger
        id={`${id}-trigger`}
        className={cn(
          "focus-ring inline-flex w-fit cursor-pointer items-center gap-[0.4em] type-eyebrow text-foreground",
          "underline decoration-border-strong underline-offset-[0.3em] decoration-[length:var(--border-width-interactive)] hover:decoration-foreground",
          triggerClassName,
        )}
      >
        {trigger}
        <ChevronDown
          size="1.1em"
          strokeWidth={1.5}
          aria-hidden="true"
          className="transition-transform duration-interactive ease-spring group-data-[state=open]/disc:rotate-180"
        />
      </Collapsible.Trigger>
      <Collapsible.Content forceMount className="reveal-grid">
        <div inert={!open} className="min-w-0">
          <div className="pt-cluster-gap text-sm leading-relaxed text-muted">{children}</div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
