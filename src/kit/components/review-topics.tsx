import type { ReviewTopic } from "@/kit/types";
import { Chip } from "@/kit/ui";
import { cn } from "@/lib/cn";

export interface ReviewTopicsProps {
  /** What reviewers mention, most mentioned first. */
  topics: ReviewTopic[];
  /** The topic the list is filtered to. */
  selected?: string;
  /** Filter in the page: called with the topic picked, or `undefined` to clear it. */
  onSelect?: (id: string | undefined) => void;
  /** Filter by link: the address of the reviews that mention a topic. */
  topicHref?: (id: string) => string;
  /** The heading over the topics (default “What reviewers mention”). */
  heading?: string;
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

/**
 * The things reviewers talk about, with how many reviews mention each, as
 * chips that filter the list to those reviews. Picking a topic again clears
 * it.
 *
 * **Use it for** a review section, under the summary. **Not for** a product's
 * features or categories (`Chip` links), or applied filters (`Chip` with
 * `onRemove`).
 *
 * @summary What reviewers mention, with counts, as chips that filter the reviews.
 * @import import { ReviewTopics } from "@/kit/components";
 */
export function ReviewTopics({ topics, selected, onSelect, topicHref, heading = "What reviewers mention", className }: ReviewTopicsProps) {
  return (
    <div className={cn("grid gap-3", className)}>
      <p className="m-0 t-micro text-fg-muted">{heading}</p>
      <ul aria-label={heading} className="m-0 flex list-none flex-wrap gap-2 p-0">
        {topics.map((topic) => (
          <li key={topic.id}>
            <Chip
              label={topic.label}
              count={topic.mentions}
              selected={topic.id === selected}
              onClick={onSelect ? () => onSelect(topic.id === selected ? undefined : topic.id) : undefined}
              href={onSelect ? undefined : topicHref?.(topic.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
