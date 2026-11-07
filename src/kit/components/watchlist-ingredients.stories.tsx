import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { multiLabReport } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { WatchlistIngredients } from "./watchlist-ingredients";

const meta = {
  title: "Components/Watchlist ingredients",
  component: WatchlistIngredients,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "card" },
  play: assertKitPage,
  args: { items: multiLabReport.watchlist, href: "#watchlist-method" },
} satisfies Meta<typeof WatchlistIngredients>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A multivitamin’s coating: a synthetic dye and a whitener, each with why it is flagged.
 * @summary Two additives, and why each is on the watchlist.
 */
export const TwoAdditives: Story = {};

/**
 * A product with nothing on the watchlist.
 * @summary None found.
 */
export const NoneFound: Story = { args: { items: [] } };
