import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Award } from "./badge";

const meta = {
  title: "Primitives/Award",
  component: Award,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { children: "Our pick" },
} satisfies Meta<typeof Award>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The award at the head of a verdict card: picks carry awards, not ranks,
 * so the reader compares reasons rather than numbers.
 * @summary The award a pick holds, at the head of its card.
 */
export const OurPick: Story = {};

/**
 * Every pick gets an award that says what it is best at, in sentence case.
 * @summary A secondary award (“Budget pick”).
 */
export const BudgetPick: Story = {
  args: { children: "Budget pick" },
};

/**
 * In the Assay theme the award is obsidian on white, with no brass border.
 * @summary The award in the Assay theme.
 */
export const Assay: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { children: "Lab verified" },
};
