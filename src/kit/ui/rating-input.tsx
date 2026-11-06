import { CircleAlert, Star } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cn } from "@/lib/cn";

const WORDS = ["Bad", "Poor", "Average", "Great", "Excellent"];

export interface RatingInputProps {
  /** The question, as a heading for the stars (default “Your rating”). */
  legend?: string;
  /** The radios’ shared name, for the form (default `rating`). */
  name?: string;
  /** The stars picked, when the page keeps the state (with `onValueChange`). */
  value?: number;
  /** The stars picked first, when the input keeps its own state. */
  defaultValue?: number;
  /** Called with the stars the reader picks, 1 to 5. */
  onValueChange?: (stars: number) => void;
  /** A rating is required to send the form (default true). */
  required?: boolean;
  /** What went wrong: “Pick a rating from 1 to 5 stars.” */
  error?: ReactNode;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * Five stars to pick a rating from, each a 44px target named for screen
 * readers (“4 stars, Great”). Native radios: arrow keys move between them,
 * and it works in a plain form with no script. Picking a star fills it and
 * every star before it.
 *
 * **Use it for** the rating in a review form. **Not for** showing a rating
 * (`StarRating`) or filtering by rating (`Checkbox`, `RatingBar`).
 *
 * @summary Five stars to pick a rating from, in a review form; native radios.
 * @import import { RatingInput } from "@/kit/ui";
 */
export function RatingInput({ legend = "Your rating", name = "rating", value, defaultValue, onValueChange, required = true, error, className }: RatingInputProps) {
  const id = useId();
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined} aria-invalid={error ? true : undefined} className={cn("m-0 min-w-0 border-0 p-0", className)}>
      <legend className="p-0 t-ui font-semibold text-fg">{legend}</legend>
      <div className="mt-1 -ml-2.5 flex">
        {[1, 2, 3, 4, 5].map((stars) => (
          <label
            key={stars}
            className="relative grid size-11 cursor-pointer place-items-center rounded-ctl text-line-strong transition-colors duration-(--dur) ease-(--ease) hover:text-fg-muted has-[:checked]:text-fg has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[-2px] has-[:focus-visible]:outline-accent [&:has(~label_input:checked)]:text-fg"
          >
            <input
              type="radio"
              name={name}
              value={stars}
              required={required && stars === 1 ? true : undefined}
              {...(value === undefined ? { defaultChecked: stars === defaultValue } : { checked: stars === value })}
              onChange={onValueChange ? () => onValueChange(stars) : undefined}
              className="sr-only"
            />
            <Star aria-hidden="true" size={28} strokeWidth={0} fill="currentColor" />
            <span className="sr-only">
              {stars} {stars === 1 ? "star" : "stars"}, {WORDS[stars - 1]}
            </span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="m-0 mt-1 flex items-start gap-1.5 t-small text-fail">
          <CircleAlert aria-hidden="true" size={16} strokeWidth={2} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
