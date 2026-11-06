import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { collectorsGuide } from "@/fixtures/kit/archetypes";
import { caliberSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CollectorsGuidePage } from "./archetypes";

const meta = {
  title: "Kit/Templates/Collector’s guide page",
  id: "kit-templates-collectors-guide-page",
  component: CollectorsGuidePage,
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { site: caliberSite, guide: collectorsGuide, attribution: { source: "caliber", medium: "affiliate", campaign: collectorsGuide.id } },
} satisfies Meta<typeof CollectorsGuidePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A curated set of watches as peers: the catalogue first, then each piece
 * in full. No verdict and no ranking table.
 * @summary A collector’s guide: a catalogue, then each piece in full (Atelier).
 */
export const Catalogue: Story = {
  parameters: { theme: "atelier" },
};
