import { EVIDENCE_GRADES } from "@/kit/lib/evidence";
import type { Grade } from "@/kit/types";
import { GradeBadge } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface GradeLegendProps {
  /** Each grade and what it means, best first. Default: the evidence grades, A to F (`EVIDENCE_GRADES`); pass `LAB_GRADES` from `@/kit/lib/evidence` for lab grades. */
  grades?: readonly { grade: Grade; meaning: string }[];
  /** The heading (default “What the grades mean”). */
  heading?: string;
  /** What the grades grade, for screen readers: “Evidence grade” (default), “Lab grade”. */
  label?: string;
  /** The tones: `evidence` (default), where D is gray, or `lab`, where D is red. Pass `lab` with `LAB_GRADES`. */
  scale?: "evidence" | "lab";
  /** The heading’s level: `h2`, or `h3` inside a section (default). */
  as?: "h2" | "h3";
  /** An anchor, unique on the page (default `grades`). */
  id?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * What each grade means, best first: the grade in its circle, then a
 * sentence. For evidence, from A (several mostly consistent studies show at
 * least a moderate effect) to F (the research points to harm); for lab
 * grades, the score band behind each letter and what it takes.
 *
 * **Use it for** the method section, or beside an evidence table or a
 * ranking when the page explains its grades in full. **Not for** the
 * explanation one tap away (the evidence table has its own `Explainer`), or
 * one product’s grade (`GradeScale`).
 *
 * @summary What each grade means, A to F, for evidence or for lab results.
 * @import import { GradeLegend } from "@/kit/components";
 */
export function GradeLegend({ grades = EVIDENCE_GRADES, heading = "What the grades mean", label = "Evidence grade", scale = "evidence", as: Heading = "h3", id = "grades", className }: GradeLegendProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("grid gap-4", className)}>
      <Heading id={`${id}-heading`} className="m-0 t-name-sm text-fg">
        {heading}
      </Heading>
      <dl className="m-0 grid gap-3">
        {grades.map(({ grade, meaning }) => (
          <div key={grade} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3">
            <dt>
              <GradeBadge grade={grade} label={label} scale={scale} />
            </dt>
            <dd className="m-0 max-w-measure t-small text-fg-body">{meaning}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
