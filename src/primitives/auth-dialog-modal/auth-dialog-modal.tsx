"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Bell, Bookmark, type LucideIcon, Mail, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/cn";
import { useInheritedVertical } from "@/lib/use-inherited-vertical";
import { Button } from "@/primitives/button";

/**
 * <AuthDialogModal />
 * ---------------------------------------------------------------------------
 * Split 12-column sign-in dialog (max 760px):
 *
 *   ┌ 1 ──────────── 5 ┬ 6 ─────────────────────── 12 ┐
 *   │ Plane 2          │ Plane 1                      ✕ │
 *   │ Wordmark         │ Sign in or create an account   │
 *   │ ✓ Save products  │ EMAIL                          │
 *   │ ✓ Price alerts   │ [ you@example.com            ] │
 *   │ ✓ Sync presets   │ [ Email me a sign-in link    ] │
 *   │                  │ ─────────── or ─────────────   │
 *   │ ⛨ privacy note   │ [ Continue with Google       ] │
 *   │                  │ [ Continue with Apple        ] │
 *   │                  │ terms …                        │
 *   └──────────────────┴────────────────────────────────┘
 *
 *   --size-dialog                         the width
 *   --surface-recessed / --surface-primary left · right planes
 *   --inset-card-spacious                  both panes (32px)
 *   --radius-container / --border-hairline frame
 *   --scrim / --shadow-overlay             backdrop · elevation
 *
 * Mobbin anatomy (Recraft, Midday, lululemon sign-in): one email field +
 * one primary action, an "or" rule, then provider buttons, terms last.
 * Below a 42rem container the panes stack with the benefits first.
 *
 * Provider buttons are plain outline controls with an `icon` slot: ship the
 * providers' official marks per their brand guidelines; nothing is drawn
 * here. The magic-link form posts natively to `magicLink.action`.
 */

export interface AuthBenefit {
  id: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export interface AuthProvider {
  id: string;
  label: string;
  /** Form action or href the provider flow starts from. */
  action: string;
  icon?: ReactNode;
}

export interface AuthDialogModalProps {
  publication: { name: string; tagline?: string };
  benefits: AuthBenefit[];
  privacyNote?: ReactNode;
  magicLink: { action: string; label?: string };
  providers?: AuthProvider[];
  terms?: ReactNode;
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const DEFAULT_ICONS: LucideIcon[] = [Bookmark, Bell, SlidersHorizontal];

export function AuthDialogModal({
  publication,
  benefits,
  privacyNote = "We never sell or share your email. One sign-in link, no password to remember.",
  magicLink,
  providers = [],
  terms,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: AuthDialogModalProps) {
  const [anchorRef, vertical] = useInheritedVertical();
  const panelRef = useRef<HTMLDivElement>(null);
  return (
    <Dialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <span ref={anchorRef} hidden data-slot="dialog-anchor" />
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        {/* flex + m-auto centres the panel yet never clips its top when it is taller than the viewport */}
        <Dialog.Overlay className="sheet-scrim fixed inset-0 z-50 flex overflow-y-auto p-card">
          <Dialog.Content
            ref={panelRef}
            tabIndex={-1}
            onOpenAutoFocus={(e) => {
              e.preventDefault();
              panelRef.current?.querySelector<HTMLInputElement>("input[type=email]")?.focus();
            }}
            data-slot="auth-dialog-modal"
            data-vertical={vertical}
            className={cn(
              "menu-panel @container relative m-auto w-full max-w-dialog overflow-hidden rounded-container border border-hairline bg-surface text-ink shadow-overlay outline-none",
              className,
            )}
          >
            <div className="grid grid-cols-1 @2xl:grid-cols-12">
              {/* Cols 1–5 · Plane 2 · membership */}
              {/* Stacked (phone): the form first, the pitch second. */}
              <aside data-slot="auth-benefits" className="order-2 flex min-w-0 flex-col gap-section border-t border-hairline bg-recessed p-card-spacious @2xl:order-1 @2xl:col-span-5 @2xl:border-t-0">
                <div className="flex flex-col gap-hairline">
                  <p className="type-title m-0">{publication.name}</p>
                  {publication.tagline && <p className="m-0 text-caption text-ink-tertiary">{publication.tagline}</p>}
                </div>
                <ul className="m-0 flex list-none flex-col divide-y divide-hairline border-y border-hairline p-0">
                  {benefits.map((benefit, i) => {
                    const Icon = benefit.icon ?? DEFAULT_ICONS[i % DEFAULT_ICONS.length]!;
                    return (
                      <li key={benefit.id} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-inline py-row">
                        <Icon size="1.1em" strokeWidth={1.5} aria-hidden="true" className="mt-[0.2em] text-ink-secondary" />
                        <span className="flex min-w-0 flex-col gap-hairline">
                          <span className="text-body-sm font-medium text-ink">{benefit.title}</span>
                          {benefit.description && <span className="text-caption text-ink-secondary">{benefit.description}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <p className="m-0 mt-auto grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-cluster text-caption text-ink-tertiary">
                  <ShieldCheck size="1.1em" strokeWidth={1.5} aria-hidden="true" className="mt-[0.1em] text-positive-ink" />
                  <span>{privacyNote}</span>
                </p>
              </aside>

              {/* Cols 6–12 · Plane 1 · sign-in */}
              <div data-slot="auth-form" className="order-1 flex min-w-0 flex-col gap-stack p-card-spacious @2xl:order-2 @2xl:col-span-7">
                <div className="grid grid-cols-[minmax(0,1fr)_var(--size-control)] items-start gap-x-stack">
                  <div className="flex min-w-0 flex-col gap-hairline">
                    <Dialog.Title className="type-title m-0">Sign in or create an account</Dialog.Title>
                    <Dialog.Description className="m-0 text-body-sm text-ink-secondary">
                      One link by email. No password, no newsletter unless you ask.
                    </Dialog.Description>
                  </div>
                  <Dialog.Close
                    aria-label="Close"
                    className="focus-ring -mt-cluster -mr-cluster flex size-control cursor-pointer items-center justify-center rounded-control text-ink-secondary transition-colors duration-interactive ease-standard hover:bg-recessed hover:text-ink"
                  >
                    <X size="1.25em" strokeWidth={1.5} aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <form action={magicLink.action} method="post" data-slot="magic-link" className="flex flex-col gap-cluster">
                  <label htmlFor="auth-email" className="type-eyebrow text-ink-tertiary">
                    Email
                  </label>
                  <input id="auth-email" type="email" name="email" required autoComplete="email" placeholder="you@example.com" className="control-field" />
                  <Button type="submit" width="full" size="lg" className="mt-hairline">
                    <Mail size="1.1em" strokeWidth={1.5} aria-hidden="true" />
                    {magicLink.label ?? "Email me a sign-in link"}
                  </Button>
                </form>

                {providers.length > 0 && (
                  <>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-stack" aria-hidden="true">
                      <span className="border-t border-hairline" />
                      <span className="type-eyebrow text-ink-tertiary">or</span>
                      <span className="border-t border-hairline" />
                    </div>
                    <ul className="m-0 flex list-none flex-col gap-cluster p-0" aria-label="Other ways to sign in">
                      {providers.map((provider) => (
                        <li key={provider.id}>
                          <form action={provider.action} method="post">
                            <Button type="submit" intent="outline" width="full" size="lg">
                              {provider.icon}
                              {provider.label}
                            </Button>
                          </form>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {terms && <p className="m-0 text-caption text-ink-tertiary">{terms}</p>}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
