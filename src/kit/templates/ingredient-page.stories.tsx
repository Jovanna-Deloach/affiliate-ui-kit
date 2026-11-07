import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineIngredientGuide } from "@/fixtures/kit/pages";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { IngredientPage } from "./ingredient-page";

// A supplement’s research page on a lab publication. Every story runs the kit page checks.
const meta = {
  title: "Templates/Ingredient page",
  component: IngredientPage,
  tags: ["new"],
  parameters: { layout: "fullscreen", kit: true, frame: "none", theme: "assay" },
  play: assertKitPage,
  args: { site: provingGroundSite, guide: creatineIngredientGuide, attribution: { source: "proving-ground", medium: "affiliate", campaign: creatineIngredientGuide.id } },
} satisfies Meta<typeof IngredientPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine: what it is, with numbered citations; the evidence outcome by outcome; how to take it;
 * who should not; the studies; the products we tested; questions; and every source.
 * @summary A supplement’s research page, with citations.
 */
export const Creatine: Story = {};
