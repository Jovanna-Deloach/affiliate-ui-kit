"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { Check, CircleAlert, X } from "lucide-react";
import type { ReactNode } from "react";

export interface ToastProviderProps {
  /** How long a toast stays, in milliseconds (default 5000). Hovering or focusing it pauses the timer. */
  duration?: number;
  /** The page, or the part of it that shows toasts. */
  children: ReactNode;
}

/**
 * Where toasts appear: bottom center on a phone, bottom right on a wide
 * screen. Put it once near the root, inside the element that carries
 * `data-theme`. F8 moves focus to the toasts.
 *
 * @summary The place toasts appear; once per page, inside the themed root.
 * @import import { ToastProvider } from "@/kit/ui";
 */
export function ToastProvider({ duration = 5000, children }: ToastProviderProps) {
  return (
    <RadixToast.Provider duration={duration} swipeDirection="down" label="Notifications (F8)">
      {children}
      <RadixToast.Viewport className="fixed inset-x-0 bottom-0 z-50 m-0 flex list-none flex-col gap-2 p-4 outline-none sm:left-auto sm:w-96" />
    </RadixToast.Provider>
  );
}

export interface ToastProps {
  /** Shown, when the page keeps the state (with `onOpenChange`): set it after the action succeeds. */
  open: boolean;
  /** Called when it closes: on its own after `duration`, on swipe, or with its close button. */
  onOpenChange: (open: boolean) => void;
  /** What happened, past tense, a few words: “Price alert set”. */
  title: string;
  /** One more line when it helps: “We’ll email you below $19.” */
  description?: ReactNode;
  /** One way to act on it (“Undo”, “View saved”), with an `onClick`. */
  action?: { label: string; onClick: () => void };
  /** `success` a check (default) · `error` an alert icon, for something that failed and can be retried. */
  tone?: "success" | "error";
}

/**
 * A short confirmation after an action, in ink with white type (its focus
 * ring is white too, to show on the ink), that leaves
 * on its own: saved, alert set, link copied. Screen readers announce it
 * without moving focus. Render it inside a `ToastProvider`.
 *
 * **Use it for** confirming an action the reader just took, with at most one
 * follow-up (“Undo”). **Not for** warnings about a product (`Alert`), errors
 * in a form (show them on the field), or anything the reader must act on
 * (`Dialog`).
 *
 * @summary A confirmation after an action that leaves on its own: Saved, Alert set.
 * @import import { Toast } from "@/kit/ui";
 */
export function Toast({ open, onOpenChange, title, description, action, tone = "success" }: ToastProps) {
  const Icon = tone === "error" ? CircleAlert : Check;
  return (
    <RadixToast.Root
      open={open}
      onOpenChange={onOpenChange}
      className="kit-pop flex items-start gap-3 rounded-box bg-fg py-3 pr-2 pl-4 text-paper data-[swipe=end]:translate-y-(--radix-toast-swipe-end-y) data-[swipe=move]:translate-y-(--radix-toast-swipe-move-y)"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={2} className="mt-0.5 shrink-0" />
      <div className="grid min-w-0 flex-1 gap-0.5">
        <RadixToast.Title className="t-ui font-semibold">{title}</RadixToast.Title>
        {description ? <RadixToast.Description className="t-small opacity-80">{description}</RadixToast.Description> : null}
      </div>
      {action ? (
        <RadixToast.Action altText={action.label} asChild>
          <button type="button" onClick={action.onClick} className="min-h-11 shrink-0 cursor-pointer rounded-ctl px-3 t-button text-paper underline-offset-4 hover:underline outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
            {action.label}
          </button>
        </RadixToast.Action>
      ) : null}
      <RadixToast.Close aria-label="Dismiss" className="-my-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full opacity-80 hover:opacity-100 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper">
        <X aria-hidden="true" size={16} strokeWidth={2} />
      </RadixToast.Close>
    </RadixToast.Root>
  );
}
