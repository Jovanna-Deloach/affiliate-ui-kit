import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assayGuide } from "@/fixtures/kit/archetypes";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { LabAssayPage } from "./archetypes";

const meta = {
  title: "Templates/Lab assay page",
  component: LabAssayPage,
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { site: provingGroundSite, guide: assayGuide, attribution: { source: "proving-ground", medium: "affiliate", campaign: assayGuide.id } },
} satisfies Meta<typeof LabAssayPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * One supplement tested in the lab: a single verdict across the width,
 * then the full review with the lab’s stamp and the heavy metals.
 * @summary A single-product lab review (Assay, supplements).
 */
export const SingleProduct: Story = {
  parameters: { theme: "assay" },
};
