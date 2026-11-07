import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DISCOVERY_NOW, viewedItems } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ContinueCard } from "./continue-card";

const meta = {
  title: "Components/Continue card",
  component: ContinueCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { item: viewedItems[1]!, now: DISCOVERY_NOW },
} satisfies Meta<typeof ContinueCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Read this morning, 42% of the way, up to the lab results: the link goes back to that section.
 * @summary A guide read 42% of the way, back to its section.
 */
export const PartWay: Story = {};

/**
 * Barely started, two days ago.
 * @summary A guide just started, two days ago.
 */
export const JustStarted: Story = { args: { item: viewedItems[3]! } };
