import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { SiteFooter } from "./site-footer";

const meta = {
  title: "Kit/Blocks/Site footer",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { site: caliberSite },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The end of every page: the wordmark and its promise, the link columns,
 * and the full disclosure statement with its link.
 * @summary The footer with the full disclosure statement (Atelier).
 */
export const Atelier: Story = {};

/**
 * The lab publication’s footer: its own words for the same disclosure.
 * @summary The footer in the Assay theme.
 */
export const Assay: Story = {
  parameters: { theme: "assay" },
  args: { site: provingGroundSite },
};
