import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { peakSummary } from "@/fixtures/kit/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";
import { Button } from "@/kit/ui";

import { RatingSummary } from "./rating-summary";

const meta = {
  title: "Components/Rating summary",
  component: RatingSummary,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { summary: peakSummary, scoreHref: "#how-scores-work", onSelectStars: fn() },
} satisfies Meta<typeof RatingSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product’s 1,284 reviews in numbers, with the way to add one. Each row of
 * the spread filters the list below it.
 * @summary 4.4 from 1,284 reviews, the spread, and Write a review.
 */
export const WithWriteAction: Story = {
  args: { action: <Button>Write a review</Button> },
};

/**
 * The list filtered to the 1- and 2-star reviews: their rows are marked.
 * @summary Filtered to 1 and 2 stars.
 */
export const Filtered: Story = { args: { selected: [1, 2] } };

/**
 * Rows as links, for a page that filters its reviews on the server.
 * @summary The spread as links (?stars=5).
 */
export const AsLinks: Story = { args: { onSelectStars: undefined, starHref: (stars: number) => `?stars=${stars}` } };
