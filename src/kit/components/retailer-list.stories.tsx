import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { RetailerList } from "./retailer-list";

const meta = {
  title: "Components/Retailer list",
  component: RetailerList,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: {
    offers: [
      {
        id: "meridian-verra",
        merchantName: "Verra",
        price: 3990,
        currency: "USD",
        affiliateUrl: "https://example-merchant.test/verra/meridian-verra",
        inStock: true,
      },
      {
        id: "meridian-ws",
        merchantName: "Watchstore",
        price: 4100,
        currency: "USD",
        affiliateUrl: "https://example-merchant.test/watchstore/meridian-ws",
        inStock: false,
      },
    ],
    best: 3950,
    productId: "w-halden-meridian-40",
    placement: "deep-dive-row",
  },
} satisfies Meta<typeof RetailerList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Under the offer card: the next-cheapest retailer with its difference
 * from the best price, then a sold-out retailer, last, muted and unlinked.
 * @summary The other retailers in kit order: in stock by price, sold out last.
 */
export const InKitOrder: Story = {};

/**
 * Two retailers in stock above the lead price, each with how far above it
 * sits, so the reader can weigh a familiar shop against the saving.
 * @summary Several in-stock retailers, each with its difference from the best price.
 */
export const SeveralInStock: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    offers: [
      {
        id: "peak-hf",
        merchantName: "Haus & Field",
        price: 23,
        currency: "USD",
        affiliateUrl: "https://example-merchant.test/haus-field/peak-hf",
        inStock: true,
      },
      {
        id: "peak-nl",
        merchantName: "Northlane",
        price: 26,
        currency: "USD",
        affiliateUrl: "https://example-merchant.test/northlane/peak-nl",
        inStock: true,
      },
    ],
    best: 21,
    productId: "c-peak-mono-500",
  },
};

/**
 * In a phone-width container each row’s “View” pill keeps only its arrow,
 * so merchant names and prices keep their width.
 * @summary The list in a narrow container.
 */
export const NarrowContainer: Story = {
  parameters: { frame: "narrow-card" },
};
