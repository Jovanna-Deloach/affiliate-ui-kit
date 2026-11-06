import { cn } from "@/lib/cn";
import type { SiteChrome } from "@/kit/types";

export interface SiteFooterProps {
  /** The publication’s chrome: name, tagline, the footer’s link columns, the full `disclosure` statement and its link, the copyright line. */
  site: SiteChrome;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The foot of every page: the wordmark and its promise, the link columns,
 * then the full disclosure statement in plain words, with a link to how the
 * publication makes money, and the copyright line.
 *
 * **Use it for** the end of every page, once. It carries the long form of
 * the disclosure; the article header carries the short notice, in different
 * words. **Not for** a section’s summary or a newsletter sign-up.
 *
 * @summary The publication’s footer: link columns and the full disclosure statement.
 * @import import { SiteFooter } from "@/kit/blocks";
 */
export function SiteFooter({ site, className }: SiteFooterProps) {
  return (
    <footer className={cn("mt-chapter border-t border-line bg-ground", className)}>
      <div className="kit-well grid gap-12 py-16 md:grid-cols-12">
        <div className="flex flex-col gap-3 md:col-span-5">
          <a href={site.publication.href} className="kit-focus kit-wordmark self-start rounded-ctl text-fg">
            {site.publication.name}
          </a>
          {site.publication.tagline && <p className="m-0 max-w-xs t-small text-fg-muted">{site.publication.tagline}</p>}
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          {site.footer.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="m-0 t-small font-medium text-fg">{col.heading}</h2>
              <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="kit-focus rounded-ctl t-small text-fg-muted transition-colors duration-(--dur) hover:text-fg">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="kit-well flex flex-col gap-3 pb-12 md:flex-row md:items-baseline md:justify-between">
        <p className="m-0 max-w-[40rem] t-caption text-fg-muted">
          {site.disclosure}{" "}
          <a href={site.disclosureHref} className="kit-focus kit-link rounded-ctl text-fg">
            How we make money
          </a>
        </p>
        <p className="m-0 t-caption text-fg-muted">{site.copyright}</p>
      </div>
    </footer>
  );
}
