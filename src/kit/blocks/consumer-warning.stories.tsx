import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { capsuleRecall, failedTestWarning, fakeReviewsWarning, resolvedWarning } from "@/fixtures/kit/safety";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ConsumerWarning } from "./consumer-warning";

const meta = {
  title: "Blocks/Consumer warning",
  component: ConsumerWarning,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { warning: capsuleRecall, subject: "Fieldwork Creatine Capsules", id: "warning-fieldwork-creatine-capsules" },
} satisfies Meta<typeof ConsumerWarning>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A maker’s recall, in force: what happened, which lots, what to do, and who issued it.
 * @summary A recall in force: lots affected and what to do.
 */
export const Recall: Story = {};

/**
 * A product that failed the site’s own safety test, with the lab report linked.
 * @summary Failed our safety test: lead above the limit.
 */
export const FailedOurTest: Story = { args: { warning: failedTestWarning, subject: "Apex Stack Creatine HCl", id: "warning-apex-stack-creatine-hcl" } };

/**
 * A brand caught buying five-star reviews: about the brand, not one product.
 * @summary Fake reviews found, about a brand.
 */
export const FakeReviews: Story = { args: { warning: fakeReviewsWarning, subject: "Volt Labs", id: "warning-volt-labs" } };

/**
 * A regulator’s warning since resolved: kept, in gray, so readers know it happened.
 * @summary A resolved warning, kept as history.
 */
export const Resolved: Story = { args: { warning: resolvedWarning, subject: "Summit Labs Creatine HCl", id: "warning-summit-labs" } };
