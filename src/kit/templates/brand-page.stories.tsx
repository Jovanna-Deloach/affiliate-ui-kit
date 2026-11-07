import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { peakBrandProfile } from "@/fixtures/kit/pages";
import { REVIEWS_NOW } from "@/fixtures/kit/reviews";
import { provingGroundSite } from "@/fixtures/kit/sites";
import { assertKitPage } from "@/kit/testing/page-checks";

import { BrandPage } from "./brand-page";

// A brand’s page on a lab publication. Every story runs the kit page checks.
const meta = {
  title: "Templates/Brand page",
  component: BrandPage,
  tags: ["new"],
  parameters: { layout: "fullscreen", kit: true, frame: "none", theme: "assay" },
  play: assertKitPage,
  args: { site: provingGroundSite, profile: peakBrandProfile, attribution: { source: "proving-ground", medium: "affiliate", campaign: peakBrandProfile.id }, now: REVIEWS_NOW },
} satisfies Meta<typeof BrandPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Peak Supply: what it makes, how it handles reviews, its one product we tested, readers’ reviews
 * and similar brands.
 * @summary A brand’s page: how it handles reviews, its products, readers’ reviews.
 */
export const PeakSupply: Story = {};
