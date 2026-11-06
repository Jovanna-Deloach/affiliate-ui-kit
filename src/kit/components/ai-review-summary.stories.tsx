import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { peakAiSummary, peakReviews } from "@/fixtures/kit/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";

import { AiReviewSummary } from "./ai-review-summary";

const meta = {
  title: "Components/AI review summary",
  component: AiReviewSummary,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { summary: peakAiSummary, reviews: peakReviews },
} satisfies Meta<typeof AiReviewSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What ten reviews say, labeled as written by AI, with the three reviews it
 * draws on linked under it.
 * @summary A labeled AI summary of ten reviews, with its sources.
 */
export const Summary: Story = {};

/**
 * The same summary under a heading of the page’s own.
 * @summary With its own heading.
 */
export const OwnHeading: Story = { args: { heading: "Reviews in short" } };
