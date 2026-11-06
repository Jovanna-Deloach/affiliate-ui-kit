import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { assertKitPage } from "@/kit/testing/page-checks";

import { DisqualifiedSubTable } from "./disqualified-sub-table";

const meta = {
  title: "Kit/Blocks/Disqualified sub-table",
  component: DisqualifiedSubTable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements" },
  play: assertKitPage,
  args: { items: creatineGuide.notRecommended ?? [], metrics: creatineGuide.metrics, standalone: true },
} satisfies Meta<typeof DisqualifiedSubTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What we tested and would not buy, each with its reason in one line, on
 * its own card. Inside a comparison, pass it as the matrix’s child instead.
 * @summary Products tested and not recommended, as their own card.
 */
export const OnItsOwn: Story = {};

/**
 * In a narrow container each product becomes a small card with its key
 * measurements as pills.
 * @summary The table in a phone-width container (running).
 */
export const NarrowContainer: Story = {
  parameters: { category: "running", frame: "narrow" },
  args: { items: runningGuide.notRecommended ?? [], metrics: runningGuide.metrics },
};
