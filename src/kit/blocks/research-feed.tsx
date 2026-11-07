"use client";

import { useMemo, useState } from "react";

import { StudyCard } from "@/kit/components";
import type { Outcome, Study } from "@/kit/types";
import { Button, Chip } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface ResearchFeedProps {
  /** The studies, each with its outcome (`Study.outcome`), shown newest first. */
  studies: Study[];
  /** The outcomes, for the filter chips: only those with studies in the feed get one. */
  outcomes?: Outcome[];
  /** The heading (default “The research, study by study”). */
  heading?: string;
  /** How many studies show at first, and how many more each tap shows (default 4). */
  pageSize?: number;
  /** An anchor, unique on the page (default `research`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The studies behind a supplement’s evidence, newest first, as study cards
 * two across in a wide column: filter chips by outcome (“Muscle strength 1”)
 * narrow it, and “Show more” adds the next few. Screen readers hear how
 * many studies are showing after each change.
 *
 * **Use it for** the research section of a supplement’s page, after the
 * evidence table, or a page of new research. **Not for** what the studies
 * add up to (`EvidenceTable`), the sources in full (`ReferenceList`), or
 * readers’ reviews (`ReviewsSection`).
 *
 * @summary Study cards, newest first, filtered by outcome, with Show more.
 * @import import { ResearchFeed } from "@/kit/blocks";
 */
export function ResearchFeed({ studies, outcomes = [], heading = "The research, study by study", pageSize = 4, id = "research", className }: ResearchFeedProps) {
  const [filter, setFilter] = useState("all");
  const [limit, setLimit] = useState(pageSize);
  const newest = useMemo(() => [...studies].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)), [studies]);
  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const study of studies) if (study.outcome) map.set(study.outcome, (map.get(study.outcome) ?? 0) + 1);
    return map;
  }, [studies]);
  const filters = outcomes.filter((outcome) => counts.has(outcome.id));
  const matching = filter === "all" ? newest : newest.filter((study) => study.outcome === filter);
  const shown = matching.slice(0, limit);
  const left = matching.length - shown.length;
  const pick = (value: string) => {
    setFilter(value);
    setLimit(pageSize);
  };
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid scroll-mt-8 gap-5", className)}>
      <h2 id={`${id}-heading`} className="m-0 t-headline text-fg">
        {heading}
      </h2>
      {filters.length > 1 ? (
        <div role="group" aria-label="Show studies of" className="flex flex-wrap gap-2">
          <Chip label="All" count={studies.length} selected={filter === "all"} onClick={() => pick("all")} />
          {filters.map((outcome) => (
            <Chip key={outcome.id} label={outcome.name} count={counts.get(outcome.id)} selected={filter === outcome.id} onClick={() => pick(outcome.id)} />
          ))}
        </div>
      ) : null}
      <div className="grid items-start gap-4 @3xl:grid-cols-2">
        {shown.map((study) => (
          <StudyCard key={study.id} study={study} />
        ))}
      </div>
      <p aria-live="polite" className="sr-only">
        Showing {shown.length} of {matching.length} {matching.length === 1 ? "study" : "studies"}
      </p>
      {left > 0 ? (
        <Button onClick={() => setLimit(limit + pageSize)} className="justify-self-start">
          Show {Math.min(left, pageSize)} more {Math.min(left, pageSize) === 1 ? "study" : "studies"}
        </Button>
      ) : null}
    </section>
  );
}
