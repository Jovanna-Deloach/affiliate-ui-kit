import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { creatineCategoryGuide } from "@/fixtures/kit/pages";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CategoryPage } from "./category-page";

// A category’s page on a lab publication. Every story runs the kit page checks.
const meta = {
  title: "Templates/Category page",
  component: CategoryPage,
  tags: ["new"],
  parameters: { layout: "fullscreen", kit: true, frame: "none", theme: "assay" },
  play: assertKitPage,
  args: {
    site: provingGroundSite,
    guide: creatineCategoryGuide,
    attribution: { source: "proving-ground", medium: "affiliate", campaign: creatineCategoryGuide.id },
    onSuggest: fn(),
    privacyHref: "#privacy",
  },
} satisfies Meta<typeof CategoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine: the four products we certify, ranked; how all eighteen tested; readers’ questions with
 * their sources; and a form to suggest a product.
 * @summary A category’s page: ranking, category report, questions, sources.
 */
export const Creatine: Story = {};
