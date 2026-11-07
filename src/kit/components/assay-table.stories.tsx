import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { apexLabReport, multiLabReport, peakLabReport } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { AssayTable } from "./assay-table";

const meta = {
  title: "Components/Assay table",
  component: AssayTable,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "card" },
  play: assertKitPage,
  args: { report: peakLabReport },
} satisfies Meta<typeof AssayTable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A creatine within 5% of its claim, every contaminant under its limit, two below what the lab
 * can measure.
 * @summary One ingredient on its claim; five contaminants under their limits.
 */
export const Creatine: Story = {};

/**
 * Lead at 140% of its limit: the figure in red, marked, and the bar past the end of its track.
 * @summary Lead over its limit, marked in words and in red.
 */
export const LeadOverTheLimit: Story = { args: { report: apexLabReport } };

/**
 * A multivitamin’s twelve nutrients: two miss the label by more than 10%.
 * @summary Twelve nutrients, two off the label.
 */
export const Multivitamin: Story = { args: { report: multiLabReport } };
