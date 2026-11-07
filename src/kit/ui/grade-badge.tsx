import { gradeWords } from "@/kit/lib/discovery";
import type { Grade } from "@/kit/types";
import { cn } from "@/lib/cn";

/** Each grade band’s tone: A and F filled, B and D tinted, C outlined in amber. `GradeScale` uses it too. */
export const GRADE_TONE = {
  A: "bg-pass text-paper",
  B: "bg-pass-soft text-pass ring-1 ring-pass ring-inset",
  C: "bg-paper text-warn ring-1 ring-warn ring-inset",
  D: "bg-fail-soft text-fail ring-1 ring-fail ring-inset",
  F: "bg-fail text-paper",
} as const;

/**
 * The evidence scale: as the lab scale, except D, which means the research
 * found little or nothing, is gray, not red; only F (harm) is red.
 */
const EVIDENCE_TONE = { ...GRADE_TONE, D: "bg-well text-fg-muted ring-1 ring-line-strong ring-inset" } as const;

const SIZE = {
  sm: "size-7 t-caption font-semibold",
  md: "size-10 t-ui font-bold",
  lg: "size-14 t-title",
} as const;

export interface GradeBadgeProps {
  /** The grade, A+ to F (`B-` is shown as B−). */
  grade: Grade;
  /** What it grades, for screen readers: “Grade” (default), “Lab grade”, “Evidence grade”. */
  label?: string;
  /** `sm` 28px, rows and cards · `md` 40px (default) · `lg` 56px, a product’s header. */
  size?: keyof typeof SIZE;
  /** `lab` a test result (default): D is tinted red · `evidence` how strong the research is: D, little or no effect found, is gray. */
  scale?: "lab" | "evidence";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A letter grade in a circle, A+ to F, for test results or for the strength
 * of evidence. The letter carries the meaning; the tone backs it up: A filled
 * green, B tinted green, C outlined amber, D tinted red, F filled red. On
 * the evidence scale D is gray: it means the research found little or no
 * effect, not harm. Screen readers hear “Grade A minus”.
 *
 * **Use it for** a product’s test grade in a card, a ranking row or its
 * header, and an outcome’s evidence grade. **Not for** the site’s score out
 * of 10 (`Scorecard`), a pass or fail on one test (`ResultMark`), or an
 * award (`Award`).
 *
 * @summary A letter grade, A+ to F, in a circle toned by its band.
 * @import import { GradeBadge } from "@/kit/ui";
 */
export function GradeBadge({ grade, label = "Grade", size = "md", scale = "lab", className }: GradeBadgeProps) {
  const band = grade[0] as keyof typeof GRADE_TONE;
  const tone = scale === "evidence" ? EVIDENCE_TONE : GRADE_TONE;
  return (
    <span role="img" aria-label={`${label} ${gradeWords(grade)}`} className={cn("inline-flex shrink-0 items-center justify-center rounded-full leading-none", tone[band], SIZE[size], className)}>
      <span aria-hidden="true">{grade.replace("-", "−")}</span>
    </span>
  );
}
