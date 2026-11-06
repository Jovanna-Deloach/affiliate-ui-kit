import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { JumpLink } from "./jump-link";

const meta = {
  title: "Kit/Primitives/Jump link",
  component: JumpLink,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { href: "#review-halden-meridian-40-gmt", children: "Read the full review" },
} satisfies Meta<typeof JumpLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * From a verdict card to its deep dive: the answer above the fold links to
 * the proof below.
 * @summary The link from a verdict to its full review further down the page.
 */
export const ToTheReview: Story = {};

/**
 * In a compact card the jump steps down to the small text size, under the
 * price and the button.
 * @summary A small jump link for compact cards.
 */
export const Small: Story = {
  args: { className: "t-small" },
};

/**
 * From the header’s testing card to the method section near the end of the
 * page.
 * @summary The link from the testing summary to the method.
 */
export const ToTheMethod: Story = {
  args: { href: "#methodology", children: "Read the full method" },
};
