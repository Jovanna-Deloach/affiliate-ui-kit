import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { reader, searchIndex, searchSuggestions } from "@/fixtures/kit/discovery";
import { caliberSite, provingGroundSite } from "@/fixtures/kit/sites";
import { SiteSearch } from "@/kit/blocks";
import { AccountMenu } from "@/kit/components";
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

/**
 * A supplements publication with readers’ accounts: the site’s search (⌘K)
 * and the reader’s menu take the places of the search icon and Sign in.
 * @summary With SiteSearch and AccountMenu in their places (Assay).
 */
export const WithSearchAndAccount: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    site: provingGroundSite,
    category: "supplements",
    search: <SiteSearch index={searchIndex} suggestions={searchSuggestions} resultsPath="/search" />,
    account: <AccountMenu person={reader} links={{ saved: "#saved", history: "#history", alerts: "#alerts" }} counts={{ saved: 12, alerts: 2 }} />,
  },
};
