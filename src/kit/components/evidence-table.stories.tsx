import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { creatineOutcomes } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { EvidenceTable } from "./evidence-table";

const meta = {
  title: "Components/Evidence table",
  component: EvidenceTable,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: {
    outcomes: creatineOutcomes,
    intro: "Every outcome creatine has been studied for, graded on how many trials there are, how well they agree and how large the effect is.",
  },
} satisfies Meta<typeof EvidenceTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine’s eight outcomes, strongest evidence first: strength and lean mass at A, the outcomes
 * with no effect at D.
 * @summary Creatine’s outcomes, strongest evidence first.
 */
export const Creatine: Story = {};

/**
 * The same outcomes, the most-studied first.
 * @summary Sorted by number of studies.
 */
export const MostStudiedFirst: Story = { args: { defaultSort: "studies" } };

/**
 * A reader sorts by outcome name, A to Z.
 * @summary Sorted by name after a tap on the Outcome header.
 */
export const SortedByName: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Outcome" }));
    await assertKitPage(context);
  },
};
