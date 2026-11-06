import { BadgeCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";
import type { RoundupGuide } from "@/kit/types";
import { Avatar, Breadcrumb, Eyebrow } from "@/kit/ui";

import { TestingTelemetryBadge } from "./testing-telemetry-badge";

/**
 * The article header. A mono micro-caps eyebrow (the breadcrumb, “WATCHES ·
 * BUYING GUIDES”); below it the display-serif title, the dek, the byline
 * with its verification stamp and the disclosure notice on seven columns,
 * the testing summary card on five. The notice sits in the byline region,
 * so it is read before the first buy link on the page.
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
      <Breadcrumb items={guide.crumbs} />
      <div className="mt-6 grid items-start gap-10 @4xl:grid-cols-12 @4xl:gap-x-12">
        <div className="@4xl:col-span-7">
          <h1 className="m-0 mt-1 max-w-measure-title t-display text-fg">{guide.title}</h1>
          <p className="m-0 mt-6 max-w-[38rem] t-lead text-fg-body">{guide.dek}</p>
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
              <p className="m-0 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <Eyebrow as="span" tone="default" icon={<BadgeCheck size={14} strokeWidth={2} className="text-pass" />}>
                  Updated <time dateTime={guide.updatedAt}>{formatDateLong(guide.updatedAt)}</time>
                </Eyebrow>
                <span className="t-small text-fg-muted">Tested with {guide.testedWith}.</span>
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
