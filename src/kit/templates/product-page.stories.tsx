import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import { peakReport, recalledReport } from "@/fixtures/kit/pages";
import { REVIEWS_NOW } from "@/fixtures/kit/reviews";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { ProductPage } from "./product-page";

// A product’s own page on a lab publication. Every story runs the kit page
// checks (play). (A line comment, not JSDoc: JSDoc on `meta` would replace
// ProductPage’s own description in what agents read.)
const meta = {
  title: "Templates/Product page",
  component: ProductPage,
  tags: ["new"],
  parameters: { layout: "fullscreen", kit: true, frame: "none", theme: "assay" },
  play: assertKitPage,
  args: {
    site: provingGroundSite,
    report: peakReport,
    attribution: { source: "proving-ground", medium: "affiliate", campaign: peakReport.id },
    onPriceAlert: fn(),
    writeReviewHref: "#write-a-review",
    reviewLinks: { labels: "#review-labels", report: "#report-a-review" },
    now: REVIEWS_NOW,
  },
} satisfies Meta<typeof ProductPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Peak Supply Creatine Monohydrate: the review, the lab report, the research on creatine, 90 days
 * of prices with an alert, readers’ reviews, what else readers looked at, questions and the method.
 * @summary A product’s page: review, lab report, evidence, price, readers’ reviews.
 */
export const PeakSupply: Story = {};

/**
 * The same page for a product under a recall: the banner and the full warning come first; the
 * grade, the certification, the price and every buy link are gone; the lab results stay.
 * @summary A product’s page under a recall.
 */
export const UnderARecall: Story = { args: { report: recalledReport } };
