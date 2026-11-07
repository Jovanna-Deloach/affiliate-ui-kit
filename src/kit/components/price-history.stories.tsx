import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { peakPriceHistory, soldOutPriceHistory } from "@/fixtures/kit/safety";
import { assertKitPage } from "@/kit/testing/page-checks";

import { PriceHistory } from "./price-history";

const meta = {
  title: "Components/Price history",
  component: PriceHistory,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { points: peakPriceHistory },
} satisfies Meta<typeof PriceHistory>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 90 days of Peak Supply Creatine: $21 now, $3 above a three-day sale, with a week sold out.
 * Hover the line for each stretch; the table has every change.
 * @summary 90 days: now against the low and the high.
 */
export const NinetyDays: Story = {};

/**
 * Sold out everywhere since November 1: it says what it last sold for.
 * @summary Sold out now.
 */
export const SoldOutNow: Story = { args: { points: soldOutPriceHistory } };
