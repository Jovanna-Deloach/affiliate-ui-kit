import { Menu, Search } from "lucide-react";

import { cn } from "@/lib/cn";
import type { Category, SiteChrome } from "@/kit/types";
import { Disclosure, DisclosureSummary } from "@/kit/ui";

export interface SiteHeaderProps {
  /** The publication’s chrome: its name and home link, and the sections in `nav` (each with an optional `category`). */
  site: SiteChrome;
  /** The page’s section: its nav item gets the 2px marker in the category color and `aria-current="page"`. */
  category?: Category;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The masthead: wordmark, sections, search, sign in. The page’s section
 * carries a 2px marker in the category color, the only place the masthead
 * changes between a publication’s beats. On phones the sections move into a
 * native disclosure (no script) under the menu button.
 *
 * **Use it for** the top of every page, once. **Not for** in-page navigation
 * (jump links) or a breadcrumb (`Breadcrumb`, in the article header).
 *
 * @summary The publication’s masthead: wordmark, sections with the current one marked, menu on phones.
 * @import import { SiteHeader } from "@/kit/blocks";
 */
export function SiteHeader({ site, category, className }: SiteHeaderProps) {
  return (
    <header className={cn("relative border-b border-line bg-ground", className)}>
      <div className="kit-well flex h-16 items-center gap-10">
        <a href={site.publication.href} className="kit-focus kit-wordmark rounded-ctl text-fg">
          {site.publication.name}
        </a>
        <nav aria-label="Sections" className="hidden self-stretch lg:block">
          <ul className="m-0 flex h-full list-none gap-8 p-0">
            {site.nav.map((item) => {
              const current = !!category && item.category === category;
              return (
                <li key={item.href} className="flex">
                  <a
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={cn(
                      "kit-focus flex items-center border-b-2 pt-0.5 t-ui transition-colors duration-(--dur) ease-(--ease) hover:text-fg",
                      current ? "border-accent-category text-fg" : "border-transparent text-fg-muted",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a href="#search" aria-label="Search" className="kit-focus grid size-11 place-items-center rounded-ctl text-fg-muted transition-colors duration-(--dur) hover:text-fg">
            <Search size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href="#sign-in" className="kit-focus hidden min-h-11 items-center rounded-ctl px-3 t-ui text-fg sm:inline-flex">
            Sign in
          </a>
          <Disclosure className="lg:hidden">
            <DisclosureSummary className="grid size-11 place-items-center justify-center rounded-ctl text-fg">
              <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </DisclosureSummary>
            <nav aria-label="Sections (menu)" className="absolute inset-x-0 top-full z-40 border-b border-line bg-ground">
              <ul className="kit-well m-0 flex list-none flex-col py-2">
                {site.nav.map((item) => {
                  const current = !!category && item.category === category;
                  return (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        className={cn("kit-focus block border-b border-line py-4 t-ui last:border-0", current ? "text-accent-category" : "text-fg")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Disclosure>
        </div>
      </div>
    </header>
  );
}
