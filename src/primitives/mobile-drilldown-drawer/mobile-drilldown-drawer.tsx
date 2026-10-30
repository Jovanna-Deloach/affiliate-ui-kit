"use client";

import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Drawer } from "vaul";

import { cn } from "@/lib/cn";
import { formatScore } from "@/lib/format";
import { useInheritedVertical } from "@/lib/use-inherited-vertical";
import type { NavLink, NavVertical, NavWinner, TrustStat } from "@/types/navigation";

/**
 * <MobileDrilldownDrawer />
 * ---------------------------------------------------------------------------
 * The phone navigation: a vaul bottom sheet with two horizontal stages on
 * one track, fixed 48px keyline rows, and a recessed trust band pinned to
 * the bottom.
 *
 *   ┌──────────────── ═══ ────────────────┐
 *   │ ‹        RUNNING                 ✕  │  48px header
 *   ├─────────────────────────────────────┤
 *   │ Stage 1            │ Stage 2        │  one grid track, two 100%
 *   │ [⌕ Search        ] │ CATEGORIES     │  columns; `translate` slides
 *   │ Running     68   › │ Daily tr.   24 │  between them (drill-track)
 *   │ Supplements 75   › │ Carbon pl.  11 │
 *   │ Watches     58   › │ …              │
 *   │ How we test      › │ TOP 3 WINNERS  │
 *   │                    │ 01 [▣] Name 9.2│
 *   ├─────────────────────────────────────┤
 *   │ 14,200+ │ 480+     │ 0              │  recessed trust band
 *   └─────────────────────────────────────┘
 *
 *   --size-row-touch                          every row (48px)
 *   --keyline-rank / --size-portrait-xs       winner rows: rank · 32px thumb
 *   --inset-cell-x                            row inset
 *   --surface-recessed                        search field + trust band
 *   --duration-reveal / --ease-standard       the stage slide
 *
 * Mobbin anatomy (Depop / Shopee category drill-down, Careem's counted
 * rows): back chevron + centred title, chevron-terminated rows, counts on
 * the right keyline. The inactive stage is `inert`, so focus and the
 * accessibility tree never land off-screen; focus moves to the back control
 * on drill-in and returns to the row that opened it on back.
 */

export interface MobileDrilldownDrawerProps {
  verticals: NavVertical[];
  /** Plain links listed under the verticals ("How we test", "Tools"). */
  utilityLinks?: NavLink[];
  /** The element that opens the drawer (rendered via asChild). */
  trigger?: ReactNode;
  /** Search form target; the query is posted as `q`. */
  searchAction?: string;
  searchPlaceholder?: string;
  /** Up to three stats for the recessed trust band. */
  trustStats?: TrustStat[];
  trustHref?: string;
  /** Open directly on a vertical's stage 2 (deep links, stories). */
  initialVerticalId?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const rowClass = cn(
  "focus-ring grid h-row-touch w-full items-center gap-x-stack border-b border-hairline px-cell-x text-left",
  "transition-colors duration-interactive ease-standard hover:bg-recessed",
);

export function MobileDrilldownDrawer({
  verticals,
  utilityLinks = [],
  trigger,
  searchAction = "/search",
  searchPlaceholder = "Search tests, guides, products",
  trustStats = [],
  trustHref,
  initialVerticalId,
  open,
  defaultOpen,
  onOpenChange,
  className,
}: MobileDrilldownDrawerProps) {
  const [stage, setStage] = useState<1 | 2>(initialVerticalId ? 2 : 1);
  const [currentId, setCurrentId] = useState<string | undefined>(initialVerticalId);
  const current = verticals.find((v) => v.id === currentId);
  const backRef = useRef<HTMLButtonElement>(null);
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [anchorRef, vertical] = useInheritedVertical();

  const drillIn = (id: string) => {
    setCurrentId(id);
    setStage(2);
  };
  const back = () => setStage(1);

  // Move focus with the stage, once the slide has started.
  useEffect(() => {
    const target = stage === 2 ? backRef.current : currentId ? rowRefs.current[currentId] : null;
    const frame = requestAnimationFrame(() => target?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [stage, currentId]);

  return (
    <Drawer.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => {
        if (!next) setStage(1);
        onOpenChange?.(next);
      }}
      shouldScaleBackground={false}
    >
      <span ref={anchorRef} hidden data-slot="drawer-anchor" />
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="sheet-scrim fixed inset-0 z-50" />
        <Drawer.Content
          data-slot="mobile-drilldown-drawer"
          data-vertical={vertical}
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex h-[92dvh] flex-col bg-surface text-ink shadow-overlay outline-none",
            "rounded-t-container border-t border-hairline",
            className,
          )}
        >
          <Drawer.Handle className="mt-cluster !h-[var(--border-width-emphasis)] !w-[calc(var(--size-control)*1.2)] !bg-strong" />
          <Drawer.Title className="sr-only">Site navigation</Drawer.Title>
          <Drawer.Description className="sr-only">Browse categories, buying guides and winners.</Drawer.Description>

          {/* Header: back keyline · title · close keyline */}
          <header
            data-slot="drill-header"
            className="grid h-row-touch shrink-0 grid-cols-[var(--size-control)_minmax(0,1fr)_var(--size-control)] items-center border-b border-hairline px-cell-x"
          >
            {stage === 2 ? (
              <button
                ref={backRef}
                type="button"
                onClick={back}
                aria-label="Back to all categories"
                className="focus-ring flex size-control cursor-pointer items-center justify-center rounded-control text-ink-secondary transition-colors duration-interactive ease-standard hover:bg-recessed hover:text-ink"
              >
                <ChevronLeft size="1.25em" strokeWidth={1.5} aria-hidden="true" />
              </button>
            ) : (
              <span aria-hidden="true" />
            )}
            <p className="type-eyebrow m-0 truncate text-center text-ink" aria-live="polite">
              {stage === 2 && current ? current.label : "Browse"}
            </p>
            <Drawer.Close
              aria-label="Close"
              className="focus-ring flex size-control cursor-pointer items-center justify-center justify-self-end rounded-control text-ink-secondary transition-colors duration-interactive ease-standard hover:bg-recessed hover:text-ink"
            >
              <X size="1.25em" strokeWidth={1.5} aria-hidden="true" />
            </Drawer.Close>
          </header>

          {/* The two-stage track */}
          <div className="min-h-0 flex-1 overflow-hidden">
            <div data-slot="drill-track" data-stage={stage} className="drill-track h-full">
              <section
                data-slot="drill-stage"
                data-stage-index="1"
                inert={stage !== 1}
                aria-label="Categories and search"
                className="flex h-full min-w-0 flex-col overflow-y-auto overscroll-contain"
              >
                <form role="search" action={searchAction} className="border-b border-hairline px-cell-x py-row">
                  <label htmlFor="drill-search" className="sr-only">
                    Search
                  </label>
                  <div className="grid h-control grid-cols-[var(--size-control)_minmax(0,1fr)] items-center rounded-control border border-hairline bg-recessed focus-within:border-strong">
                    <Search size="1.1em" strokeWidth={1.5} aria-hidden="true" className="justify-self-center text-ink-tertiary" />
                    <input
                      id="drill-search"
                      type="search"
                      name="q"
                      placeholder={searchPlaceholder}
                      autoComplete="off"
                      className="h-full min-w-0 bg-transparent pr-cell-x text-body-sm text-ink outline-none placeholder:text-ink-tertiary"
                    />
                  </div>
                </form>
                <ul className="m-0 list-none p-0">
                  {verticals.map((v) => {
                    const total = v.categories.reduce((sum, c) => sum + c.count, 0);
                    return (
                      <li key={v.id}>
                        <button
                          ref={(el) => {
                            rowRefs.current[v.id] = el;
                          }}
                          type="button"
                          onClick={() => drillIn(v.id)}
                          aria-haspopup="true"
                          className={cn(rowClass, "grid-cols-[minmax(0,1fr)_auto_auto] cursor-pointer")}
                        >
                          <span className="flex min-w-0 flex-col">
                            <span className="truncate text-body font-medium text-ink">{v.label}</span>
                            {v.description && <span className="truncate text-caption text-ink-tertiary">{v.description}</span>}
                          </span>
                          <span className="type-mono text-ink-tertiary">
                            {total}
                            <span className="sr-only"> tested</span>
                          </span>
                          <ChevronRight size="1.1em" strokeWidth={1.5} aria-hidden="true" className="text-ink-tertiary" />
                        </button>
                      </li>
                    );
                  })}
                  {utilityLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={cn(rowClass, "grid-cols-[minmax(0,1fr)_auto]")}>
                        <span className="truncate text-body font-medium text-ink">{link.label}</span>
                        <ChevronRight size="1.1em" strokeWidth={1.5} aria-hidden="true" className="text-ink-tertiary" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                data-slot="drill-stage"
                data-stage-index="2"
                inert={stage !== 2}
                aria-label={current ? `${current.label} categories and winners` : "Category"}
                className="flex h-full min-w-0 flex-col overflow-y-auto overscroll-contain"
              >
                {current && (
                  <>
                    <p className="type-eyebrow m-0 px-cell-x pt-stack pb-cluster text-ink-tertiary">Categories</p>
                    <ul className="m-0 list-none border-t border-hairline p-0">
                      {current.categories.map((c) => (
                        <li key={c.id}>
                          <a href={c.href} className={cn(rowClass, "grid-cols-[minmax(0,1fr)_auto]")}>
                            <span className="truncate text-body-sm font-medium text-ink">{c.label}</span>
                            <span className="type-mono text-ink-tertiary">
                              {c.count}
                              <span className="sr-only"> tested</span>
                            </span>
                          </a>
                        </li>
                      ))}
                      <li>
                        <a href={current.href} className={cn(rowClass, "grid-cols-[minmax(0,1fr)_auto]")}>
                          <span className="truncate text-body-sm font-medium text-ink-secondary">All {current.label.toLowerCase()}</span>
                          <ChevronRight size="1.1em" strokeWidth={1.5} aria-hidden="true" className="text-ink-tertiary" />
                        </a>
                      </li>
                    </ul>
                    <p className="type-eyebrow m-0 px-cell-x pt-section pb-cluster text-ink-tertiary">Top 3 winners</p>
                    <ol className="m-0 list-none border-t border-hairline p-0">
                      {current.winners.slice(0, 3).map((winner, i) => (
                        <WinnerRow key={winner.product.id} winner={winner} rank={i + 1} />
                      ))}
                    </ol>
                  </>
                )}
              </section>
            </div>
          </div>

          {/* Recessed trust band */}
          {trustStats.length > 0 && (
            <footer
              data-slot="drill-trust"
              className="shrink-0 border-t border-hairline bg-recessed px-cell-x py-row pb-[max(var(--row-y),env(safe-area-inset-bottom))]"
            >
              <dl className="m-0 grid grid-cols-3 divide-x divide-hairline">
                {trustStats.slice(0, 3).map((stat) => (
                  <div key={stat.label} className="flex min-w-0 flex-col items-center gap-hairline px-cluster text-center">
                    <dt className="type-eyebrow order-2 text-ink-tertiary">{stat.label}</dt>
                    <dd className="type-metric order-1 m-0 text-body-sm text-ink">{stat.value}</dd>
                  </div>
                ))}
              </dl>
              {trustHref && (
                <a
                  href={trustHref}
                  className="focus-ring mt-cluster block text-center text-caption text-ink-secondary underline decoration-strong underline-offset-[0.3em] hover:text-ink"
                >
                  How we test
                </a>
              )}
            </footer>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function WinnerRow({ winner, rank }: { winner: NavWinner; rank: number }) {
  const { product } = winner;
  const image = product.media.primaryImage;
  return (
    <li>
      <a
        href={winner.href}
        className={cn(rowClass, "grid-cols-[var(--keyline-rank)_var(--size-portrait-xs)_minmax(0,1fr)_auto] gap-x-inline")}
      >
        <span className="type-mono text-ink-tertiary">{String(rank).padStart(2, "0")}</span>
        <span
          className="relative block size-portrait-xs overflow-hidden rounded-inner border border-hairline bg-surface"
          style={{ backgroundColor: image.backdrop }}
        >
          <Image src={image.src} alt="" fill sizes="64px" className="object-cover" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-body-sm font-medium text-ink">
            {product.brand} {product.name}
          </span>
          <span className="truncate text-caption text-ink-tertiary">{winner.accolade}</span>
        </span>
        {product.overallScore !== undefined && (
          <span className="type-metric text-body-sm text-ink">{formatScore(product.overallScore)}</span>
        )}
      </a>
    </li>
  );
}
