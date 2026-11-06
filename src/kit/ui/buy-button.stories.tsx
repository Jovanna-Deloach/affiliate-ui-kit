import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { BuyButton } from "./buy";

const meta = {
  title: "Kit/Primitives/Buy button",
  component: BuyButton,
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
    placement: "verdict-hero",
    icon: true,
  },
} satisfies Meta<typeof BuyButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The pick in view: the one filled button on screen, labelled with the
 * retailer it goes to. Every verdict hero and offer card ends with one.
 * @summary The filled button for the pick in view (“Buy at {merchant}”).
 */
export const Primary: Story = {};

/**
 * Every other card in view gets the outlined button, so the reader’s eye
 * goes to one action at a time.
 * @summary The outlined button for every card that is not the pick in view.
 */
export const Secondary: Story = {
  args: {
    offer: {
      id: "marine-ws",
      merchantName: "Watchstore",
      price: 420,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/watchstore/marine-ws",
      inStock: true,
    },
    productId: "w-sato-marine-38",
    placement: "verdict-card",
    emphasis: "secondary",
  },
};

/**
 * The offer card’s button spans the card under the price, with a label that
 * says what happens next.
 * @summary A full-width button with its own label, as in the offer card.
 */
export const FullWidthWithLabel: Story = {
  parameters: { frame: "narrow" },
  args: { placement: "deep-dive", fullWidth: true, children: "View deal at Haus & Field" },
};

/**
 * In the Assay theme the action colour is obsidian; the label and the rule
 * (one filled button per pick in view) do not change.
 * @summary The primary button in the Assay theme.
 */
export const Assay: Story = {
  parameters: { theme: "assay", category: "running" },
  args: {
    offer: {
      id: "aerolite-nl",
      merchantName: "Northlane",
      price: 189,
      originalPrice: 220,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/northlane/aerolite-nl",
      inStock: true,
    },
    productId: "r-meridian-aerolite-3",
  },
};
