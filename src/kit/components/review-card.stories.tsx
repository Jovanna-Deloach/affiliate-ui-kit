import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { peakReviews, REVIEWS_NOW, testerReviews } from "@/fixtures/kit/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ReviewCard } from "./review-card";

const meta = {
  title: "Components/Review card",
  component: ReviewCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { review: peakReviews[1]!, now: REVIEWS_NOW, labelsHref: "#labels", reportHref: "/report" },
} satisfies Meta<typeof ReviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A critical review the brand answered: two stars, Verified and Invited,
 * 48 readers found it useful, and the brand’s reply under it.
 * @summary A 2-star verified review with the brand’s reply.
 */
export const WithBrandReply: Story = {};

/**
 * A five-star review, verified, that came unprompted.
 * @summary A 5-star verified, unprompted review.
 */
export const Verified: Story = { args: { review: peakReviews[0]! } };

/**
 * A review written after a free product: shown like any other, and labeled.
 * @summary An incentivized review, labeled.
 */
export const Incentivized: Story = { args: { review: peakReviews[7]! } };

/**
 * A review by one of the site’s testers, with their role and portrait; no
 * Useful vote.
 * @summary A tester’s review, with role and portrait.
 */
export const ByATester: Story = { args: { review: testerReviews[0]!, reportHref: undefined } };
