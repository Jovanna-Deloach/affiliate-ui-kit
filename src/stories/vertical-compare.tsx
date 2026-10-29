import type { ReactNode } from "react";

import { VERTICALS } from "@/lib/verticals";

/**
 * Renders the SAME children inside every vertical wrapper, side by side on
 * desktop and stacked on mobile. Used by every primitive's comparison story:
 * identical component, identical data payload, only the token profile differs.
 */
export function VerticalCompare({
  children,
  render,
}: {
  children?: ReactNode;
  /** Use when children need a fresh instance per vertical (stateful demos). */
  render?: () => ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-0 lg:grid-cols-2" data-testid="vertical-compare">
      {VERTICALS.map((v) => (
        <section
          key={v.id}
          data-vertical={v.id}
          className="flex min-w-0 flex-col gap-card-pad p-card-pad"
        >
          <header className="flex items-baseline justify-between gap-cluster-gap border-b-surface-w border-border pb-cluster-gap">
            <span className="type-eyebrow">{v.label}</span>
            <code className="type-label-mono text-muted">[data-vertical=&quot;{v.id}&quot;]</code>
          </header>
          <div className="min-w-0">{render ? render() : children}</div>
        </section>
      ))}
    </div>
  );
}

export type ViewportSpec = {
  width: 375 | 1280;
  /** Tailwind grid classes the story should use at this width. */
  grid: string;
};

export const VIEWPORTS: ViewportSpec[] = [
  { width: 375, grid: "grid grid-cols-2 gap-3" },
  { width: 1280, grid: "grid grid-cols-4 gap-6" },
];

/**
 * Real viewport simulation. The 375 px demo is a hard `w-[375px]` dashed
 * container with a compact 2-column grid; the 1280 px demo is a
 * `max-w-[1280px]` container with a 4-column grid. The outer scroller keeps
 * the document from overflowing when the Storybook viewport itself is 375.
 */
export function ViewportFrames({
  render,
}: {
  render: (spec: ViewportSpec) => ReactNode;
}) {
  return (
    <div className="flex flex-col gap-section-gap">
      {VIEWPORTS.map((spec) => (
        <section key={spec.width} className="flex min-w-0 flex-col gap-cluster-gap">
          <span className="type-label-mono text-muted">
            {spec.width}px · {spec.width === 375 ? "2-col compact" : "4-col"}
          </span>
          <div className="w-full overflow-x-auto">
            <div
              className={
                spec.width === 375
                  ? "w-[375px] shrink-0 border border-dashed border-border-strong bg-surface p-4"
                  : "w-full max-w-[1280px] shrink-0 border border-dashed border-border-strong bg-surface p-8"
              }
              style={{ containerType: "inline-size" }}
            >
              {render(spec)}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
