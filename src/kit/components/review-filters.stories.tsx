import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn, userEvent, within } from "storybook/test";

import { peakSummary } from "@/fixtures/kit/reviews";
import { ALL_REVIEWS } from "@/kit/lib/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ReviewFilters } from "./review-filters";

const meta = {
  title: "Components/Review filters",
  component: ReviewFilters,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { query: ALL_REVIEWS, onChange: fn(), summary: peakSummary, counts: { verified: 912, withReplies: 64 }, resultCount: 1284 },
} satisfies Meta<typeof ReviewFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The filters in a sidebar, nothing applied yet.
 * @summary The filter panel, nothing applied.
 */
export const Panel: Story = {};

/**
 * Narrowed to verified 1- and 2-star reviews.
 * @summary Verified 1- and 2-star reviews only.
 */
export const Applied: Story = {
  args: { query: { ...ALL_REVIEWS, stars: [1, 2], verifiedOnly: true }, resultCount: 48 },
};

/**
 * On a phone: a Filters button with how many are applied, opening the same
 * filters in a sheet whose button shows how many reviews they leave.
 * @summary The Filters button and its sheet, on a phone.
 */
export const OnAPhone: Story = {
  args: { variant: "drawer", query: { ...ALL_REVIEWS, stars: [1, 2], verifiedOnly: true }, resultCount: 48 },
  play: async (context) => {
    await userEvent.click(within(context.canvasElement).getByRole("button", { name: /Filters/ }));
    await assertKitPage(context);
  },
};
