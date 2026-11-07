import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { creatineOutcomes, creatineStudies } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ResearchFeed } from "./research-feed";

const meta = {
  title: "Blocks/Research feed",
  component: ResearchFeed,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: { studies: creatineStudies, outcomes: creatineOutcomes },
} satisfies Meta<typeof ResearchFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Ten studies of creatine, newest first, four at a time, with a chip for each outcome.
 * @summary Creatine studies, newest first.
 */
export const Creatine: Story = {};

/**
 * A reader picks one outcome: only its studies show.
 * @summary Filtered to one outcome.
 */
export const OneOutcome: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /Muscle strength/ }));
    await assertKitPage(context);
  },
};
