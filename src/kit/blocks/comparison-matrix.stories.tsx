import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { inNarrowColumn, inWell } from "@/kit/testing/stories";

import { ComparisonMatrix } from "./comparison-matrix";
import { DisqualifiedSubTable } from "./disqualified-sub-table";

const meta = {
  title: "Kit/Blocks/Comparison matrix",
  component: ComparisonMatrix,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof ComparisonMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  decorators: [inWell()],
  args: { heading: watchesGuide.compare.heading, metrics: watchesGuide.metrics, picks: watchesGuide.picks },
};

/** With the disqualified table composed underneath, on the shared columns. */
export const AssayWithDisqualified: Story = {
  name: "Assay, with what failed",
  parameters: { theme: "assay" },
  decorators: [inWell("supplements")],
  args: {
    heading: creatineGuide.compare.heading,
    intro: creatineGuide.compare.intro,
    metrics: creatineGuide.metrics,
    picks: creatineGuide.picks,
    children: <DisqualifiedSubTable items={creatineGuide.notRecommended ?? []} metrics={creatineGuide.metrics} />,
  },
};

export const NarrowContainer: Story = {
  name: "Narrow container (rows become blocks)",
  parameters: { theme: "assay" },
  decorators: [inNarrowColumn("supplements")],
  args: { heading: creatineGuide.compare.heading, metrics: creatineGuide.metrics, picks: creatineGuide.picks.slice(0, 2) },
};
