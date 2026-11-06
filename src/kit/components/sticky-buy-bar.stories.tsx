import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { assertKitPage } from "@/kit/testing/page-checks";

import { StickyBuyBar } from "./sticky-buy-bar";

const meta = {
  title: "Components/Sticky buy bar",
  component: StickyBuyBar,
  tags: ["autodocs", "new"],
  // The bar is fixed to the screen’s bottom edge: each story gets a frame of its own in the docs.
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "none", docs: { story: { inline: false, iframeHeight: 120 } } },
  play: assertKitPage,
  args: { product: creatineGuide.picks[0]!.product, disclosureHref: "#disclosure", shown: true },
} satisfies Meta<typeof StickyBuyBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * On a product page, after the reader has scrolled past the buy box: the
 * product, the commission note, the lowest price and its buy button. On a
 * page, pass `watch` (the buy box’s id) instead of `shown`.
 * @summary The bar as it appears once the buy box has scrolled away.
 */
export const PastTheBuyBox: Story = {};

/**
 * A product on sale: the list price struck through beside the price.
 * @summary With the list price struck through.
 */
export const OnSale: Story = {
  args: { product: creatineGuide.picks[1]!.product },
};
