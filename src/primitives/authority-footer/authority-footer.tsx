import { Check } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import { Button } from "@/primitives/button";
import type { ComplianceCopy, DirectoryColumn, NavLink, TrustStat } from "@/types/navigation";

/**
 * <AuthorityFooter />
 * ---------------------------------------------------------------------------
 * Full-width architectural footer in three horizontal planes:
 *
 *   ┌ Band 1 · Plane 2 (recessed) ────────────────────────────────────────┐
 *   │ 14,200+     │ 480+        │ 0           │ ISO 17025 ┃ LAB NOTES     │
 *   │ LAB HOURS   │ ASSAYED     │ SPONSORED   │ PARTNER   ┃ [email][Sub.] │
 *   ├ Band 2 · Plane 1 ───────────────────────────────────────────────────┤
 *   │ Wordmark    │ CATEGORIES │ GUIDES │ TOOLS │ ABOUT │ LEGAL           │
 *   │ tagline     │ links …    │ …      │ …     │ …     │ …               │
 *   ├ Band 3 · Plane 2 ───────────────────────────────────────────────────┤
 *   │ AFFILIATE DISCLOSURE · prose     │ INDEPENDENCE CHARTER · ✓ ✓ ✓     │
 *   │ © 2026 …                                     Privacy · Terms · …    │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 *   --surface-recessed / --surface-primary   the three planes
 *   --measure-page / --inset-page-x          every band shares one page well
 *   --gap-section / --gap-grid               band rhythm · column gutters
 *   --border-hairline                        band rules + stat dividers
 *   type-metric text-title / type-eyebrow    stat value · stat label
 *
 * Mobbin anatomy (Zendesk, In Common With, Lightship footers): a
 * hairline-ruled directory, a newsletter field + control on one line, legal
 * links and fine print on the lowest band. Server Component; the newsletter
 * form posts natively to `newsletter.action` — no client leaf.
 */

export interface AuthorityFooterProps extends Omit<ComponentProps<"footer">, "children"> {
  publication: { name: string; tagline?: string; href: string };
  stats: TrustStat[];
  directory: DirectoryColumn[];
  compliance: ComplianceCopy;
  newsletter?: {
    action: string;
    heading?: string;
    description?: string;
    ctaLabel?: string;
  };
}

export function AuthorityFooter({
  publication,
  stats,
  directory,
  compliance,
  newsletter,
  className,
  ...props
}: AuthorityFooterProps) {
  return (
    <footer
      data-slot="authority-footer"
      className={cn("@container w-full min-w-0 border-t border-hairline bg-surface text-ink", className)}
      {...props}
    >
      {/* Band 1 · Plane 2 — E-E-A-T stat bar + newsletter */}
      <section data-slot="footer-trust" aria-label="Testing record" className="border-b border-hairline bg-recessed">
        <div
          className={cn(
            "page-well grid grid-cols-1 gap-grid py-section",
            newsletter && "@3xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] @3xl:items-center @3xl:gap-column",
          )}
        >
          <dl className="m-0 grid grid-cols-2 gap-y-stack @md:grid-cols-4 @md:divide-x @md:divide-hairline">
            {stats.map((stat) => (
              <div key={stat.label} className="flex min-w-0 flex-col gap-hairline @md:px-stack @md:first:pl-0">
                <dt className="type-eyebrow order-2 text-ink-tertiary">{stat.label}</dt>
                <dd className="type-metric order-1 m-0 text-title text-ink">{stat.value}</dd>
              </div>
            ))}
          </dl>
          {newsletter && <NewsletterCapture {...newsletter} />}
        </div>
      </section>

      {/* Band 2 · Plane 1 — wordmark + 5-column directory */}
      <section data-slot="footer-directory" aria-label="Site directory">
        <div className="page-well grid grid-cols-2 gap-x-grid gap-y-section py-section @md:grid-cols-3 @3xl:grid-cols-[minmax(0,2fr)_repeat(5,minmax(0,1fr))]">
          <div className="col-span-2 flex min-w-0 flex-col gap-cluster @md:col-span-3 @3xl:col-span-1">
            <a href={publication.href} className="focus-ring type-title self-start rounded-control text-ink">
              {publication.name}
            </a>
            {publication.tagline && <p className="m-0 max-w-prose text-body-sm text-ink-secondary">{publication.tagline}</p>}
          </div>
          {directory.map((column) => (
            <nav key={column.heading} aria-label={column.heading} className="flex min-w-0 flex-col gap-cluster">
              <p className="type-eyebrow m-0 text-ink-tertiary">{column.heading}</p>
              <ul className="m-0 flex list-none flex-col gap-hairline p-0">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </section>

      {/* Band 3 · Plane 2 — disclosure, charter, copyright */}
      <section data-slot="footer-compliance" aria-label="Disclosure and legal" className="border-t border-hairline bg-recessed">
        <div className="page-well flex flex-col gap-stack py-grid">
          <div className="grid grid-cols-1 gap-grid @3xl:grid-cols-2 @3xl:gap-column">
            <div className="flex min-w-0 flex-col gap-cluster">
              <p className="type-eyebrow m-0 text-ink-tertiary">Affiliate disclosure</p>
              <p className="m-0 max-w-prose text-caption leading-body text-ink-secondary">{compliance.disclosure}</p>
            </div>
            <div className="flex min-w-0 flex-col gap-cluster">
              <p className="type-eyebrow m-0 text-ink-tertiary">Independence charter</p>
              <ul className="m-0 flex list-none flex-col gap-hairline p-0">
                {compliance.charter.map((line) => (
                  <li key={line} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-cluster text-caption leading-body text-ink-secondary">
                    <Check size="1em" strokeWidth={1.5} aria-hidden="true" className="mt-[0.3em] text-positive-ink" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-cluster border-t border-hairline pt-stack @md:grid-cols-[minmax(0,1fr)_auto] @md:items-center">
            <p className="m-0 text-caption text-ink-tertiary">{compliance.copyright}</p>
            <ul className="m-0 flex list-none flex-wrap gap-stack p-0">
              {compliance.legalLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink link={link} muted />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </footer>
  );
}

function FooterLink({ link, muted = false }: { link: NavLink; muted?: boolean }) {
  return (
    <a
      href={link.href}
      className={cn(
        "focus-ring rounded-control transition-colors duration-interactive ease-standard hover:text-ink",
        muted ? "text-caption text-ink-tertiary" : "text-body-sm text-ink-secondary",
      )}
    >
      {link.label}
    </a>
  );
}

function NewsletterCapture({
  action,
  heading = "Lab notes, weekly",
  description = "One email a week: what we tested, what failed, and where prices moved. No sponsors, unsubscribe any time.",
  ctaLabel = "Subscribe",
}: NonNullable<AuthorityFooterProps["newsletter"]>) {
  return (
    <form
      action={action}
      method="post"
      data-slot="footer-newsletter"
      className="flex min-w-0 flex-col gap-cluster border-t border-hairline pt-grid @3xl:border-t-0 @3xl:border-l @3xl:pt-0 @3xl:pl-column"
    >
      <label htmlFor="footer-newsletter-email" className="type-eyebrow text-ink-tertiary">
        {heading}
      </label>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-cluster">
        <input
          id="footer-newsletter-email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="focus-ring h-control min-w-0 rounded-control border border-hairline bg-surface px-cell-x text-body-sm text-ink transition-colors duration-interactive ease-standard placeholder:text-ink-tertiary hover:border-strong"
        />
        <Button type="submit">{ctaLabel}</Button>
      </div>
      <p className="m-0 max-w-prose text-caption text-ink-tertiary">{description}</p>
    </form>
  );
}
