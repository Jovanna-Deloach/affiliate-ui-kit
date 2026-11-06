import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { peakTopics } from "@/fixtures/kit/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ReviewTopics } from "./review-topics";

const meta = {
  title: "Components/Review topics",
  component: ReviewTopics,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { topics: peakTopics, onSelect: fn() },
} satisfies Meta<typeof ReviewTopics>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What reviewers of a creatine mention, most mentioned first.
 * @summary Five topics with how many reviews mention each.
 */
export const Topics: Story = {};

/**
 * The list filtered to reviews that mention the scoop.
 * @summary One topic picked.
 */
export const Picked: Story = { args: { selected: "scoop" } };
