import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { REVIEWS_NOW } from "@/fixtures/kit/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";

import { RelativeTime } from "./relative-time";

const meta = {
  title: "Primitives/Relative time",
  component: RelativeTime,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { date: "2026-11-06T12:10:00Z", now: REVIEWS_NOW },
} satisfies Meta<typeof RelativeTime>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A review posted this afternoon.
 * @summary “3 hours ago”.
 */
export const HoursAgo: Story = {};

/**
 * A reply from the day before.
 * @summary “yesterday”.
 */
export const Yesterday: Story = { args: { date: "2026-11-05T14:00:00Z" } };

/**
 * A review from last year.
 * @summary “last year”.
 */
export const LastYear: Story = { args: { date: "2025-10-30T12:00:00Z" } };
