import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { versusGuide } from "@/fixtures/kit/archetypes";
import { caliberSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { VersusPage } from "./archetypes";

const meta = {
  title: "Templates/Versus page",
  component: VersusPage,
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { site: caliberSite, guide: versusGuide, attribution: { source: "caliber", medium: "affiliate", campaign: versusGuide.id } },
} satisfies Meta<typeof VersusPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Two watches, head to head, on a watch magazine: the guide contract is the
 * roundup’s, so the same content can move between archetypes.
 * @summary A head-to-head page between two watches (Atelier).
 */
export const HeadToHead: Story = {
  parameters: { theme: "atelier" },
};
