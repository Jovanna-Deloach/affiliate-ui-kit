import { Info } from "lucide-react";

import { referenceHref, shortCitation, STUDY_DESIGN_LABEL } from "@/kit/lib/evidence";
import type { Study } from "@/kit/types";
import { EffectMarker, Sep } from "@/kit/ui";
import { cn } from "@/lib/cn";

const NBSP = " ";

export interface StudyCardProps {
  /** The study: its design, who took part and how many, for how long, what it found, who paid, and where it was published. */
  study: Study;
  /** The title’s heading level: `h3` under a section’s `h2` (default). */
  as?: "h2" | "h3" | "h4";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * One study, summed up: its design and year, a plain headline, who took
 * part, how many and for how long, what it found and which way the outcome
 * moved, who paid for it when that matters, and the source, linked. The
 * design leads because it says how much weight the result can bear.
 *
 * **Use it for** a study in the research feed, or one that a page’s argument
 * rests on. **Not for** the full citation (`ReferenceList`), what all the
 * studies add up to (`EvidenceTable`), or a reader’s review (`ReviewCard`).
 *
 * @summary One study: design, who and how many, how long, what it found, the source.
 * @import import { StudyCard } from "@/kit/components";
 */
export function StudyCard({ study, as: Heading = "h3", className }: StudyCardProps) {
  const { reference } = study;
  const href = referenceHref(reference);
  return (
    <article className={cn("kit-card grid content-start gap-3 p-5", className)}>
      <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 t-micro text-fg-muted">
        <span>{STUDY_DESIGN_LABEL[study.design]}</span>
        <Sep />
        <time dateTime={study.publishedAt}>{study.publishedAt.slice(0, 4)}</time>
      </p>
      <Heading className="m-0 t-name-sm text-fg">{study.title}</Heading>
      <p className="m-0 t-small text-fg-muted">
        {study.population}
        <Sep />
        <span data-numeric>
          {study.participants.toLocaleString("en-US")}
          {NBSP}
          {study.participants === 1 ? "person" : "people"}
        </span>
        {study.duration ? (
          <>
            <Sep />
            {study.duration}
          </>
        ) : null}
      </p>
      <p className="m-0 t-body text-fg-body">{study.result}</p>
      {study.effect ? <EffectMarker effect={study.effect} /> : null}
      {study.funding ? (
        <p className="m-0 flex items-start gap-2 t-caption text-fg-muted">
          <Info aria-hidden="true" size={14} strokeWidth={2} className="mt-0.5 shrink-0" />
          {study.funding}
        </p>
      ) : null}
      <p className="m-0 border-t border-line pt-3 t-caption text-fg-muted">
        {shortCitation(reference)}, {reference.source}
        {href ? (
          <>
            <Sep />
            <a href={href} className="kit-focus kit-link rounded-ctl text-fg">
              Read the study<span className="sr-only">: {study.title}</span>
            </a>
          </>
        ) : null}
      </p>
    </article>
  );
}
