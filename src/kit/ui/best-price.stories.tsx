import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { BestPrice } from "./badge";

const meta = {
  title: "Primitives/Best price",
  component: BestPrice,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof BestPrice>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The mark beside a lead price when another retailer has the product in
 * stock for more. The offer card and the feature verdict card add it for
 * you when that is true.
 * @summary The best-price mark, for a lead price that beats another in-stock retailer.
 */
export const BesideALeadPrice: Story = {};

/**
 * The same mark in the Assay theme’s pass green.
 * @summary The best-price mark in the Assay theme.
 */
export const Assay: Story = {
  parameters: { theme: "assay", category: "running" },
};
