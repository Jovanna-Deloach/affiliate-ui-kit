import Image from "next/image";

import { cn } from "@/lib/cn";
import { formatDateLong } from "@/lib/format";
import type { RoundupGuide } from "@/kit/types";

/** Breadcrumb, the H1, the dek and a byline that says who tested and when. */
export function ArticleHeader({ guide, className }: { guide: RoundupGuide; className?: string }) {
  const { author } = guide;
  return (
    <header className={cn("kit-well pt-10 md:pt-16", className)}>
      <nav aria-label="Breadcrumb">
        <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0 t-small text-fg-muted">
          {guide.crumbs.map((crumb, i) => (
            <li key={crumb.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              <a href={crumb.href} className="kit-focus kit-link rounded-ctl no-underline hover:underline">
                {crumb.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="m-0 mt-5 max-w-[20ch] t-display text-fg">{guide.title}</h1>
      <p className="m-0 mt-6 max-w-[38rem] t-lead text-fg-muted">{guide.dek}</p>
      <div className="mt-10 flex items-center gap-4">
        {author.avatar && (
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-well">
            <Image src={author.avatar.src} alt="" fill sizes="88px" className="object-cover" />
          </span>
        )}
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
    </header>
  );
}
