"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import type { ReactElement, ReactNode } from "react";

import { useThemeRoot } from "@/kit/lib/theme-root";

export interface TooltipProps {
  /** A few words naming what the control does: “Save this product”. */
  content: ReactNode;
  /** The one control it names: an icon button, rendered as is. */
  children: ReactElement;
  /** Where it opens; it flips when there is no room (default `top`). */
  side?: "top" | "right" | "bottom" | "left";
  /** Open on load, for a preview; readers open it by hovering or focusing the control. */
  defaultOpen?: boolean;
}

/**
 * A short label that appears on hover and keyboard focus, in ink with white
 * type, for a control that shows only an icon. Touch screens never show it,
 * so it may only repeat what the control already says to assistive
 * technology (its `aria-label`).
 *
 * **Use it for** naming icon-only controls: save, share, close, compare.
 * **Not for** anything a reader needs to know, such as what a review label
 * or a grade means (`Explainer` opens on tap too), or for links.
 *
 * @summary A hover and focus label that names an icon-only control.
 * @import import { Tooltip } from "@/kit/ui";
 */
export function Tooltip({ content, children, side = "top", defaultOpen }: TooltipProps) {
  const [anchor, container] = useThemeRoot();
  return (
    <RadixTooltip.Provider delayDuration={300} skipDelayDuration={200}>
      <RadixTooltip.Root defaultOpen={defaultOpen}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        {anchor}
        <RadixTooltip.Portal container={container}>
          <RadixTooltip.Content side={side} sideOffset={6} collisionPadding={8} className="kit-pop z-50 max-w-64 rounded-ctl bg-fg px-2.5 py-1.5 t-caption text-paper">
            {content}
            <RadixTooltip.Arrow width={10} height={5} className="fill-fg" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
