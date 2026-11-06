import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { TabLinks } from "./tab-links";

const meta = {
  title: "Primitives/Tab links",
  component: TabLinks,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: {
    label: "Peak Supply Creatine Monohydrate",
    items: [
      { href: "/creatine/peak-supply", label: "Summary", current: true },
      { href: "/creatine/peak-supply/reviews", label: "Reviews", count: 1284 },
      { href: "/creatine/peak-supply/lab-results", label: "Lab results", count: 16 },
    ],
  },
} satisfies Meta<typeof TabLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product’s pages, each with its own address so search engines index the
 * reviews and the lab results separately. The page the reader is on is
 * marked.
 * @summary A product’s Summary, Reviews and Lab results pages as tabs.
 */
export const ProductPages: Story = {};

/**
 * Sections of one long page, linked by anchor: the ranking and the report
 * further down.
 * @summary Two sections of one page, linked by anchor.
 */
export const PageSections: Story = {
  args: {
    label: "Creatine",
    items: [
      { href: "#ranking", label: "Ranking", count: 18, current: true },
      { href: "#report", label: "Report" },
    ],
  },
};
