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
            <code className="font-metric text-xs text-muted">[data-vertical=&quot;{v.id}&quot;]</code>
          </header>
          <div className="min-w-0">{render ? render() : children}</div>
        </section>
      ))}
    </div>
  );
}

/** Fixed-width frames to compare 375 px and 1280 px behaviour in one story. */
export function ViewportFrames({ render }: { render: (width: number) => ReactNode }) {
  return (
    <div className="flex flex-col gap-section-gap">
      {[375, 1280].map((w) => (
        <section key={w} className="flex flex-col gap-cluster-gap">
          <span className="type-eyebrow text-muted">{w}px</span>
          <div
            className="max-w-full overflow-x-auto border-surface-w border-border bg-surface"
            style={{ width: w, containerType: "inline-size" }}
          >
            {render(w)}
          </div>
        </section>
      ))}
    </div>
  );
}
