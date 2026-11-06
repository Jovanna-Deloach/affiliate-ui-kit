import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Breadcrumb } from "./eyebrow";

const meta = {
  title: "Primitives/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: {
    items: [
      { label: "Watches", href: "/watches" },
      { label: "Buying guides", href: "/watches/guides" },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The article’s eyebrow: the section in ink, then the kind of page. It is
 * the first line of the article header, above the title.
 * @summary The section and the kind of page, above an article title.
 */
export const SectionAndKind: Story = {};

/**
 * A deeper page names every level; the path wraps between crumbs on a
 * phone, never inside one.
 * @summary A three-level path.
 */
export const ThreeLevels: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    items: [
      { label: "Supplements", href: "/supplements" },
      { label: "Lab tests", href: "/supplements/lab" },
      { label: "Creatine", href: "/supplements/lab/creatine" },
    ],
  },
};
