import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { collectorsGuide } from "@/fixtures/kit/archetypes";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { inNarrowColumn, inWell } from "@/kit/testing/stories";

import { AlsoGreatRail } from "./also-great-rail";

const meta = {
  title: "Kit/Blocks/Also great rail",
  component: AlsoGreatRail,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof AlsoGreatRail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  decorators: [inWell()],
  args: { picks: watchesGuide.picks.slice(3), heading: watchesGuide.railHeading ?? "Also great" },
};

export const Catalogue: Story = {
  name: "Catalogue of five (collector’s guide)",
  parameters: { theme: "atelier" },
  decorators: [inWell()],
  args: { picks: collectorsGuide.picks, heading: collectorsGuide.railHeading ?? "In this guide", jumpLabel: collectorsGuide.jumpLabel },
};

export const NarrowContainer: Story = {
  name: "Assay, narrow container",
  parameters: { theme: "assay" },
  decorators: [inNarrowColumn("supplements")],
  args: { picks: creatineGuide.picks.slice(3), heading: creatineGuide.railHeading ?? "Also great" },
};
