import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { BuyPill } from "./buy";

const meta = {
  title: "Primitives/Buy pill",
  component: BuyPill,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: {
    offer: {
      id: "tide-verra",
      merchantName: "Verra",
      price: 1650,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/verra/tide-verra",
      inStock: true,
    },
    productId: "w-okada-tide-40",
    placement: "comparison",
  },
} satisfies Meta<typeof BuyPill>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every row of a comparison table after the first: a bordered pill beside
 * the price and retailer it buys, quiet enough to repeat down a column.
 * @summary The bordered pill for every table row but the top pick.
 */
export const Bordered: Story = {};

/**
 * The table’s first row, our pick, takes the filled pill: the one place in
 * the table the action colour appears.
 * @summary The filled pill, for the top pick’s row only.
 */
export const Filled: Story = {
  args: {
    offer: {
      id: "meridian-hf",
      merchantName: "Haus & Field",
      price: 3950,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/haus-field/meridian-hf",
      inStock: true,
    },
    productId: "w-halden-meridian-40",
    filled: true,
  },
};

/**
 * In a catalogue card nothing else names the retailer, so the pill does:
 * “Buy at Brennan”.
 * @summary A pill that names its retailer, for catalogue cards.
 */
export const NamesTheRetailer: Story = {
  args: {
    offer: {
      id: "field-bren",
      merchantName: "Brennan",
      price: 890,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/brennan/field-bren",
      inStock: true,
    },
    productId: "w-brennan-field-36",
    placement: "catalogue",
    children: "Buy at Brennan",
  },
};
