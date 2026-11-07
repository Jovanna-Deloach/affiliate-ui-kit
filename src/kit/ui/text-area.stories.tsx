import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { TextArea } from "./text-area";

const meta = {
  title: "Primitives/Text area",
  component: TextArea,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { label: "Your review", name: "body" },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The body of a review: a hint on what helps other readers, and a count
 * against the limit as the reader types.
 * @summary A review body with a hint and a character count.
 */
export const YourReview: Story = {
  args: { hint: "What you used it for, for how long, and what changed.", maxLength: 2000, showCount: true },
};

/**
 * A brand’s reply to a review, already written, in a shorter box.
 * @summary A shorter text area holding a reply.
 */
export const BrandReply: Story = {
  args: {
    label: "Your reply",
    rows: 3,
    defaultValue: "Thanks for the detail on mixing. Batch 2214 is micronized now; we’d be glad to send a tub to try.",
  },
};

/**
 * Too short to help anyone: the error says what is missing.
 * @summary A text area with an error.
 */
export const WithError: Story = {
  args: { defaultValue: "Good.", error: "Tell readers a little more: at least 50 characters.", maxLength: 2000, showCount: true },
};
