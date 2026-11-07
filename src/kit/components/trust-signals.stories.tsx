import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { peakTrust } from "@/fixtures/kit/reviews";
import { assertKitPage } from "@/kit/testing/page-checks";

import { TrustSignals } from "./trust-signals";

const meta = {
  title: "Components/Trust signals",
  component: TrustSignals,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { brand: "Peak Supply", signals: peakTrust, href: "#brands" },
} satisfies Meta<typeof TrustSignals>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A brand that asks some customers for reviews and answers most negative
 * ones within two days.
 * @summary A brand that asks for reviews and replies to 92% of negative ones.
 */
export const Responsive: Story = {};

/**
 * A brand that has not asked for reviews in a year: a warning, since its
 * reviews may lean negative.
 * @summary A brand that rarely asks for reviews, with a warning.
 */
export const RarelyAsks: Story = {
  args: { brand: "Ironhouse", signals: { asksForReviews: "rarely", replyRate: 0.31, replyTime: "2 weeks" } },
};
