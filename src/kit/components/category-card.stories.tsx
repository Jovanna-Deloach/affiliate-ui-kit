import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineCategory, supplementCategories } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CategoryCard } from "./category-card";

const meta = {
  title: "Components/Category card",
  component: CategoryCard,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { category: supplementCategories[2]! },
} satisfies Meta<typeof CategoryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Words alone: the name, what the category covers, and how many reports the site holds.
 * @summary A category in words: name, what it covers, report count.
 */
export const InWords: Story = {};

/**
 * With its best-rated product on the studio well, for a grid where every category has one.
 * @summary A category with its best-rated product’s photograph.
 */
export const WithAProduct: Story = { args: { category: creatineCategory } };
