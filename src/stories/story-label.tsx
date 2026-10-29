import type { ReactNode } from "react";

/**
 * Storybook-only annotation (Law 3): variant / prop labels render OUTSIDE and
 * ABOVE the component under test, in a muted mono pill — never inside the
 * component's own markup, never in the component's eyebrow voice.
 */
export function StoryLabel({ children }: { children: ReactNode }) {
  return (
    <span
      data-story-label=""
      className="mb-2 inline-flex w-fit max-w-full items-center rounded-[3px] border border-dashed border-neutral-300 px-1.5 py-0.5 font-mono text-[10px] leading-snug tracking-wide text-neutral-400 [overflow-wrap:anywhere]"
    >
      {children}
    </span>
  );
}

/**
 * Label + component, stacked. Grids that hold these declare `items-start`
 * themselves so cards never stretch; the wrapper itself keeps the normal
 * stretch width (a fit-content width would collapse `@container` children).
 */
export function Labeled({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col items-start">
      <StoryLabel>{label}</StoryLabel>
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
}
