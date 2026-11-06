import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { QuickLinks } from "./quick-links";

const meta = {
  title: "Blocks/Quick links",
  component: QuickLinks,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "none" },
  play: assertKitPage,
  args: {
    categories: [
      { slug: "creatine", name: "Creatine", href: "#category-creatine" },
      { slug: "protein", name: "Protein", href: "#category-protein" },
      { slug: "fish-oil", name: "Fish oil", href: "#category-fish-oil" },
      { slug: "magnesium", name: "Magnesium", href: "#category-magnesium" },
      { slug: "vitamin-d", name: "Vitamin D", href: "#category-vitamin-d" },
      { slug: "electrolytes", name: "Electrolytes", href: "#category-electrolytes" },
      { slug: "multivitamins", name: "Multivitamins", href: "#category-multivitamins" },
      { slug: "probiotics", name: "Probiotics", href: "#category-probiotics" },
      { slug: "melatonin", name: "Melatonin", href: "#category-melatonin" },
    ],
  },
} satisfies Meta<typeof QuickLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The nine categories readers open most, under the masthead; on a phone the row scrolls sideways.
 * @summary Nine popular categories as chips, sideways on phones.
 */
export const PopularCategories: Story = {};
