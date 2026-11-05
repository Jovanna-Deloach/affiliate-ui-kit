import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";
import type { RoundupGuide } from "@/kit/types";

import { Avatar } from "./person";
import { TestingTelemetryBadge } from "./testing-telemetry-badge";

/**
 * The article header. Breadcrumb across the well; below it the title,
 * dek, byline and the disclosure notice on seven columns, the testing
 * summary card on five. The notice sits in the byline region, so it is
 * read before the first buy link on the page.
 *
 * The H1 is capped at the theme’s title measure (18–35ch) and balanced;
 * the dek is set as a lead at reading measure.
 */
export interface EditorialArticleHeaderProps {
  guide: Pick<RoundupGuide, "crumbs" | "title" | "dek" | "author" | "testedWith" | "updatedAt" | "telemetry">;
  notice: { text: string; href: string };
  methodHref?: string;
  className?: string;
}

export function EditorialArticleHeader({ guide, notice, methodHref = "#methodology", className }: EditorialArticleHeaderProps) {
  const { author } = guide;
  return (
    <header data-slot="article-header" className={cn("kit-well @container pt-8 md:pt-12", className)}>
      <nav aria-label="Breadcrumb">
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 t-small text-fg-muted">
          {guide.crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              <a href={crumb.href} className={cn("kit-focus rounded-ctl hover:underline", i === 0 && "text-accent-category")}>
                {crumb.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-6 grid items-start gap-10 @4xl:grid-cols-12 @4xl:gap-x-12">
        <div className="@4xl:col-span-7">
          <h1 className="m-0 max-w-measure-title t-display text-fg">{guide.title}</h1>
          <p className="m-0 mt-6 max-w-[38rem] t-lead text-fg-muted">{guide.dek}</p>
          <div className="mt-8 flex items-center gap-4">
            <Avatar person={author} />
            <div className="flex min-w-0 flex-col">
              <p className="m-0 t-ui text-fg">
                By{" "}
                <a href={author.href} className="kit-focus kit-link rounded-ctl">
                  {author.name}
                </a>
                {author.role && <span className="font-normal text-fg-muted">, {author.role.toLowerCase()}</span>}
              </p>
              <p className="m-0 t-small text-fg-muted">
                Tested with {guide.testedWith}. Updated <time dateTime={guide.updatedAt}>{formatDateLong(guide.updatedAt)}</time>.
              </p>
            </div>
          </div>
          <p data-slot="disclosure-notice" className="m-0 mt-6 max-w-[38rem] t-small text-fg-muted">
            {notice.text}{" "}
            <a href={notice.href} className="kit-focus kit-link rounded-ctl text-fg">
              How we make money
            </a>
          </p>
        </div>
        <TestingTelemetryBadge telemetry={guide.telemetry} methodHref={methodHref} className="@4xl:col-span-5" />
      </div>
    </header>
  );
}
