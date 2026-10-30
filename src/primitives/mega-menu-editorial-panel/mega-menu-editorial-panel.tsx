import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import { formatDate, formatScore } from "@/lib/format";
import { cheapestOffer } from "@/lib/offers";
import { AffiliateAction } from "@/primitives/affiliate-action";
import { AwardBadge } from "@/primitives/award-badge";
import { Button } from "@/primitives/button";
import { StatusPill } from "@/primitives/status-pill";
import type { AffiliateAttribution, ProductImage } from "@/types/affiliate";
import type { NavGuide, NavSpotlight, NavVertical } from "@/types/navigation";

/**
 * <MegaMenuEditorialPanel />
 * ---------------------------------------------------------------------------
 * The 12-column dropdown a masthead trigger opens. Three regions, three
 * jobs, one keyline grid (Law of Common Region):
 *
 *   ┌ 1 ─────── 3 ┬ 4 ──────────────── 8 ┬ 9 ───────────── 12 ┐
 *   │ Plane 1     │ Plane 1 · border-l    │ Plane 2 · recessed  │
 *   │ silo links  │ most-read guides      │ spotlight           │
 *   │ name    24  │ [64] title            │ #1 OVERALL · …      │
 *   │ name    11  │      UPDATED · 24 … 5 │ [96] Brand Name 9.2 │
 *   │ …           │ [64] title            │ verdict             │
 *   │ All running→│      UPDATED · …      │ [View deal] [Review]│
 *   └─────────────┴───────────────────────┴─────────────────────┘
 *
 * Every silo row is `grid-cols-[minmax(0,1fr)_auto]`: the name on the left,
 * the tested count on the right in the mono voice (Law of Continuity — the
 * counts share one axis). Below a 48rem container the regions stack, the
 * `border-l` rules become `border-t`.
 *
 *   --surface-primary / --surface-recessed   Planes 1 and 2
 *   --border-hairline                        region rules + silo dividers
 *   --size-thumb-lg / --size-thumb-xl        guide + spotlight thumbnails
 *   --inset-card / --row-y-compact           region inset · silo rhythm
 *   --measure-page / --inset-page-x          the panel's page well
 *
 * Mobbin anatomy (Hers, lululemon, Pinterest mega-menus): a flat silo list,
 * hairline-separated columns, and one tinted spotlight with a direct CTA.
 * Server Component: only the merchant CTA is a client leaf. The host
 * (<MegaMenu />, later the masthead) supplies the Radix trigger/viewport.
 */

export interface MegaMenuEditorialPanelProps extends Omit<ComponentProps<"div">, "children"> {
  vertical: NavVertical;
  attribution?: AffiliateAttribution;
  placement?: string;
}

export function MegaMenuEditorialPanel({
  vertical,
  attribution,
  placement = "mega-menu",
  className,
  ...props
}: MegaMenuEditorialPanelProps) {
  return (
    <div
      data-slot="mega-menu-editorial-panel"
      className={cn("@container w-full min-w-0 bg-surface text-ink", className)}
      {...props}
    >
      <div className="page-well grid grid-cols-1 @3xl:grid-cols-12">
        {/* Col 1–3 · silos */}
        <nav
          aria-label={`${vertical.label} categories`}
          data-slot="menu-silos"
          className="flex min-w-0 flex-col gap-stack py-card @3xl:col-span-3 @3xl:pr-card"
        >
          <p className="type-eyebrow m-0 text-ink-tertiary">Browse {vertical.label}</p>
          <ul className="m-0 flex list-none flex-col border-t border-hairline p-0">
            {vertical.categories.map((category) => (
              <li key={category.id}>
                <a
                  href={category.href}
                  className={cn(
                    "focus-ring grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-stack border-b border-hairline py-row-compact",
                    "text-body-sm font-medium text-ink transition-colors duration-interactive ease-standard hover:text-ink-secondary",
                  )}
                >
                  <span className="truncate">{category.label}</span>
                  <span className="type-mono text-ink-tertiary">
                    {category.count}
                    <span className="sr-only"> tested</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <Button asChild intent="inline" size="sm" motion="arrow-nudge" className="self-start text-body-sm">
            <a href={vertical.href}>
              All {vertical.label.toLowerCase()}
              <ArrowRight data-slot="action-arrow" size="1.1em" strokeWidth={1.5} aria-hidden="true" />
            </a>
          </Button>
        </nav>

        {/* Col 4–8 · most-read guides */}
        <section
          data-slot="menu-guides"
          aria-label="Most read buying guides"
          className="flex min-w-0 flex-col gap-stack border-t border-hairline py-card @3xl:col-span-5 @3xl:border-t-0 @3xl:border-l @3xl:px-card"
        >
          <p className="type-eyebrow m-0 text-ink-tertiary">Most read buying guides</p>
          <ul className="m-0 flex list-none flex-col gap-stack p-0">
            {vertical.guides.map((guide) => (
              <GuideRow key={guide.id} guide={guide} />
            ))}
          </ul>
        </section>

        {/* Col 9–12 · spotlight on the recessed plane */}
        <aside
          data-slot="menu-spotlight"
          aria-label={vertical.spotlight.kind === "tool" ? "Featured tool" : "Flagship winner"}
          className="flex min-w-0 flex-col gap-stack border-t border-hairline bg-recessed p-card @3xl:col-span-4 @3xl:border-t-0 @3xl:border-l"
        >
          <Spotlight spotlight={vertical.spotlight} attribution={attribution} placement={placement} />
        </aside>
      </div>
    </div>
  );
}

function Thumb({ image, size, sizes }: { image: ProductImage; size: "lg" | "xl"; sizes: string }) {
  return (
    <span
      data-slot="menu-thumb"
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-inner border border-hairline bg-surface",
        size === "xl" ? "size-thumb-xl" : "size-thumb-lg",
      )}
      style={{ backgroundColor: image.backdrop }}
    >
      <Image src={image.src} alt="" fill sizes={sizes} className="object-cover" />
    </span>
  );
}

function GuideRow({ guide }: { guide: NavGuide }) {
  return (
    <li>
      <a
        href={guide.href}
        className="focus-ring group/guide grid grid-cols-[var(--size-thumb-lg)_minmax(0,1fr)] items-center gap-x-inline rounded-inner"
      >
        <Thumb image={guide.image} size="lg" sizes="128px" />
        <span className="flex min-w-0 flex-col gap-hairline">
          <span className="text-body-sm font-medium text-ink decoration-strong underline-offset-[0.3em] group-hover/guide:underline">
            {guide.title}
          </span>
          <span className="flex flex-wrap items-center gap-cluster">
            <StatusPill kind="technical" size="sm">
              Updated {formatDate(guide.updatedAt)}
            </StatusPill>
            {guide.tested !== undefined && (
              <span className="text-caption tabular-nums text-ink-tertiary">
                {guide.tested} tested{guide.winners !== undefined && ` · ${guide.winners} winners`}
              </span>
            )}
          </span>
        </span>
      </a>
    </li>
  );
}

function Spotlight({
  spotlight,
  attribution,
  placement,
}: {
  spotlight: NavSpotlight;
  attribution?: AffiliateAttribution;
  placement: string;
}) {
  if (spotlight.kind === "tool") {
    return (
      <>
        <p className="type-eyebrow m-0 text-ink-tertiary">{spotlight.eyebrow}</p>
        <div className="flex flex-col gap-cluster">
          <p className="type-title m-0">{spotlight.title}</p>
          <p className="m-0 text-body-sm text-ink-secondary">{spotlight.description}</p>
        </div>
        <Button asChild size="sm" motion="arrow-nudge" className="self-start">
          <a href={spotlight.href}>
            {spotlight.ctaLabel}
            <ArrowRight data-slot="action-arrow" size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </a>
        </Button>
      </>
    );
  }

  const { product } = spotlight;
  const offer = cheapestOffer(product);
  return (
    <>
      <p className="type-eyebrow m-0 text-ink-tertiary">{spotlight.eyebrow}</p>
      <div className="grid grid-cols-[var(--size-thumb-xl)_minmax(0,1fr)] items-start gap-x-inline">
        <Thumb image={product.media.primaryImage} size="xl" sizes="192px" />
        <div className="flex min-w-0 flex-col gap-hairline">
          {product.awardBadge && <AwardBadge badge={product.awardBadge} size="sm" className="self-start" />}
          <p className="type-title m-0">
            {product.brand} {product.name}
          </p>
          {product.overallScore !== undefined && (
            <p className="type-metric m-0 text-body-sm text-ink">
              {formatScore(product.overallScore)} <span className="font-normal text-ink-tertiary">/ 10</span>
            </p>
          )}
        </div>
      </div>
      <p className="m-0 text-body-sm text-ink-secondary">{spotlight.verdict}</p>
      <div className="flex flex-wrap items-center gap-cluster">
        {offer && (
          <AffiliateAction
            href={offer.affiliateUrl}
            attribution={attribution}
            tracking={{ merchant: offer.merchantName, offerId: offer.id, productId: product.id, placement }}
            size="sm"
          >
            View deal
          </AffiliateAction>
        )}
        <Button asChild intent="ghost" size="sm">
          <a href={spotlight.href}>Read the review</a>
        </Button>
      </div>
    </>
  );
}
