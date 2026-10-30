"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDate, initials } from "@/lib/format";
import { useInheritedVertical } from "@/lib/use-inherited-vertical";
import { Button } from "@/primitives/button";
import { StatusPill } from "@/primitives/status-pill";
import type { AccountMenuItem, Member } from "@/types/account";

/**
 * <AccountMenuPopover />
 * ---------------------------------------------------------------------------
 * The masthead account menu (Radix DropdownMenu, 280px) in three
 * hairline-divided zones:
 *
 *   ┌──────────────────────────────┐
 *   │ [JD] Jovanna Deloach         │  1 · identity + verified pill
 *   │      jovanna@…  ● Verified   │
 *   ├──────────────────────────────┤
 *   │ Saved dossier           [12] │  2 · rows, counters on the right
 *   │ Active price watches     [4] │     keyline in the metric voice
 *   │ Personalization profile      │
 *   ├──────────────────────────────┤
 *   │ Sign out                   ⇥ │  3 · recessed footer
 *   └──────────────────────────────┘
 *
 *   --size-popover                           width
 *   --radius-container / --shadow-overlay    surface
 *   --inset-card-compact / --row-y           zone insets · row rhythm
 *   --surface-recessed                       footer
 *
 * Mobbin anatomy (Etsy, YouTube, Webflow account menus): identity block
 * first, grouped rows, sign-out last and visually separate. The trigger is
 * the member's monogram on a ghost control; the portal inherits the
 * vertical from where it opened.
 */

export interface AccountMenuPopoverProps {
  member: Member;
  items: AccountMenuItem[];
  /** Sign-out form target (posted natively). */
  signOutAction: string;
  trigger?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  className?: string;
}

export function AccountMenuPopover({
  member,
  items,
  signOutAction,
  trigger,
  open,
  defaultOpen,
  onOpenChange,
  align = "end",
  className,
}: AccountMenuPopoverProps) {
  const [anchorRef, vertical] = useInheritedVertical();
  return (
    <DropdownMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={false}>
      <span ref={anchorRef} hidden data-slot="menu-anchor" />
      <DropdownMenu.Trigger asChild>
        {trigger ?? (
          <Button intent="ghost" size="sm" aria-label={`Account menu for ${member.name}`} className="px-cluster">
            <Monogram member={member} size="sm" />
            <ChevronDown size="1em" strokeWidth={1.5} aria-hidden="true" className="text-ink-tertiary" />
          </Button>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align={align}
          sideOffset={8}
          collisionPadding={16}
          data-slot="account-menu-popover"
          data-vertical={vertical}
          className={cn(
            "menu-panel z-50 w-popover overflow-hidden rounded-container border border-hairline bg-surface text-ink shadow-overlay outline-none",
            className,
          )}
        >
          {/* Zone 1 · identity */}
          <div data-slot="account-identity" className="grid grid-cols-[var(--size-portrait-sm)_minmax(0,1fr)] items-center gap-x-inline border-b border-hairline p-card-compact">
            <Monogram member={member} size="md" />
            <div className="flex min-w-0 flex-col gap-hairline">
              <span className="truncate text-body-sm font-medium text-ink">{member.name}</span>
              <span className="truncate text-caption text-ink-tertiary">{member.email}</span>
              <span className="flex flex-wrap items-center gap-cluster pt-hairline">
                {member.verified ? (
                  <StatusPill tone="positive" size="sm">
                    Verified
                  </StatusPill>
                ) : (
                  <StatusPill tone="caution" size="sm">
                    Unverified
                  </StatusPill>
                )}
                {member.memberSince && <span className="text-caption text-ink-tertiary">Since {formatDate(member.memberSince)}</span>}
              </span>
            </div>
          </div>

          {/* Zone 2 · rows */}
          <DropdownMenu.Group className="flex flex-col py-cluster">
            {items.map((item) => (
              <DropdownMenu.Item key={item.id} asChild>
                <a
                  href={item.href}
                  className={cn(
                    "grid h-control cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack px-card-compact outline-none",
                    "text-body-sm text-ink transition-colors duration-interactive ease-standard data-highlighted:bg-recessed",
                  )}
                >
                  <span className="truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className="type-metric min-w-[2ch] rounded-tag border border-hairline bg-recessed px-tag-x py-tag-y text-center text-caption text-ink-secondary">
                      {item.count}
                    </span>
                  )}
                </a>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Group>

          {/* Zone 3 · recessed footer */}
          <form action={signOutAction} method="post" className="border-t border-hairline bg-recessed px-bar-x py-bar-y">
            <DropdownMenu.Item asChild>
              <button
                type="submit"
                className="focus-ring grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack rounded-control text-left text-body-sm font-medium text-ink-secondary outline-none transition-colors duration-interactive ease-standard data-highlighted:text-ink"
              >
                Sign out
                <LogOut size="1em" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </DropdownMenu.Item>
          </form>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function Monogram({ member, size }: { member: Member; size: "sm" | "md" }) {
  return (
    <span
      data-slot="account-monogram"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-inner border border-hairline bg-recessed font-semibold text-ink",
        size === "sm" ? "size-[calc(var(--size-control)-var(--space-3))] text-caption" : "size-portrait-sm text-caption",
      )}
    >
      {member.avatar ? <Image src={member.avatar.src} alt="" fill sizes="56px" className="object-cover" /> : initials(member.name)}
    </span>
  );
}
