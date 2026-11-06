import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assayGuide, versusGuide } from "@/fixtures/kit/archetypes";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { QuickVerdictBento } from "./quick-verdict-bento";

const meta = {
  title: "Kit/Blocks/Quick verdict bento",
  component: QuickVerdictBento,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { picks: watchesGuide.picks, jumpLabel: watchesGuide.jumpLabel },
} satisfies Meta<typeof QuickVerdictBento>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A roundup’s answer: the lead pick’s feature card beside two compact
 * cards. Pass every pick; the bento shows three and the comparison carries
 * the rest.
 * @summary Three picks: the feature card beside two compact cards.
 */
export const ThreePicks: Story = {};

/**
 * A head-to-head: the two picks side by side, the compact card standing as
 * tall as the feature card with its photograph on top.
 * @summary Two picks, head to head.
 */
export const TwoPicks: Story = {
  args: { picks: versusGuide.picks, jumpLabel: versusGuide.jumpLabel, heading: "The verdict" },
};

/**
 * A single-product page: the feature card spans the width with a 4 : 3
 * well.
 * @summary One pick: the feature card spans the width (Assay).
 */
export const OnePick: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { picks: assayGuide.picks, jumpLabel: assayGuide.jumpLabel, heading: "The verdict" },
};

/**
 * In a narrow container the cards stack in order, the lead pick first.
 * @summary The bento in a phone-width container.
 */
export const NarrowContainer: Story = {
  parameters: { theme: "assay", category: "running", frame: "narrow" },
  args: { picks: runningGuide.picks, jumpLabel: runningGuide.jumpLabel },
};
