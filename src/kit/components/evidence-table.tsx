"use client";

import { ArrowDown, ChevronsUpDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { EVIDENCE_GRADES, sortOutcomes, type OutcomeSort } from "@/kit/lib/evidence";
import type { Outcome } from "@/kit/types";
import { EffectMarker, Explainer, GradeBadge } from "@/kit/ui";
import { cn } from "@/lib/cn";

const CONSISTENCY = { high: "High", moderate: "Moderate", low: "Low" } as const;
const SORT_WORDS: Record<OutcomeSort, string> = { grade: "grade, strongest evidence first", studies: "number of studies, most first", name: "outcome, A to Z" };

const studiesWords = (outcome: Outcome) =>
  `${outcome.studies} ${outcome.studies === 1 ? "study" : "studies"}${outcome.consistency ? `, ${CONSISTENCY[outcome.consistency].toLowerCase()} consistency` : ""}`;

function SortButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  const Icon = active ? ArrowDown : ChevronsUpDown;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("kit-focus -mx-1 inline-flex min-h-11 items-center gap-1 rounded-ctl px-1 t-micro", active ? "text-fg" : "text-fg-muted hover:text-fg")}
    >
      {children}
      <Icon aria-hidden="true" size={14} strokeWidth={2} />
    </button>
  );
}

export interface EvidenceTableProps {
  /** The outcomes studied: each one’s effect, its size, how consistent the studies are, how many there are, and its evidence grade. */
  outcomes: Outcome[];
  /** The heading (default “What the research says”). */
  heading?: string;
  /** A line under the heading: what the grades rest on, and how recent the research is. */
  intro?: string;
  /** The order on load: `grade` strongest evidence first (default), `studies` most first, or `name` A to Z. */
  defaultSort?: OutcomeSort;
  /** The heading’s level: `h2` (default), or `h3` inside a section. */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `evidence`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What the research says, outcome by outcome: the effect and its size, how
 * consistent the studies are, how many there are, and the evidence grade,
 * with what each grade means one tap away. Readers sort it by grade, by
 * number of studies or by name. In a narrow column the effect and the
 * number of studies move under the outcome’s name, so it stays a table of
 * two columns on a phone.
 *
 * **Use it for** the evidence section of a supplement’s page: every outcome
 * it is studied for, the ones that failed included. **Not for** one study
 * (`StudyCard`), lab results (`AssayTable`), or products side by side
 * (`ComparisonMatrix`).
 *
 * @summary Outcomes with effect, consistency, number of studies and grade; sortable.
 * @import import { EvidenceTable } from "@/kit/components";
 */
export function EvidenceTable({ outcomes, heading = "What the research says", intro, defaultSort = "grade", as: Heading = "h2", id = "evidence", className }: EvidenceTableProps) {
  const [sort, setSort] = useState<OutcomeSort>(defaultSort);
  const sorted = useMemo(() => sortOutcomes(outcomes, sort), [outcomes, sort]);
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("@container grid scroll-mt-8 gap-4", className)}>
      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <Heading id={`${id}-heading`} className="m-0 t-headline text-fg">
            {heading}
          </Heading>
          <Explainer label="What do the evidence grades mean?" title="Evidence grades">
            <dl className="m-0 grid gap-2">
              {EVIDENCE_GRADES.map(({ grade, meaning }) => (
                <div key={grade} className="grid grid-cols-[1.75rem_minmax(0,1fr)] items-start gap-2">
                  <dt>
                    <GradeBadge grade={grade} size="sm" label="Evidence grade" scale="evidence" />
                  </dt>
                  <dd className="m-0 t-small text-fg-body">{meaning}</dd>
                </div>
              ))}
            </dl>
          </Explainer>
        </div>
        {intro ? <p className="m-0 max-w-measure t-body text-fg-body">{intro}</p> : null}
      </div>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          {heading}, sorted by {SORT_WORDS[sort]}
        </caption>
        <thead>
          <tr className="border-b border-line-strong">
            <th scope="col" aria-sort={sort === "name" ? "ascending" : undefined} className="py-1 pr-4 font-normal">
              <SortButton active={sort === "name"} onClick={() => setSort("name")}>
                Outcome
              </SortButton>
            </th>
            <th scope="col" className="hidden py-1 pr-4 t-micro font-normal text-fg-muted @2xl:table-cell">
              Effect
            </th>
            <th scope="col" className="hidden py-1 pr-4 t-micro font-normal text-fg-muted @2xl:table-cell">
              Consistency
            </th>
            <th scope="col" aria-sort={sort === "studies" ? "descending" : undefined} className="hidden py-1 pr-4 font-normal @2xl:table-cell">
              <SortButton active={sort === "studies"} onClick={() => setSort("studies")}>
                Studies
              </SortButton>
            </th>
            <th scope="col" aria-sort={sort === "grade" ? "ascending" : undefined} className="w-20 py-1 font-normal">
              <SortButton active={sort === "grade"} onClick={() => setSort("grade")}>
                Grade
              </SortButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((outcome) => (
            <tr key={outcome.id} className="border-b border-line align-top">
              <th scope="row" className="py-4 pr-4 text-left font-normal">
                <span className="block t-ui font-semibold text-fg">
                  {outcome.href ? (
                    <a href={outcome.href} className="kit-focus kit-link rounded-ctl">
                      {outcome.name}
                    </a>
                  ) : (
                    outcome.name
                  )}
                </span>
                {outcome.summary ? <span className="mt-1 block max-w-measure t-small text-fg-body">{outcome.summary}</span> : null}
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 @2xl:hidden">
                  <EffectMarker effect={outcome.effect} size={outcome.size} />
                  <span data-numeric className="t-caption text-fg-muted">
                    {studiesWords(outcome)}
                  </span>
                </span>
              </th>
              <td className="hidden py-4 pr-4 @2xl:table-cell">
                <EffectMarker effect={outcome.effect} size={outcome.size} />
              </td>
              <td className="hidden py-4 pr-4 t-small text-fg-body @2xl:table-cell">{outcome.consistency ? CONSISTENCY[outcome.consistency] : "One study"}</td>
              <td data-numeric className="hidden py-4 pr-4 t-small text-fg @2xl:table-cell">
                {outcome.studies}
              </td>
              <td className="py-4">
                <GradeBadge grade={outcome.grade} size="sm" label="Evidence grade" scale="evidence" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
