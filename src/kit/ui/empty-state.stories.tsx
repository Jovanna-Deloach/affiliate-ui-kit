import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bookmark } from "lucide-react";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Button } from "@/kit/ui";

import { EmptyState } from "./skeleton";

const meta = {
  title: "Primitives/Empty state",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: {
    title: "No reviews match these filters",
    children: <p>Try fewer filters, or reviews from any date.</p>,
    action: <Button>Clear filters</Button>,
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Filters that leave nothing: what happened, and the one way back.
 * @summary No reviews match the filters, with Clear filters.
 */
export const NoMatches: Story = {};

/**
 * Nothing saved yet: what saving is for, with its own icon.
 * @summary Nothing saved yet, explaining what saving does.
 */
export const NothingSaved: Story = {
  args: {
    icon: Bookmark,
    title: "Nothing saved yet",
    children: <p>Save a product or a guide and it waits here, on this device, until you sign in.</p>,
    action: undefined,
  },
};
