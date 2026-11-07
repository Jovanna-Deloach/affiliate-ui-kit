import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { RatingBar } from "./rating-bar";

const meta = {
  title: "Primitives/Rating bar",
  component: RatingBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { stars: 5, count: 815, total: 1284, onClick: fn() },
} satisfies Meta<typeof RatingBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The 5-star row of a spread, as a filter in the page.
 * @summary The 5-star row: 815 of 1,284 reviews, as a filter.
 */
export const FiveStars: Story = {};

/**
 * The 1-star row while the list shows only 1-star reviews: marked, and
 * announced as pressed.
 * @summary The 1-star row, selected.
 */
export const Selected: Story = { args: { stars: 1, count: 52, selected: true } };

/**
 * A row that is a link to the reviews with that rating, for a page that
 * filters on the server.
 * @summary A row that links to the 4-star reviews.
 */
export const AsLink: Story = { args: { stars: 4, count: 290, onClick: undefined, href: "?stars=4" } };
