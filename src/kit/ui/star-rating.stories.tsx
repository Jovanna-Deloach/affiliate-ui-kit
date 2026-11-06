import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { StarRating } from "./star-rating";

const meta = {
  title: "Primitives/Star rating",
  component: StarRating,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { value: 4.4, showValue: true },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product’s average: four and two-fifths stars, with the number beside
 * them, since the number is the fact.
 * @summary An average of 4.4, stars and number.
 */
export const Average: Story = {};

/**
 * One review’s rating, small, in whole stars, without the number.
 * @summary A single review’s 2 stars, small.
 */
export const OneReview: Story = { args: { value: 2, size: "sm", showValue: false } };

/**
 * Large, beside a big average at the top of a review section.
 * @summary Large stars for a section’s headline average.
 */
export const Large: Story = { args: { value: 3.8, size: "lg" } };
