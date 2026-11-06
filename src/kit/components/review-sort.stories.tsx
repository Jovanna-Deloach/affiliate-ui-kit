import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ReviewSort } from "./review-sort";

const meta = {
  title: "Components/Review sort",
  component: ReviewSort,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { onValueChange: fn() },
} satisfies Meta<typeof ReviewSort>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default order: newest first.
 * @summary Most recent first.
 */
export const MostRecent: Story = { args: { value: "recent" } };

/**
 * The reviews most marked useful first.
 * @summary Most relevant.
 */
export const MostRelevant: Story = { args: { value: "relevant" } };
