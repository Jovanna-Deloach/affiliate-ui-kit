import { gradeWords } from "@/kit/lib/discovery";
import type { Grade } from "@/kit/types";
import { cn } from "@/lib/cn";

/* The letter’s band sets the tone: A and F are filled, B and D tinted, C outlined in amber. */
const TONE = {
  A: "bg-pass text-paper",
  B: "bg-pass-soft text-pass ring-1 ring-pass ring-inset",
  C: "bg-paper text-warn ring-1 ring-warn ring-inset",
  D: "bg-fail-soft text-fail ring-1 ring-fail ring-inset",
  F: "bg-fail text-paper",
} as const;

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
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * A letter grade in a circle, A+ to F, for test results or for the strength
 * of evidence. The letter carries the meaning; the tone backs it up: A filled
 * green, B tinted green, C outlined amber, D tinted red, F filled red. Screen
 * readers hear “Grade A minus”.
 *
 * **Use it for** a product’s test grade in a card, a ranking row or its
 * header, and an outcome’s evidence grade. **Not for** the site’s score out
 * of 10 (`Scorecard`), a pass or fail on one test (`ResultMark`), or an
 * award (`Award`).
 *
 * @summary A letter grade, A+ to F, in a circle toned by its band.
 * @import import { GradeBadge } from "@/kit/ui";
 */
export function GradeBadge({ grade, label = "Grade", size = "md", className }: GradeBadgeProps) {
  const band = grade[0] as keyof typeof TONE;
  return (
    <span role="img" aria-label={`${label} ${gradeWords(grade)}`} className={cn("inline-flex shrink-0 items-center justify-center rounded-full leading-none", TONE[band], SIZE[size], className)}>
      <span aria-hidden="true">{grade.replace("-", "−")}</span>
    </span>
  );
}
