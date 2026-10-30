"use client";

import { useCallback, useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type MouseEvent } from "react";

import { cn } from "@/lib/cn";
import type { RibbonItem } from "@/types/navigation";

/**
 * <SubCategoryRibbon />
 * ---------------------------------------------------------------------------
 * Sticky 44px silo scroller under the masthead:
 *
 *   ┃ All 68   Daily trainers 24   Carbon plated 11   Trail 15   Stabil…┃
 *   ┃          ━━━━━━━━━━━━━━━━━                                         ┃
 *     ← fades only where there is more to scroll →
 *
 *   --size-ribbon                              the row (44px)
 *   --border-width-emphasis / --ink-primary    the active rule
 *   --gap-grid                                 item rhythm
 *   --inset-tag-* / --radius-tag               count chips (mono voice)
 *   --duration-interactive / --ease-standard   the rule's glide
 *
 * 21st.dev physics (kuratlielia/tabs #35021, sanitized): a ResizeObserver +
 * passive scroll listener decide which edge still has content and set
 * `data-fade`; the CSS mask does the fading. The active rule is positioned
 * by two custom properties a measurement effect writes — the glide between
 * silos is a CSS transition, not a layout animation runtime (framer's
 * `layoutId` replaced). The active item is scrolled into view on mount and
 * on change.
 *
 * Items are plain links (`aria-current="page"` marks the active silo), so
 * the ribbon works without JS and as a client-routed tab strip alike.
 */

export interface SubCategoryRibbonProps extends Omit<ComponentProps<"nav">, "onSelect"> {
  items: RibbonItem[];
  activeId?: string;
  /** Accessible name ("Running categories"). */
  label: string;
  /** Stick to the top of the scrollport (default true). */
  sticky?: boolean;
  /** Offset from the top while sticky — usually the masthead height. */
  top?: string;
  /** Intercept clicks for client-side routing; call `preventDefault` to stop navigation. */
  onSelect?: (item: RibbonItem, event: MouseEvent<HTMLAnchorElement>) => void;
}

type Fade = "none" | "start" | "end" | "both";

export function SubCategoryRibbon({
  items,
  activeId,
  label,
  sticky = true,
  top = "0px",
  onSelect,
  className,
  style,
  ...props
}: SubCategoryRibbonProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [fade, setFade] = useState<Fade>("none");
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);

  const updateFade = useCallback(() => {
    const scroller = viewportRef.current;
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const start = scroller.scrollLeft > 1;
    const end = scroller.scrollLeft < max - 1;
    const next: Fade = max <= 1 ? "none" : start && end ? "both" : start ? "start" : end ? "end" : "none";
    setFade((prev) => (prev === next ? prev : next));
  }, []);

  const measure = useCallback(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>("[aria-current='page']");
    if (!list || !active) {
      setIndicator(null);
      return;
    }
    const next = { x: active.offsetLeft, w: active.offsetWidth };
    setIndicator((prev) => (prev && prev.x === next.x && prev.w === next.w ? prev : next));
  }, []);

  const reveal = useCallback((behavior: ScrollBehavior) => {
    const scroller = viewportRef.current;
    const active = listRef.current?.querySelector<HTMLElement>("[aria-current='page']");
    if (!scroller || !active) return;
    const margin = scroller.clientWidth * 0.15;
    const left = active.offsetLeft - margin;
    const right = active.offsetLeft + active.offsetWidth + margin;
    if (left < scroller.scrollLeft) scroller.scrollTo({ left, behavior });
    else if (right > scroller.scrollLeft + scroller.clientWidth) scroller.scrollTo({ left: right - scroller.clientWidth, behavior });
  }, []);

  useLayoutEffect(() => {
    const scroller = viewportRef.current;
    const list = listRef.current;
    if (!scroller || !list) return;
    const sync = () => {
      updateFade();
      measure();
    };
    const observer = new ResizeObserver(sync);
    observer.observe(scroller);
    observer.observe(list);
    scroller.addEventListener("scroll", updateFade, { passive: true });
    sync();
    reveal("instant");
    // Variable fonts swap in after first paint; re-measure once they settle.
    document.fonts?.ready.then(sync).catch(() => {});
    return () => {
      observer.disconnect();
      scroller.removeEventListener("scroll", updateFade);
    };
  }, [updateFade, measure, reveal]);

  useLayoutEffect(() => {
    measure();
    reveal("smooth");
  }, [activeId, measure, reveal]);

  const vars = {
    "--ribbon-top": top,
    "--indicator-x": indicator ? `${indicator.x}px` : "0px",
    "--indicator-w": indicator ? `${indicator.w}px` : "0px",
    ...style,
  } as CSSProperties;

  return (
    <nav
      data-slot="sub-category-ribbon"
      aria-label={label}
      className={cn(
        "z-30 h-ribbon w-full min-w-0 border-b border-hairline bg-surface text-ink",
        sticky && "sticky top-(--ribbon-top)",
        className,
      )}
      style={vars}
      {...props}
    >
      <div className="page-well h-full">
        <div
          ref={viewportRef}
          data-slot="ribbon-scroller"
          data-fade={fade}
          className="ribbon-scroller relative h-full overflow-x-auto overflow-y-hidden overscroll-x-contain"
        >
          <ul
            ref={listRef}
            className="relative m-0 flex h-full w-max min-w-full list-none items-stretch gap-grid p-0"
          >
            {items.map((item) => {
              const active = item.id === activeId;
              return (
                <li key={item.id} className="flex shrink-0">
                  <a
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={onSelect ? (e) => onSelect(item, e) : undefined}
                    className={cn(
                      "focus-ring inline-flex items-center gap-cluster whitespace-nowrap rounded-control",
                      "text-body-sm font-medium text-ink-secondary transition-colors duration-interactive ease-standard hover:text-ink",
                      active && "text-ink",
                    )}
                  >
                    {item.label}
                    {item.count !== undefined && (
                      <span
                        className={cn(
                          "type-mono rounded-tag border border-hairline bg-recessed px-tag-x py-tag-y text-ink-tertiary",
                          "transition-colors duration-interactive ease-standard",
                          active && "border-strong text-ink",
                        )}
                      >
                        {item.count}
                        <span className="sr-only"> products</span>
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
            <li aria-hidden="true" className="contents">
              <span data-slot="ribbon-indicator" className="ribbon-indicator" data-measured={indicator !== null} />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
