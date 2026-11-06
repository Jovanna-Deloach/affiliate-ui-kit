import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { singleRetailerProduct, soldOutProduct } from "@/fixtures/kit/cases";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { BuyBlock } from "./buy-block";

const meta = {
  title: "Components/Buy box",
  component: BuyBlock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    product: watchesGuide.picks[0]!.product,
    placement: "deep-dive",
    disclosureHref: "#disclosure",
  },
} satisfies Meta<typeof BuyBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product with three retailers: the lowest in-stock price as the offer
 * card, the next as a row with its difference, the sold-out one last, then
 * the inline disclosure. Pass the product; the buy box ranks the offers.
 * @summary The buy box for a product sold by several retailers.
 */
export const SeveralRetailers: Story = {};

/**
 * The partner retailer charges $160, an independent $149: the $149 offer
 * leads. A partner relationship never moves an offer up.
 * @summary Lowest price first, even when the partner is more expensive.
 */
export const LowestPriceFirst: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { product: runningGuide.picks[1]!.product },
};

/**
 * One retailer: the offer card alone, with no “Best price” and no rows.
 * @summary A product sold by a single retailer.
 */
export const SingleRetailer: Story = {
  args: { product: singleRetailerProduct },
};

/**
 * Every retailer is out of stock: a plain notice replaces the offer card
 * and the rows show where it was last available. No button.
 * @summary A product sold out everywhere: a notice and no button.
 */
export const SoldOutEverywhere: Story = {
  args: { product: soldOutProduct },
};
