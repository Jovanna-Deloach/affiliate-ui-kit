import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assayGuide, versusGuide } from "@/fixtures/kit/archetypes";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { inNarrowColumn, inWell } from "@/kit/testing/stories";

import { QuickVerdictBento } from "./quick-verdict-bento";

const meta = {
  title: "Kit/Blocks/Quick verdict bento",
  component: QuickVerdictBento,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof QuickVerdictBento>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreePicks: Story = {
  name: "Three picks, Atelier",
  parameters: { theme: "atelier" },
  decorators: [inWell()],
  args: { picks: watchesGuide.picks.slice(0, 3), jumpLabel: watchesGuide.jumpLabel },
};

export const TwoPicks: Story = {
  name: "Two picks (head to head)",
  parameters: { theme: "atelier" },
  decorators: [inWell()],
  args: { picks: versusGuide.picks, jumpLabel: versusGuide.jumpLabel },
};

export const OnePick: Story = {
  name: "One pick (lab assay), Assay",
  parameters: { theme: "assay" },
  decorators: [inWell("supplements")],
  args: { picks: assayGuide.picks, jumpLabel: assayGuide.jumpLabel },
};

export const NarrowContainer: Story = {
  name: "Running, narrow container",
  parameters: { theme: "assay" },
  decorators: [inNarrowColumn("running")],
  args: { picks: runningGuide.picks, jumpLabel: runningGuide.jumpLabel },
};
