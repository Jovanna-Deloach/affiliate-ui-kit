import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineResults } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { CategoryReport } from "./category-report";

const meta = {
  title: "Blocks/Category report",
  component: CategoryReport,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: { results: creatineResults },
} satisfies Meta<typeof CategoryReport>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Eighteen creatine products: 7 within 5% of their label, 4 over a contaminant limit, and the 4
 * that did both right.
 * @summary Eighteen creatine products on one accuracy scale.
 */
export const Creatine: Story = {};
