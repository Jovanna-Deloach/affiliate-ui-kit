import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { BuyLink } from "./buy";

const meta = {
  title: "Kit/Primitives/Buy link",
  component: BuyLink,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
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
    placement: "deep-dive",
  },
} satisfies Meta<typeof BuyLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A retailer link in running text. Name the price and the retailer in the
 * link, so it reads as a fact and still makes sense out of context.
 * @summary A retailer link inside a sentence, naming the price and the retailer.
 */
export const InProse: Story = {
  args: { children: "$3,950 at Haus & Field" },
  render: (args) => (
    <p className="m-0 max-w-measure t-body text-fg-body">
      Our pick is <BuyLink {...args} />, the lowest price we found from a retailer with the watch in stock.
    </p>
  ),
};

/**
 * With no label of its own the link says “Buy at {merchant}”: for a table
 * cell where a pill would be too loud.
 * @summary The default label, “Buy at {merchant}”.
 */
export const DefaultLabel: Story = {};
