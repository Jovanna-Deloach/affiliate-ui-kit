import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { HelpfulButton } from "./helpful-button";

const meta = {
  title: "Primitives/Helpful button",
  component: HelpfulButton,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { count: 48, onMark: fn() },
} satisfies Meta<typeof HelpfulButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A review 48 readers found useful.
 * @summary Useful, with 48 votes.
 */
export const WithVotes: Story = {};

/**
 * This reader has already marked it: ink, pressed, counted.
 * @summary Marked by this reader.
 */
export const Marked: Story = { args: { count: 49, defaultMarked: true } };

/**
 * A new review nobody has marked yet: no count.
 * @summary No votes yet.
 */
export const NoVotes: Story = { args: { count: 0 } };
