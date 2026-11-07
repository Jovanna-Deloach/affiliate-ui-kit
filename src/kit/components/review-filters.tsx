"use client";

import { SlidersHorizontal } from "lucide-react";
import { useId } from "react";

import type { RatingSummary, ReviewQuery } from "@/kit/types";
import { Button, Checkbox, ChoiceGroup, Drawer, DrawerClose, Radio, SearchField } from "@/kit/ui";

const POSTED: { value: ReviewQuery["posted"]; label: string }[] = [
  { value: "all", label: "All reviews" },
  { value: "30d", label: "Last 30\u00a0days" },
  { value: "3m", label: "Last 3\u00a0months" },
  { value: "6m", label: "Last 6\u00a0months" },
  { value: "12m", label: "Last 12\u00a0months" },
];

/** How many filters a query applies, for the Filters button and Clear all. */
export function filterCount(query: ReviewQuery): number {
  return query.stars.length + Number(query.verifiedOnly) + Number(query.withReplies) + Number(query.posted !== "all") + Number(Boolean(query.topic)) + Number(Boolean(query.search.trim()));
}

export interface ReviewFiltersProps {
  /** What the list shows now. */
  query: ReviewQuery;
  /** Called with the new query whenever the reader changes a filter. */
  onChange: (query: ReviewQuery) => void;
  /** The reviews’ spread, for the count beside each rating. */
  summary: RatingSummary;
  /** How many reviews are verified and how many have a reply; a filter with none is not offered. */
  counts: { verified: number; withReplies: number };
  /** How many reviews the filters leave, for the drawer’s button (“Show 48 reviews”). */
  resultCount: number;
  /** `panel` the filters in place, for a sidebar (default) · `drawer` a Filters button that opens them in a sheet, for phones. */
  variant?: "panel" | "drawer";
  /** Placement only: margin, grid position, width. The look comes from the theme. */
  className?: string;
}

function Groups({ query, onChange, summary, counts }: Omit<ReviewFiltersProps, "variant" | "className" | "resultCount">) {
  const id = useId();
  const set = (patch: Partial<ReviewQuery>) => onChange({ ...query, ...patch });
  return (
    <div className="grid gap-6">
      <SearchField label="Search reviews" value={query.search} onValueChange={(search) => set({ search })} />
      <ChoiceGroup legend="Rating">
        {([5, 4, 3, 2, 1] as const).map((stars) => (
          <Checkbox
            key={stars}
            name="stars"
            value={stars}
            label={`${stars} ${stars === 1 ? "star" : "stars"}`}
            count={summary.distribution[stars - 1]}
            checked={query.stars.includes(stars)}
            onChange={(event) => set({ stars: event.target.checked ? [...query.stars, stars] : query.stars.filter((s) => s !== stars) })}
          />
        ))}
      </ChoiceGroup>
      {counts.verified > 0 || counts.withReplies > 0 ? (
        <ChoiceGroup legend="Reviews">
          {counts.verified > 0 ? (
            <Checkbox name="verified" label="Verified purchases only" count={counts.verified} checked={query.verifiedOnly} onChange={(event) => set({ verifiedOnly: event.target.checked })} />
          ) : null}
          {counts.withReplies > 0 ? (
            <Checkbox name="replies" label="With a reply from the brand" count={counts.withReplies} checked={query.withReplies} onChange={(event) => set({ withReplies: event.target.checked })} />
          ) : null}
        </ChoiceGroup>
      ) : null}
      <ChoiceGroup legend="Date posted">
        {POSTED.map((option) => (
          <Radio key={option.value} name={`posted-${id}`} value={option.value} label={option.label} checked={query.posted === option.value} onChange={() => set({ posted: option.value })} />
        ))}
      </ChoiceGroup>
    </div>
  );
}

/**
 * The filters of a review list: search, rating (with how many reviews give
 * each), verified purchases and brand replies (offered only when some
 * reviews have them), and when the reviews were posted. In a sidebar on wide
 * screens (`panel`); behind a Filters button that opens a sheet on phones
 * (`drawer`), whose button says how many reviews the filters leave.
 *
 * **Use it for** the review list of a product or brand (`ReviewsSection`
 * composes it). **Not for** filtering products (a ranking’s own filters), or
 * a list of a dozen reviews (show them all).
 *
 * @summary Review filters: search, rating, verified, replies, date; sidebar or sheet.
 * @import import { ReviewFilters } from "@/kit/components";
 */
export function ReviewFilters({ variant = "panel", resultCount, className, ...groups }: ReviewFiltersProps) {
  if (variant === "panel")
    return (
      <div className={className}>
        <Groups {...groups} />
      </div>
    );
  const applied = filterCount(groups.query);
  return (
    <Drawer
      title="Filter reviews"
      trigger={
        <Button className={className}>
          <SlidersHorizontal aria-hidden="true" size={16} strokeWidth={1.75} />
          Filters
          {applied ? (
            <span data-numeric className="grid size-5 place-items-center rounded-full bg-fg t-caption text-paper">
              {applied}
              <span className="sr-only"> applied</span>
            </span>
          ) : null}
        </Button>
      }
      footer={
        <DrawerClose>
          <Button emphasis="primary">
            Show {resultCount.toLocaleString("en-US")} {resultCount === 1 ? "review" : "reviews"}
          </Button>
        </DrawerClose>
      }
    >
      <Groups {...groups} />
    </Drawer>
  );
}
