"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import type { AffiliateAttribution } from "@/types/affiliate";
import type { NavLink, NavVertical } from "@/types/navigation";

import { MegaMenuEditorialPanel } from "./mega-menu-editorial-panel";

/**
 * <MegaMenu />
 * ---------------------------------------------------------------------------
 * The Radix NavigationMenu host for <MegaMenuEditorialPanel />: one trigger
 * per vertical on the masthead row, plus plain utility links, and a shared
 * full-bleed viewport under the row. Hover (with Radix's open delay), focus
 * and arrow keys open the panels; Esc closes.
 *
 * Mount it inside a `position: relative` masthead — the viewport is
 * `absolute inset-x-0 top-full`, so it spans the masthead's full width and
 * the panel's own page well re-aligns its columns with the masthead's.
 * Triggers are `--size-masthead` tall so the open rule sits on the
 * masthead's bottom hairline.
 *
 * 21st.dev physics (wensity/navigation-menu, sanitized): shared viewport,
 * [data-state]-gated enter/exit (menu-panel), chevron rotation on open,
 * height transition between panels. All CSS, all token-timed.
 */

const itemClass = cn(
  "focus-ring group/trigger relative inline-flex h-masthead cursor-pointer items-center gap-hairline px-cluster",
  "text-body-sm font-medium text-ink-secondary transition-colors duration-interactive ease-standard",
  "hover:text-ink data-[state=open]:text-ink",
  // The open rule: a 2px ink bar on the masthead's bottom hairline.
  "after:absolute after:inset-x-cluster after:bottom-0 after:h-[var(--border-width-emphasis)] after:bg-ink after:opacity-0 after:content-['']",
  "after:transition-opacity after:duration-interactive after:ease-standard data-[state=open]:after:opacity-100",
);

export interface MegaMenuProps extends Omit<ComponentProps<typeof NavigationMenu.Root>, "children"> {
  verticals: NavVertical[];
  /** Plain links after the menus ("How we test", "Tools"). */
  utilityLinks?: NavLink[];
  attribution?: AffiliateAttribution;
  placement?: string;
  /** Classes for the full-bleed viewport (the dropdown surface). */
  viewportClassName?: string;
}

export function MegaMenu({
  verticals,
  utilityLinks = [],
  attribution,
  placement = "mega-menu",
  viewportClassName,
  className,
  ...props
}: MegaMenuProps) {
  return (
    <NavigationMenu.Root data-slot="mega-menu" className={cn("static", className)} {...props}>
      <NavigationMenu.List className="m-0 flex list-none items-center gap-hairline p-0">
        {verticals.map((vertical) => (
          <NavigationMenu.Item key={vertical.id} value={vertical.id}>
            <NavigationMenu.Trigger className={itemClass}>
              {vertical.label}
              <ChevronDown
                size="1em"
                strokeWidth={1.5}
                aria-hidden="true"
                className="text-ink-tertiary transition-transform duration-interactive ease-standard group-data-[state=open]/trigger:rotate-180"
              />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content className="menu-panel absolute inset-x-0 top-0 w-full">
              <MegaMenuEditorialPanel vertical={vertical} attribution={attribution} placement={placement} />
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
        {utilityLinks.map((link) => (
          <NavigationMenu.Item key={link.href}>
            <NavigationMenu.Link href={link.href} className={itemClass}>
              {link.label}
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>

      <div data-slot="mega-menu-viewport" className="absolute inset-x-0 top-full z-40">
        <NavigationMenu.Viewport
          className={cn(
            "menu-panel relative h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden",
            "border-b border-hairline bg-surface shadow-elevated",
            "transition-[height] duration-interactive ease-standard",
            viewportClassName,
          )}
        />
      </div>
    </NavigationMenu.Root>
  );
}
