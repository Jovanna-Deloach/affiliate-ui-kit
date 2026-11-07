import { gradeWords } from "@/kit/lib/discovery";
import type { Grade } from "@/kit/types";
import { cn } from "@/lib/cn";

import { GRADE_TONE } from "./grade-badge";

const BANDS = ["A", "B", "C", "D", "F"] as const;

export interface GradeScaleProps {
  /** The grade to mark, A+ to F: its band is filled in the band’s tone and shows the full grade (“A−”). */
  grade: Grade;
  /** What it grades, for screen readers: “Lab grade” (default), “Evidence grade”. */
  label?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The five grade bands, A to F, side by side, with this product’s band
 * filled in its tone and showing the full grade (“A−”); the other bands stay
 * gray. Screen readers hear it as one image: “Lab grade A minus, on a scale
 * from A to F”.
 *
 * **Use it for** a product’s grade in the header of its lab report, beside
 * its score, so readers see where it sits. **Not for** a grade in a row or a
 * card (`GradeBadge`), or what each grade means (`GradeLegend`).
 *
 * @summary The five grade bands, A to F, with this product’s band filled.
 * @import import { GradeScale } from "@/kit/ui";
 */
export function GradeScale({ grade, label = "Lab grade", className }: GradeScaleProps) {
  const band = grade[0] as (typeof BANDS)[number];
  return (
    <div role="img" aria-label={`${label} ${gradeWords(grade)}, on a scale from A to F`} className={cn("grid max-w-xs grid-cols-5 gap-1", className)}>
      {BANDS.map((b) => (
        <span key={b} className={cn("flex h-9 items-center justify-center rounded-ctl t-ui font-semibold", b === band ? GRADE_TONE[b] : "bg-well text-fg-muted")}>
          {b === band ? grade.replace("-", "−") : b}
        </span>
      ))}
    </div>
  );
}
