import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assayGuide, collectorsGuide, versusGuide } from "@/fixtures/kit/archetypes";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CollectorsGuidePage, LabAssayPage, VersusPage } from "./archetypes";

/** The same eight macro-primitives, recomposed into the other page archetypes. */
const meta = {
  title: "Kit/Templates/Archetypes",
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeadToHead: Story = {
  name: "Head-to-head versus",
  parameters: { theme: "atelier" },
  render: () => <VersusPage site={caliberSite} guide={versusGuide} />,
};

export const LabAssay: Story = {
  name: "Single-product lab assay",
  parameters: { theme: "assay" },
  render: () => <LabAssayPage site={provingGroundSite} guide={assayGuide} />,
};

export const CollectorsGuide: Story = {
  name: "Collector’s guide",
  parameters: { theme: "atelier" },
  render: () => <CollectorsGuidePage site={caliberSite} guide={collectorsGuide} />,
};
