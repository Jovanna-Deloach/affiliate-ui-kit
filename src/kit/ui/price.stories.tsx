import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Price } from "./price";

const meta = {
  title: "Kit/Primitives/Price",
  component: Price,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { amount: 189 },
} satisfies Meta<typeof Price>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A price at the size of a compact verdict card. Reach for the default when
 * a price sits in running UI and nothing around it sets a size.
 * @summary The default price line (md).
 */
export const Basic: Story = {};

/**
 * The lead offer of a buy box or the lead verdict card, with its list price
 * struck through first. Showing both prices tells the reader the saving
 * without a percentage badge.
 * @summary A lead price (lg) with the higher list price struck through.
 */
export const Discounted: Story = {
  args: { amount: 3950, was: 4400, size: "lg" },
};

/**
 * A comparison-table or catalogue cell: the lowest price and the retailer
 * that has it, on two lines, so the column stays narrow.
 * @summary A table price (sm) with the retailer as a caption.
 */
export const WithRetailer: Story = {
  args: { amount: 1650, size: "sm", note: "at Verra" },
};

/**
 * The last column of a table is right-aligned: the caption lines up under
 * the amount’s right edge. Alignment is inherited, so the same component
 * serves left-aligned cards.
 * @summary A right-aligned price for a table’s last column.
 */
export const RightAligned: Story = {
  args: { amount: 12450, size: "sm", note: "at Haus & Field", className: "text-right" },
};

/**
 * Supplements are compared per serving, not per tub: give the figure that
 * makes products comparable as the caption, under the price paid.
 * @summary A tub price with its per-serving figure (Assay, supplements).
 */
export const PerServing: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { amount: 21, size: "lg", note: "$0.21 a serving" },
};

/**
 * A retailer that has run out keeps its row and its price, struck through
 * and muted, so the reader sees what it cost; it is never a link.
 * @summary A sold-out amount, struck and muted (retailer rows).
 */
export const SoldOut: Story = {
  args: { amount: 4100, size: "xs", soldOut: true },
};

/**
 * Prices format in the offer’s own currency (ISO 4217), with its symbol and
 * grouping.
 * @summary A price in another currency.
 */
export const OtherCurrency: Story = {
  args: { amount: 189, currency: "EUR" },
};
