"use client";

import * as Popover from "@radix-ui/react-popover";
import { Info, X } from "lucide-react";
import { useRef, type ReactElement, type ReactNode } from "react";

import { useThemeRoot } from "@/kit/lib/theme-root";
import { cn } from "@/lib/cn";

export interface ExplainerProps {
  /** What the reader asks, for screen readers and the default trigger: “What does Verified mean?” */
  label: string;
  /** A title over the explanation, in micro-caps: the term explained (“Verified review”). */
  title?: string;
  /** The explanation: a sentence or two, and a link to the full method if there is one. */
  children: ReactNode;
  /** The element that opens it, rendered as is (a `Badge` or a button). Default: an info icon. */
  trigger?: ReactElement;
  /** Where it opens; it flips when there is no room (default `bottom`). */
  side?: "top" | "right" | "bottom" | "left";
  /** Open on load, for a preview; readers open it with a tap. */
  defaultOpen?: boolean;
  /** Placement of the default trigger only: margin. */
  className?: string;
}

/**
 * An explanation that opens on tap, click or Enter, beside the term it
 * explains: what a review label means, how a grade is worked out, where a
 * limit comes from. It closes on Escape, on a tap outside, or with its
 * close button.
 *
 * **Use it for** the meaning of a label, grade, score or measurement, kept
 * one tap away so the page stays clean. **Not for** naming an icon button
 * (`Tooltip`), anything a reader must read before deciding (put it on the
 * page), or a form (`Dialog`).
 *
 * @summary An explanation one tap away: what a label, grade or score means.
 * @import import { Explainer } from "@/kit/ui";
 */
export function Explainer({ label, title, children, trigger, side = "bottom", defaultOpen, className }: ExplainerProps) {
  const [anchor, container] = useThemeRoot();
  // Opened for a preview, it must not pull focus (and the page’s scroll) to itself on load.
  const preview = useRef(Boolean(defaultOpen));
  return (
    <Popover.Root defaultOpen={defaultOpen}>
      <Popover.Trigger asChild aria-label={trigger ? undefined : label}>
        {trigger ?? (
          <button
            type="button"
            className={cn(
              "kit-focus inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full align-middle text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:text-fg",
              className,
            )}
          >
            <Info aria-hidden="true" size={16} strokeWidth={1.75} />
          </button>
        )}
      </Popover.Trigger>
      {anchor}
      <Popover.Portal container={container}>
        <Popover.Content
          side={side}
          sideOffset={6}
          collisionPadding={12}
          aria-label={title ? undefined : label}
          onOpenAutoFocus={(event) => {
            if (preview.current) event.preventDefault();
            preview.current = false;
          }}
          className="kit-pop kit-card-feature z-50 w-[min(20rem,calc(100vw-1.5rem))] p-4 kit-focus"
        >
          <div className="flex items-start justify-between gap-3">
            {title ? <p className="m-0 t-micro text-fg-muted">{title}</p> : <span />}
            <Popover.Close aria-label="Close" className="kit-focus -m-1 grid size-6 shrink-0 cursor-pointer place-items-center rounded-full text-fg-muted hover:text-fg">
              <X aria-hidden="true" size={14} strokeWidth={2} />
            </Popover.Close>
          </div>
          <div className="mt-2 t-small text-fg-body [&_a]:kit-link [&_p]:m-0">{children}</div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
