"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { useInheritedVertical } from "@/lib/use-inherited-vertical";

/**
 * Jargon definition on a spec label. Radix Tooltip (hover + focus, Esc,
 * ARIA describedby). The content portals to body, so it stamps the inherited
 * vertical on itself. Client leaf — one per tooltip, no animation runtime.
 */
export function SpecTooltip({ label, children }: { label: ReactNode; children: ReactNode }) {
  const [anchorRef, vertical] = useInheritedVertical<HTMLButtonElement>();
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            ref={anchorRef}
            type="button"
            aria-label={`Definition: ${typeof label === "string" ? label : "term"}`}
            className="focus-ring inline-flex size-[1.25em] shrink-0 cursor-help items-center justify-center rounded-badge text-muted transition-colors duration-interactive ease-spring hover:text-foreground"
          >
            <Info size="1em" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            data-vertical={vertical}
            side="top"
            align="start"
            sideOffset={6}
            collisionPadding={12}
            className="z-50 max-w-[18rem] rounded-interactive border-surface-w border-border bg-surface px-row-pad py-[calc(var(--space-row-pad)*0.75)] text-sm leading-relaxed text-foreground shadow-overlay"
          >
            {children}
            <Tooltip.Arrow className="fill-surface" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
