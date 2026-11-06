import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { assertKitPage } from "@/kit/testing/page-checks";

import { HelpfulPrompt } from "./helpful-prompt";

const meta = {
  title: "Components/Helpful prompt",
  component: HelpfulPrompt,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { onAnswer: fn() },
} satisfies Meta<typeof HelpfulPrompt>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The last thing on an ingredient page: one tap, then a thank-you.
 * @summary “Was this page helpful?” at the end of a page.
 */
export const EndOfPage: Story = {};

/**
 * A reader who answers No is offered a way to say what was missing.
 * @summary With a link to say what was missing, after No.
 */
export const WithFeedbackLink: Story = {
  args: { question: "Did this answer your question about creatine?", feedbackHref: "#feedback" },
};
