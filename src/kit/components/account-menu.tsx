"use client";

import * as Menu from "@radix-ui/react-dropdown-menu";
import { Bell, Bookmark, History, LogIn, LogOut, Settings, UserRound, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useReaderList } from "@/kit/lib/reader";
import { useThemeRoot } from "@/kit/lib/theme-root";
import { Avatar } from "@/kit/ui";

const ITEM = "kit-focus flex min-h-11 cursor-pointer items-center gap-3 rounded-ctl px-3 t-ui text-fg no-underline outline-none data-[highlighted]:bg-well";

function Row({ href, icon: Icon, label, count }: { href: string; icon: LucideIcon; label: string; count?: number }) {
  return (
    <Menu.Item asChild>
      <a href={href} className={ITEM}>
        <Icon aria-hidden="true" size={18} strokeWidth={1.75} className="text-fg-muted" />
        <span className="flex-1">{label}</span>
        {count ? (
          <span data-numeric className="t-caption text-fg-muted">
            {count.toLocaleString("en-US")}
          </span>
        ) : null}
      </a>
    </Menu.Item>
  );
}

export interface AccountMenuProps {
  /** The signed-in reader: their name and portrait. Leave out for a reader without an account. */
  person?: { name: string; avatar?: { src: string; alt: string } };
  /** Where each list lives: saved items, history, price alerts (accounts only) and settings (accounts only). */
  links: { saved: string; history: string; alerts?: string; settings?: string };
  /** How many saved items and live alerts the account holds. Without an account, the saved count comes from the device. */
  counts?: { saved?: number; alerts?: number };
  /** Where to sign in, for a reader without an account. */
  signInHref?: string;
  /** Signs the reader out (a Server Action), for a signed-in reader. */
  onSignOut?: () => void;
  /** Extra items at the end of the list, before signing in or out. */
  children?: ReactNode;
}

/**
 * The reader’s menu in the masthead: Saved, Alerts, History and Settings,
 * then Sign out. Without an account it says the lists stay on this device
 * and offers Sign in; the saved count is the device’s. Opens on click or
 * Enter, moves with the arrow keys, closes with Escape.
 *
 * **Use it for** the masthead’s `account` slot, once. **Not for** the
 * site’s sections (`SiteHeader`) or a page’s own tabs (`TabLinks`).
 *
 * @summary The reader’s menu: Saved, Alerts, History, Settings, Sign in or out.
 * @import import { AccountMenu } from "@/kit/components";
 */
export function AccountMenu({ person, links, counts, signInHref, onSignOut, children }: AccountMenuProps) {
  const [anchor, container] = useThemeRoot();
  const device = useReaderList("saved");
  const saved = person ? counts?.saved : device.length;
  return (
    <Menu.Root modal={false}>
      <Menu.Trigger className="kit-focus inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full px-2 t-ui text-fg transition-colors duration-(--dur) ease-(--ease) hover:bg-well">
        {person ? (
          <span aria-hidden="true">
            <Avatar person={person} size="sm" />
          </span>
        ) : (
          <UserRound aria-hidden="true" size={20} strokeWidth={1.75} />
        )}
        <span className="sr-only sm:not-sr-only">Account</span>
        {person ? <span className="sr-only">: {person.name}</span> : null}
      </Menu.Trigger>
      {anchor}
      <Menu.Portal container={container}>
        <Menu.Content align="end" sideOffset={6} className="kit-pop kit-card-feature z-50 grid w-64 gap-0.5 p-1.5">
          <div className="grid gap-0.5 px-3 pt-2 pb-2.5">
            <p className="m-0 t-ui font-semibold text-fg">{person ? person.name : "Not signed in"}</p>
            {person ? null : <p className="m-0 t-caption text-fg-muted">Saved items and history stay on this device.</p>}
          </div>
          <Menu.Separator className="mx-1 my-1 h-px bg-line" />
          <Row href={links.saved} icon={Bookmark} label="Saved" count={saved} />
          {person && links.alerts ? <Row href={links.alerts} icon={Bell} label="Price alerts" count={counts?.alerts} /> : null}
          <Row href={links.history} icon={History} label="History" />
          {person && links.settings ? <Row href={links.settings} icon={Settings} label="Settings" /> : null}
          {children}
          <Menu.Separator className="mx-1 my-1 h-px bg-line" />
          {person ? (
            onSignOut ? (
              <Menu.Item onSelect={() => onSignOut()} className={ITEM}>
                <LogOut aria-hidden="true" size={18} strokeWidth={1.75} className="text-fg-muted" />
                Sign out
              </Menu.Item>
            ) : null
          ) : signInHref ? (
            <Menu.Item asChild>
              <a href={signInHref} className={ITEM}>
                <LogIn aria-hidden="true" size={18} strokeWidth={1.75} className="text-fg-muted" />
                Sign in
              </a>
            </Menu.Item>
          ) : null}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
}
