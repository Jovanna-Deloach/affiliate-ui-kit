import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { HealthDisclaimer } from "./health-disclaimer";

const meta = {
  title: "Components/Health disclaimer",
  component: HealthDisclaimer,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: {},
} satisfies Meta<typeof HealthDisclaimer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One product’s lab report: not medical advice, then the FDA statement.
 * @summary For a page about one product.
 */
export const OneProduct: Story = {};

/**
 * A guide to several products: the FDA statement in the plural.
 * @summary For a page about several products.
 */
export const SeveralProducts: Story = { args: { plural: true } };
