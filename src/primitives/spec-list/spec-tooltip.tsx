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
            className="focus-ring inline-flex size-[1.25em] shrink-0 cursor-help items-center justify-center rounded-tag text-ink-tertiary transition-colors duration-interactive ease-standard hover:text-ink"
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
            className="z-50 max-w-[18rem] rounded-inner border border-hairline bg-surface px-stack py-cluster text-body-sm text-ink shadow-overlay"
          >
            {children}
            <Tooltip.Arrow className="fill-surface" width={10} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
