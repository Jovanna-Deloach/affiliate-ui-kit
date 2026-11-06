import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { OfferCard } from "./offer-card";

const meta = {
  title: "Kit/Components/Offer card",
  component: OfferCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    offer: {
      id: "meridian-hf",
      merchantName: "Haus & Field",
      price: 3950,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/haus-field/meridian-hf",
      inStock: true,
      shippingNote: "Free 2-day shipping",
    },
    productId: "w-halden-meridian-40",
    verifiedAt: "2026-10-28T10:00:00Z",
    best: true,
    placement: "deep-dive",
  },
} satisfies Meta<typeof OfferCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The top of a buy box: the lowest in-stock price, the retailer’s terms and
 * when the price was checked, “Best price” because another retailer has it
 * for more, and the one button.
 * @summary The lead offer, with “Best price” and the date the price was checked.
 */
export const LeadOffer: Story = {};

/**
 * A lead offer below its list price: the list price is struck through
 * before the amount, so the saving reads without a percentage.
 * @summary A discounted lead offer (Assay, running).
 */
export const Discounted: Story = {
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
      shippingNote: "Free returns",
    },
    productId: "r-meridian-aerolite-3",
  },
};

/**
 * The only retailer with stock: nothing to be best against, so no mark.
 * “Best price” is a claim, and the kit only makes true ones.
 * @summary A sole in-stock retailer: no “Best price”.
 */
export const OnlyRetailer: Story = {
  args: {
    offer: {
      id: "field-bren",
      merchantName: "Brennan",
      price: 890,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/brennan/field-bren",
      inStock: true,
      shippingNote: "Free shipping and returns",
    },
    productId: "w-brennan-field-36",
    best: false,
  },
};

/**
 * In a narrow card the terms stack under the merchant and the price drops
 * beneath them; the button keeps the full width.
 * @summary The offer card in a narrow container.
 */
export const NarrowCard: Story = {
  parameters: { frame: "narrow-card" },
};

/**
 * The button label can name the next step more precisely than “View deal”.
 * @summary An offer card with its own button label.
 */
export const CustomLabel: Story = {
  args: { ctaLabel: "Check today’s price at Haus & Field" },
};
