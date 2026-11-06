"use client";

import { useEffect, useState } from "react";

import { Disclosure, DisclosureIcon, DisclosureSummary } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface TocItem {
  /** The `id` of the section’s heading on this page. */
  id: string;
  /** The heading, as it reads on the page (shorten it if it is long). */
  label: string;
  /** `2` a section (default) · `3` a subsection, indented. */
  level?: 2 | 3;
}

export interface TableOfContentsProps {
  /** The page’s sections, in order. */
  items: TocItem[];
  /** The list’s heading (default “On this page”). */
  label?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

function Links({ items, active }: { items: TocItem[]; active?: string }) {
  return (
    <ol className="m-0 grid list-none border-l border-line p-0">
      {items.map((item) => (
        <li key={item.id} className="flex">
          <a
            href={`#${item.id}`}
            aria-current={item.id === active ? "location" : undefined}
            className={cn(
              "kit-focus -ml-px flex min-h-10 flex-1 items-center border-l-2 border-transparent py-1.5 pr-2 t-small text-fg-muted no-underline transition-colors duration-(--dur) ease-(--ease) hover:text-fg",
              item.level === 3 ? "pl-8" : "pl-4",
              item.id === active && "border-accent-category text-fg",
            )}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * The sections of a long page as links: beside the content on a wide screen,
 * staying in view as the reader scrolls and marking the section being read;
 * folded into “On this page” at the top on a phone.
 *
 * **Use it for** long reference pages with five or more sections: an
 * ingredient page, a full lab report, a buying guide. **Not for** a short
 * page, links between pages (`TabLinks`), or the site’s navigation.
 *
 * @summary Links to a long page’s sections; marks the one being read; folds on phones.
 * @import import { TableOfContents } from "@/kit/components";
 */
export function TableOfContents({ items, label = "On this page", className }: TableOfContentsProps) {
  const [active, setActive] = useState<string | undefined>(undefined);

  useEffect(() => {
    const headings = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;
    // The section being read is the last heading that has crossed the top third of the screen.
    const observer = new IntersectionObserver(
      () => {
        const line = window.innerHeight * 0.33;
        const passed = headings.filter((el) => el.getBoundingClientRect().top <= line);
        setActive((passed.at(-1) ?? headings[0])?.id);
      },
      { rootMargin: "0px 0px -66% 0px", threshold: [0, 1] },
    );
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={label} className={cn("lg:sticky lg:top-8", className)}>
      <Disclosure className="lg:hidden">
        <DisclosureSummary className="border-y border-line t-ui font-semibold text-fg">
          {label}
          <DisclosureIcon />
        </DisclosureSummary>
        <div className="pt-3 pb-4">
          <Links items={items} active={active} />
        </div>
      </Disclosure>
      <div className="hidden lg:block">
        <p className="m-0 mb-3 t-micro text-fg-muted">{label}</p>
        <Links items={items} active={active} />
      </div>
    </nav>
  );
}
