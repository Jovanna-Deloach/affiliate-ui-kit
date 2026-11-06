"use client";

import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { Drawer as Vaul } from "vaul";

import { useThemeRoot } from "@/kit/lib/theme-root";
import { cn } from "@/lib/cn";

export interface DrawerProps {
  /** The element that opens it, rendered as is (a `Button`: “Filters”). */
  trigger?: ReactElement;
  /** Open, when the page keeps the state (with `onOpenChange`). */
  open?: boolean;
  /** Open on load, when the drawer keeps its own state. */
  defaultOpen?: boolean;
  /** Called when the reader opens or closes it (close button, swipe, Escape, a tap outside). */
  onOpenChange?: (open: boolean) => void;
  /** `bottom` a sheet from the bottom edge, for phones (default) · `right` a panel from the right, for wide screens. */
  side?: "bottom" | "right";
  /** What it holds, as a short heading: “Filter reviews”. */
  title: string;
  /** One sentence under the title, read out with it. */
  description?: ReactNode;
  /** The body; it scrolls inside the drawer. */
  children: ReactNode;
  /** Actions pinned at the bottom: “Show 48 reviews”, “Clear all”. */
  footer?: ReactNode;
}

/**
 * A sheet that slides in from the bottom edge (or the right) over a dimmed
 * page, and swipes away. It holds what a phone screen cannot show beside the
 * content: filters, a sort, a list of retailers.
 *
 * **Use it for** filters and long lists on phones, and a side panel of
 * filters on wide screens. **Not for** a short task that needs full attention
 * (`Dialog`), or filters that fit beside the list on a wide screen (show them
 * inline there).
 *
 * @summary A sheet from the bottom edge (or right) for filters and long lists.
 * @import import { Drawer } from "@/kit/ui";
 */
export function Drawer({ trigger, open, defaultOpen, onOpenChange, side = "bottom", title, description, children, footer }: DrawerProps) {
  const [anchor, container] = useThemeRoot();
  return (
    <Vaul.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} direction={side}>
      {trigger ? <Vaul.Trigger asChild>{trigger}</Vaul.Trigger> : null}
      {anchor}
      <Vaul.Portal container={container}>
        <Vaul.Overlay className="kit-scrim fixed inset-0 z-50" />
        <Vaul.Content
          {...(description ? {} : { "aria-describedby": undefined })}
          className={cn(
            "fixed z-50 flex flex-col bg-paper focus:outline-none",
            side === "bottom" ? "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-box border-t border-line" : "inset-y-0 right-0 w-full max-w-md border-l border-line",
          )}
        >
          {side === "bottom" ? <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-strong" /> : null}
          <header className="grid gap-1 px-5 pt-4 pr-16">
            <Vaul.Title className="m-0 t-name text-fg">{title}</Vaul.Title>
            {description ? <Vaul.Description className="m-0 t-small text-fg-muted">{description}</Vaul.Description> : null}
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-4 pb-6">{children}</div>
          {footer ? <footer className="flex flex-wrap gap-3 border-t border-line px-5 py-4 [&>*]:flex-1">{footer}</footer> : null}
          {/* Last in the DOM, so focus lands on the first choice, not on Close. */}
          <Vaul.Close
            aria-label="Close"
            className={cn(
              "kit-focus absolute right-2 grid size-11 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:text-fg",
              side === "bottom" ? "top-5" : "top-2",
            )}
          >
            <X aria-hidden="true" size={18} strokeWidth={1.75} />
          </Vaul.Close>
        </Vaul.Content>
      </Vaul.Portal>
    </Vaul.Root>
  );
}

export interface DrawerCloseProps {
  /** The one button that closes the drawer (“Show 48 reviews”), rendered as is. */
  children: ReactElement;
}

/**
 * Closes the `Drawer` it is in: wrap the footer’s “Show 48 reviews” button
 * in it, so applying the filters also closes the sheet.
 *
 * @summary Wraps a button so it closes its Drawer (Show results, Cancel).
 * @import import { DrawerClose } from "@/kit/ui";
 */
export function DrawerClose({ children }: DrawerCloseProps) {
  return <Vaul.Close asChild>{children}</Vaul.Close>;
}
