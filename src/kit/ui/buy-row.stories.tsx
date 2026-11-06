import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { BuyRow } from "./buy";

const meta = {
  title: "Primitives/Buy row",
  component: BuyRow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    offer: {
      id: "meridian-verra",
      merchantName: "Verra",
      price: 3990,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/verra/meridian-verra",
      inStock: true,
    },
    productId: "w-halden-meridian-40",
    placement: "deep-dive-row",
    best: 3950,
  },
} satisfies Meta<typeof BuyRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A retailer after the lead one: the whole row is the link, and it says how
 * far above the best price it sits, so the reader never has to subtract.
 * @summary An in-stock retailer, with its difference from the best price.
 */
export const InStock: Story = {};

/**
 * A retailer that has run out stays in the list, muted and marked, so the
 * reader knows it was checked. It is not a link.
 * @summary A sold-out retailer: muted, marked “Sold out”, not a link.
 */
export const SoldOut: Story = {
  args: {
    offer: {
      id: "meridian-ws",
      merchantName: "Watchstore",
      price: 4100,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/watchstore/meridian-ws",
      inStock: false,
    },
  },
};

/**
 * In a container under 24rem the “View” pill keeps only its arrow, so a
 * long merchant name keeps its width; the name truncates last.
 * @summary A narrow row: the View pill drops its word, the merchant keeps its width.
 */
export const NarrowContainer: Story = {
  parameters: { frame: "narrow-card" },
  args: {
    offer: {
      id: "ardent-bl",
      merchantName: "Bergström & Lindqvist Horlogerie",
      price: 4990,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/bergstrom-lindqvist/ardent-bl",
      inStock: true,
    },
    best: 4850,
  },
};

/**
 * In the Assay theme, a running shoe’s second retailer: the same row on the
 * lab theme’s white paper.
 * @summary A retailer row in the Assay theme.
 */
export const Assay: Story = {
  parameters: { theme: "assay", category: "running" },
  args: {
    offer: {
      id: "tempo-ps",
      merchantName: "Peak Supply",
      price: 160,
      currency: "USD",
      affiliateUrl: "https://example-merchant.test/peak-supply/tempo-ps",
      inStock: true,
    },
    productId: "r-halvard-tempo-pro",
    best: 149,
  },
};
