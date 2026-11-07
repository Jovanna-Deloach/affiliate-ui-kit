import { Info, OctagonAlert, TriangleAlert, type LucideIcon } from "lucide-react";

import type { SafetyNote } from "@/kit/types";
import { cn } from "@/lib/cn";

const GROUPS: { kind: SafetyNote["kind"]; heading: string }[] = [
  { kind: "avoid", heading: "Who should avoid it" },
  { kind: "interaction", heading: "Interactions" },
  { kind: "side-effect", heading: "Side effects" },
];

const SEVERITY: Record<SafetyNote["severity"], { word: string; icon: LucideIcon; ink: string; rank: number }> = {
  serious: { word: "Serious", icon: OctagonAlert, ink: "text-fail", rank: 0 },
  moderate: { word: "Moderate", icon: TriangleAlert, ink: "text-warn", rank: 1 },
  mild: { word: "Mild", icon: Info, ink: "text-fg-muted", rank: 2 },
};

export interface SafetyPanelProps {
  /** Who should avoid it, what it interacts with, and its side effects, each with a severity. */
  notes: SafetyNote[];
  /** The heading (default “Safety”). */
  heading?: string;
  /** One or two sentences first: how safe it is for most people, in plain words. */
  summary?: string;
  /** The heading’s level: `h2` on a page (default), `h3` inside a section. */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `safety`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What a reader should know before taking a supplement: who should avoid
 * it, what it interacts with, and its side effects, each group ordered from
 * serious to mild, every note marked with its severity in an icon and a
 * word. Ends with the line that it is general information, not medical
 * advice.
 *
 * **Use it for** an ingredient’s page and a product’s page, after the
 * evidence. **Not for** a recall or a failed test (`ConsumerWarning`), or
 * a product’s cons (`ProsCons`).
 *
 * @summary Who should avoid it, interactions and side effects, by severity.
 * @import import { SafetyPanel } from "@/kit/components";
 */
export function SafetyPanel({ notes, heading = "Safety", summary, as: Heading = "h2", id = "safety", className }: SafetyPanelProps) {
  const Sub = Heading === "h2" ? "h3" : "h4";
  return (
    <section id={id} aria-label={heading} className={cn("grid scroll-mt-8 gap-6", className)}>
      <div className="grid max-w-[65ch] gap-2">
        <Heading className="m-0 t-title text-fg">{heading}</Heading>
        {summary ? <p className="m-0 t-body text-fg-body">{summary}</p> : null}
      </div>
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {GROUPS.map((group) => {
          const items = notes.filter((note) => note.kind === group.kind).sort((a, b) => SEVERITY[a.severity].rank - SEVERITY[b.severity].rank);
          if (!items.length) return null;
          return (
            <div key={group.kind} className="grid content-start gap-3 border-t border-line-strong pt-4">
              <Sub className="m-0 t-ui font-semibold text-fg">{group.heading}</Sub>
              <ul className="m-0 grid list-none gap-4 p-0">
                {items.map((note) => {
                  const { word, icon: Icon, ink } = SEVERITY[note.severity];
                  return (
                    <li key={note.title} className="grid gap-1">
                      <p className={cn("m-0 flex items-center gap-1.5 t-micro", ink)}>
                        <Icon aria-hidden="true" size={14} strokeWidth={2} />
                        {word}
                      </p>
                      <p className="m-0 t-ui font-semibold text-fg">{note.title}</p>
                      <p className="m-0 t-small text-fg-body">{note.detail}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="m-0 max-w-[65ch] t-caption text-fg-muted">
        General information, not medical advice. Ask a doctor or pharmacist before you start, especially if you take medicine or are pregnant.
      </p>
    </section>
  );
}
