import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { searchIndex } from "@/fixtures/kit/discovery";
import { assertKitPage } from "@/kit/testing/page-checks";

import { SearchResult } from "./search-result";

const meta = {
  title: "Components/Search result",
  component: SearchResult,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { hit: searchIndex[0]!, query: "creatine" },
} satisfies Meta<typeof SearchResult>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A product, with its photograph and grade; “creatine” in bold where it appears.
 * @summary A product result with the words in bold.
 */
export const Product: Story = {};

/**
 * An ingredient: no picture, so the icon for its kind, and its evidence grade.
 * @summary An ingredient result, with its kind’s icon.
 */
export const Ingredient: Story = { args: { hit: searchIndex[8]!, query: "creatine mono" } };

/**
 * A guide, with the date it was last updated.
 * @summary A guide result, with when it was updated.
 */
export const Guide: Story = { args: { hit: searchIndex[11]!, query: "creatine" } };
