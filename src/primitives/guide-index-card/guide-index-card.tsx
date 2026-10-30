import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { formatDate, initials } from "@/lib/format";
import { AwardBadge } from "@/primitives/award-badge";
import { SurfaceCard, SurfaceCardFooter, SurfaceCardMedia } from "@/primitives/surface-card";
import type { GuideEntity } from "@/types/account";

/**
 * <GuideIndexCard />
 * ---------------------------------------------------------------------------
 * A roundup buying guide on a category page — distinct from a product card
 * by its media: not one packshot but the guide's winners as an overlapping
 * miniature stack in a recessed well, with the test count badged top-left.
 *
 *   ┌ well · Plane 2 ────────────────────────┐
 *   │ [24 TESTED · 5 WINNERS]                 │
 *   │          ┌───┐┌───┐┌───┐                │  three 96px miniatures,
 *   │          │ 1 ││ 2 ││ 3 │  (overlap −24, │  #1 highest and on top,
 *   │          └───┘└───┘└───┘   stepped down)│  neighbours tuck under
 *   ├─────────────────────────────────────────┤
 *   │ The best daily trainers of 2026         │  type-title
 *   │ dek …                                   │
 *   │ [◉] Marcus Whitfield · Lead tester      │  portrait keyline
 *   ├ hairline bar ───────────────────────────┤
 *   │ UPDATED OCT 27, 2026        Read guide →│
 *   └─────────────────────────────────────────┘
 *
 *   --surface-recessed / --inset-card    the well
 *   --size-thumb-xl / --gap-grid          miniature size · overlap
 *   --size-portrait-sm                    tester portrait keyline
 *   --inset-bar-* / --border-hairline     footer bar
 *
 * Server Component. `footerAction` lets a host (the saved dossier) add a
 * second control on the footer's right without breaking the bar.
 */

export interface GuideIndexCardProps extends Omit<ComponentProps<"div">, "children"> {
  guide: GuideEntity;
  /** Extra control on the footer (e.g. "Remove" in the saved dossier). */
  footerAction?: ReactNode;
  /** Hero variant for a bento lead slot: larger well, dek always shown. */
  size?: "default" | "hero";
}

export function GuideIndexCard({ guide, footerAction, size = "default", className, ...props }: GuideIndexCardProps) {
  const miniatures = guide.products.slice(0, 3);
  const tester = guide.leadTester;
  return (
    <SurfaceCard
      as="article"
      interactive
      data-slot="guide-index-card"
      data-size={size}
      className={cn("h-full", className)}
      {...props}
    >
      <SurfaceCardMedia className="bg-recessed">
        {/* Badge in flow above the stack — never collides with it at any width */}
        <div className={cn("flex flex-col gap-stack px-card pt-card pb-card-spacious", size === "hero" && "pb-section")}>
          <AwardBadge surface="outline" size="sm" className="self-start">
            {guide.tested} tested · {guide.winners} winners
          </AwardBadge>
          <ul data-slot="miniature-stack" className="m-0 flex list-none items-start justify-center p-0">
            {miniatures.map((product, i) => {
              const image = product.media.primaryImage;
              return (
                <li
                  key={product.id}
                  className={cn(
                    "relative overflow-hidden rounded-inner border border-surface bg-surface shadow-elevated",
                    size === "hero" ? "size-[calc(var(--size-thumb-xl)*1.25)]" : "size-thumb-xl",
                    // Stepped: #1 sits highest and on top; each neighbour tucks under and steps down.
                    i === 1 && "-ml-grid translate-y-hairline",
                    i === 2 && "-ml-grid translate-y-cluster",
                  )}
                  style={{ zIndex: miniatures.length - i, backgroundColor: image.backdrop }}
                >
                  <Image src={image.src} alt="" fill sizes="192px" className="object-cover" />
                </li>
              );
            })}
          </ul>
        </div>
      </SurfaceCardMedia>

      <div className="flex min-w-0 flex-col gap-cluster">
        <h3 className="type-title m-0">
          <a href={guide.href} className="focus-ring rounded-control text-ink after:absolute after:inset-0 after:content-['']">
            {guide.title}
          </a>
        </h3>
        {guide.dek && <p className="m-0 text-body-sm text-ink-secondary">{guide.dek}</p>}
      </div>

      <div data-slot="guide-byline" className="grid grid-cols-[var(--size-portrait-sm)_minmax(0,1fr)] items-center gap-x-cluster">
        <span className="relative flex size-portrait-sm items-center justify-center overflow-hidden rounded-inner border border-hairline bg-recessed text-caption font-semibold text-ink">
          {tester.avatar ? <Image src={tester.avatar.src} alt="" fill sizes="56px" className="object-cover" /> : initials(tester.name)}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-medium text-ink">{tester.name}</span>
          <span className="truncate text-caption text-ink-tertiary">{tester.role}</span>
        </span>
      </div>

      <SurfaceCardFooter variant="hairline-bar" className="relative z-10">
        <span className="type-mono text-ink-tertiary">Updated {formatDate(guide.updatedAt)}</span>
        <span className="flex items-center gap-cluster">
          {footerAction}
          <a
            href={guide.href}
            className="focus-ring arrow-nudge inline-flex items-center gap-hairline rounded-control text-body-sm font-medium text-ink"
          >
            Read guide
            <ArrowRight data-slot="action-arrow" size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </span>
      </SurfaceCardFooter>
    </SurfaceCard>
  );
}
