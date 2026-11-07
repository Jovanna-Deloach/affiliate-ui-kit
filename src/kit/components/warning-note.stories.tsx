import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { capsuleRecall } from "@/fixtures/kit/safety";
import { assertKitPage } from "@/kit/testing/page-checks";

import { WarningNote } from "./warning-note";

const meta = {
  title: "Components/Warning note",
  component: WarningNote,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { warning: capsuleRecall, href: "#warning-fieldwork-creatine-capsules" },
} satisfies Meta<typeof WarningNote>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * In a card or a table row, where the price and the buy link were.
 * @summary One red line where the price was.
 */
export const InACard: Story = {};

/**
 * In a buy box, where the offers were: says the buy links are down while it stands.
 * @summary In place of a buy box.
 */
export const InABuyBox: Story = { args: { size: "box" } };
