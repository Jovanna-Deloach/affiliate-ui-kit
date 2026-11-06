import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

import { tabActiveStyles, tabListStyles, tabStyles } from "./tab-styles";

export interface TabLink {
  /** Where it goes: another page (`/creatine/reviews`) or a section of this one (`#reviews`). */
  href: string;
  /** The label: a noun, sentence case. */
  label: ReactNode;
  /** How many items it leads to, in tabular figures. */
  count?: number;
  /** The page or section the reader is on. */
  current?: boolean;
}

export interface TabLinksProps {
  /** What the links move between, for screen readers: “Peak Supply Creatine”. */
  label: string;
  /** The links, in reading order. */
  items: TabLink[];
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Tabs that are links: each one is its own page or a section of this one,
 * with its own address, so search engines and shared links reach it. No
 * script; the current one carries `aria-current`.
 *
 * **Use it for** a product’s Summary, Reviews and Lab results when each has
 * its own page, or a ranking’s Ranking and Report sections. **Not for**
 * panels that swap in place (`Tabs`), or a long page’s own sections
 * (`TableOfContents`).
 *
 * @summary Tabs that are links to pages or sections, each with its own address.
 * @import import { TabLinks } from "@/kit/ui";
 */
export function TabLinks({ label, items, className }: TabLinksProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className={cn("m-0 list-none p-0", tabListStyles)}>
        {items.map((item) => (
          <li key={item.href} className="flex">
            <a href={item.href} aria-current={item.current ? "page" : undefined} className={cn(tabStyles, "no-underline", item.current && tabActiveStyles)}>
              {item.label}
              {item.count !== undefined ? (
                <span data-numeric className="t-caption text-fg-muted">
                  {item.count.toLocaleString("en-US")}
                </span>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
