"use client";

import * as RadixDialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactElement, ReactNode } from "react";

import { useThemeRoot } from "@/kit/lib/theme-root";
import { cn } from "@/lib/cn";

const WIDTHS = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl" } as const;

export interface DialogProps {
  /** The element that opens it, rendered as is (a `Button`). Leave it out when the page opens the dialog itself (`open`). */
  trigger?: ReactElement;
  /** Open, when the page keeps the state (with `onOpenChange`). */
  open?: boolean;
  /** Open on load, when the dialog keeps its own state. */
  defaultOpen?: boolean;
  /** Called when the reader opens or closes it (close button, Escape, a click outside). */
  onOpenChange?: (open: boolean) => void;
  /** What the dialog is for, as a short heading: “Write a review”. */
  title: string;
  /** One sentence under the title, read out with it. */
  description?: ReactNode;
  /** The body: a form, a list. It scrolls when taller than the screen. */
  children: ReactNode;
  /** Actions at the bottom, right-aligned: Cancel, then the main action. */
  footer?: ReactNode;
  /** `sm` 28rem · `md` 36rem (default) · `lg` 48rem. */
  size?: keyof typeof WIDTHS;
}

/**
 * A task that needs the reader’s whole attention, over a dimmed page: writing
 * a review, setting a price alert, signing in to save. Focus moves in and
 * stays until it closes; Escape, the close button or a click outside closes
 * it, and focus returns to what opened it.
 *
 * **Use it for** a short task the page cannot hold. **Not for** filters on a
 * phone or a long list (`Drawer`), an explanation (`Explainer`), a
 * confirmation that needs no answer (`Toast`), or anything that blocks
 * reading on page load.
 *
 * @summary A task over a dimmed page: write a review, set an alert, sign in.
 * @import import { Dialog } from "@/kit/ui";
 */
export function Dialog({ trigger, open, defaultOpen, onOpenChange, title, description, children, footer, size = "md" }: DialogProps) {
  const [anchor, container] = useThemeRoot();
  return (
    <RadixDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      {anchor}
      <RadixDialog.Portal container={container}>
        <RadixDialog.Overlay className="kit-scrim fixed inset-0 z-50 grid place-items-center overflow-y-auto p-4">
          <RadixDialog.Content
            // With no description, say so, so Radix does not point at one that is not there.
            {...(description ? {} : { "aria-describedby": undefined })}
            className={cn("kit-pop kit-card-feature relative flex max-h-[calc(100dvh-2rem)] w-full flex-col focus:outline-none", WIDTHS[size])}
          >
            <header className="grid gap-1 px-6 pt-6 pr-16">
              <RadixDialog.Title className="m-0 t-name text-fg">{title}</RadixDialog.Title>
              {description ? <RadixDialog.Description className="m-0 t-small text-fg-muted">{description}</RadixDialog.Description> : null}
            </header>
            <div className="min-h-0 overflow-y-auto px-6 pt-4 pb-6">{children}</div>
            {footer ? <footer className="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-4">{footer}</footer> : null}
            {/* Last in the DOM, so focus lands on the first field, not on Close. */}
            <RadixDialog.Close aria-label="Close" className="kit-focus absolute top-3 right-3 grid size-11 cursor-pointer place-items-center rounded-full text-fg-muted transition-colors duration-(--dur) ease-(--ease) hover:text-fg">
              <X aria-hidden="true" size={18} strokeWidth={1.75} />
            </RadixDialog.Close>
          </RadixDialog.Content>
        </RadixDialog.Overlay>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export interface DialogCloseProps {
  /** The one button that closes the dialog (“Cancel”), rendered as is. */
  children: ReactElement;
}

/**
 * Closes the `Dialog` it is in: wrap the footer’s Cancel button in it.
 *
 * @summary Wraps a button so it closes its Dialog (Cancel).
 * @import import { DialogClose } from "@/kit/ui";
 */
export function DialogClose({ children }: DialogCloseProps) {
  return <RadixDialog.Close asChild>{children}</RadixDialog.Close>;
}
