import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineSummaries, soldOutSummary } from "@/fixtures/kit/discovery";
import { recalledSummary } from "@/fixtures/kit/safety";
import { toReaderItem } from "@/kit/lib/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";
import { seedDevice } from "@/kit/testing/device";
import { CompareButton, SaveButton } from "@/kit/ui";

import { ProductCard } from "./product-card";

const meta = {
  title: "Components/Product card",
  component: ProductCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { summary: creatineSummaries[0]! },
  beforeEach: () => seedDevice("compare", []),
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A certified creatine: grade A+ with its score, readers’ stars, certified until next October,
 * and the lowest price with what 5 g costs.
 * @summary A certified product: grade, score, stars, certification, lowest price.
 */
export const Certified: Story = {};

/**
 * With a Save bookmark over the photograph and a Compare box under the price.
 * @summary With Save and Compare.
 */
export const WithSaveAndCompare: Story = {
  args: {
    corner: <SaveButton item={toReaderItem(creatineSummaries[0]!)} compact />,
    footer: <CompareButton item={toReaderItem(creatineSummaries[0]!)} />,
  },
};

/**
 * On a page where readers buy from the card: the lowest offer as a buy pill.
 * @summary With a buy pill for the lowest offer.
 */
export const WithABuyPill: Story = { args: { summary: creatineSummaries[2]!, buy: true } };

/**
 * Sold out at every retailer: the card says so, and offers no buy link.
 * @summary Sold out everywhere.
 */
export const SoldOut: Story = { args: { summary: soldOutSummary, buy: true } };

/**
 * Under a recall: the warning takes the place of the grade, the score, the certification and the
 * price, even with `buy` set.
 * @summary Under a recall: no grade, no certification, no buy link.
 */
export const UnderAWarning: Story = { args: { summary: recalledSummary, buy: true } };
