import type { ReviewLabel as ReviewLabelKind } from "@/kit/types";

import { Badge } from "./badge";
import { Explainer } from "./explainer";

/** What each label says, and what it means when a reader taps it. */
export const REVIEW_LABELS: Record<ReviewLabelKind, { text: string; meaning: string; tone: "neutral" | "pass" | "warn" }> = {
  verified: { text: "Verified", meaning: "We matched this review to an order from a retailer.", tone: "pass" },
  invited: { text: "Invited", meaning: "The brand or our site asked this customer for a review after their order.", tone: "neutral" },
  unprompted: { text: "Unprompted", meaning: "The reviewer came to write this on their own.", tone: "neutral" },
  incentivized: { text: "Incentivized", meaning: "The reviewer got the product free, or was paid, before writing this.", tone: "warn" },
  tester: { text: "Our tester", meaning: "Written by one of our testers, who bought the product at retail.", tone: "neutral" },
};

export interface ReviewLabelProps {
  /** How the review reached the site. */
  label: ReviewLabelKind;
  /** Where the site explains every label (“How we label reviews”), linked from the explanation. */
  href?: string;
}

/**
 * How a review reached the site, as a small label that explains itself on
 * tap: Verified, Invited, Unprompted, Incentivized or Our tester. Readers
 * weigh reviews by it, so every review shows its labels.
 *
 * **Use it for** each label on a review (`ReviewCard` shows them). **Not for**
 * a product's status or a test result (`Badge`, `ResultMark`).
 *
 * @summary How a review reached the site (Verified, Invited…), explained on tap.
 * @import import { ReviewLabel } from "@/kit/ui";
 */
export function ReviewLabel({ label, href }: ReviewLabelProps) {
  const { text, meaning, tone } = REVIEW_LABELS[label];
  return (
    <Explainer
      label={`What does ${text} mean?`}
      title={label === "tester" ? "Tester review" : `${text} review`}
      trigger={
        <button type="button" className="kit-focus inline-flex min-h-6 cursor-pointer items-center rounded-full">
          <Badge variant="soft" tone={tone}>
            {text}
          </Badge>
        </button>
      }
    >
      <p>
        {meaning}
        {href ? (
          <>
            {" "}
            <a href={href}>How we label reviews</a>
          </>
        ) : null}
      </p>
    </Explainer>
  );
}
