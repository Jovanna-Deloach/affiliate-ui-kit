import { Menu, Search } from "lucide-react";

import { cn } from "@/lib/cn";
import type { SiteChrome } from "@/kit/types";

/**
 * The masthead. Wordmark, five sections, search, sign in. On phones the
 * sections move into a native disclosure (no script) under the menu button.
 */
export function SiteHeader({ site, className }: { site: SiteChrome; className?: string }) {
  return (
    <header className={cn("relative border-b border-line bg-paper", className)}>
      <div className="kit-well flex h-16 items-center gap-10">
        <a href={site.publication.href} className="kit-focus kit-wordmark rounded-ctl text-fg">
          {site.publication.name}
        </a>
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="m-0 flex list-none gap-8 p-0">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  className={cn(
                    "kit-focus rounded-ctl t-ui transition-colors duration-(--dur) ease-(--ease) hover:text-fg",
                    item.current ? "text-fg" : "text-fg-muted",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <a href="#search" aria-label="Search" className="kit-focus grid size-10 place-items-center rounded-ctl text-fg-muted transition-colors duration-(--dur) hover:text-fg">
            <Search size={20} strokeWidth={1.75} aria-hidden="true" />
          </a>
          <a href="#sign-in" className="kit-focus hidden rounded-ctl px-3 t-ui text-fg sm:inline-flex">
            Sign in
          </a>
          <details className="group lg:hidden">
            <summary className="kit-focus grid size-10 cursor-pointer list-none place-items-center rounded-ctl text-fg [&::-webkit-details-marker]:hidden">
              <Menu size={22} strokeWidth={1.75} aria-hidden="true" />
              <span className="sr-only">Menu</span>
            </summary>
            <nav aria-label="Sections" className="absolute inset-x-0 top-full z-40 border-b border-line bg-paper">
              <ul className="kit-well m-0 flex list-none flex-col py-2">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="kit-focus block border-b border-line py-4 t-ui text-fg last:border-0">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
