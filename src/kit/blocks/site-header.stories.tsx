import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { SiteHeader } from "./site-header";

const meta = {
  title: "Blocks/Site header",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
  args: { site: caliberSite },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The masthead of a watch magazine on a watches page: the section carries
 * the blued-steel marker. Below 1024px the sections fold into the menu button.
 * @summary The masthead with the page’s section marked (Atelier).
 */
export const OnASectionPage: Story = {
  args: { category: "watches" },
};

/**
 * One publication, many beats: on a running page only the marker’s color
 * changes, to the running section’s vermilion.
 * @summary The same masthead on another section: only the marker’s color changes (Assay).
 */
export const AnotherSection: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { site: provingGroundSite, category: "running" },
};

/**
 * A page that belongs to no section (the home page, an about page) marks
 * nothing.
 * @summary The masthead with no section marked.
 */
export const NoSection: Story = {};
