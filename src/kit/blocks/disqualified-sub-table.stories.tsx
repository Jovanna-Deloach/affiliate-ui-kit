import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { assertKitPage } from "@/kit/testing/page-checks";
import { inNarrowColumn, inWell } from "@/kit/testing/stories";

import { DisqualifiedSubTable } from "./disqualified-sub-table";

const meta = {
  title: "Kit/Blocks/Disqualified sub-table",
  component: DisqualifiedSubTable,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof DisqualifiedSubTable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Supplements: Story = {
  parameters: { theme: "assay" },
  decorators: [inWell("supplements")],
  args: { items: creatineGuide.notRecommended ?? [], metrics: creatineGuide.metrics, standalone: true },
};

export const RunningNarrow: Story = {
  name: "Running, narrow container",
  parameters: { theme: "assay" },
  decorators: [inNarrowColumn("running")],
  args: { items: runningGuide.notRecommended ?? [], metrics: runningGuide.metrics, standalone: true },
};
