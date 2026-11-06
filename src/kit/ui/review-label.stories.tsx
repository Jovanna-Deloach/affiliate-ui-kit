import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ReviewLabel } from "./review-label";

const meta = {
  title: "Primitives/Review label",
  component: ReviewLabel,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { label: "verified", href: "#labels" },
} satisfies Meta<typeof ReviewLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Matched to an order: the label readers trust most, in the pass tone.
 * @summary Verified, explained on tap.
 */
export const Verified: Story = {};

/**
 * Written after a free product or a payment: shown, and labeled.
 * @summary Incentivized, in the warning tone.
 */
export const Incentivized: Story = { args: { label: "incentivized" } };

/**
 * Every label a review can carry, side by side.
 * @summary All five labels.
 */
export const AllLabels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ReviewLabel label="verified" />
      <ReviewLabel label="invited" />
      <ReviewLabel label="unprompted" />
      <ReviewLabel label="incentivized" />
      <ReviewLabel label="tester" />
    </div>
  ),
};
