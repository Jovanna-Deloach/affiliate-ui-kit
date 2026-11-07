import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { supplementCategories } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CategoryIndex } from "./category-index";

const meta = {
  title: "Blocks/Category index",
  component: CategoryIndex,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: {
    heading: "Every supplement we test",
    intro: "Eight categories, every product in them bought at retail and assayed in an accredited lab.",
    categories: supplementCategories,
  },
} satisfies Meta<typeof CategoryIndex>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Eight supplement categories as tiles of words: two columns on phones, four on wide screens.
 * @summary Every category, two to four across.
 */
export const EverySupplement: Story = {};
