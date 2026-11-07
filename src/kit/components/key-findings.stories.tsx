import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { apexLabReport, multiLabReport, peakLabReport } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { KeyFindings } from "./key-findings";

const meta = {
  title: "Components/Key findings",
  component: KeyFindings,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { report: peakLabReport },
} satisfies Meta<typeof KeyFindings>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A creatine that matched its label and passed every contaminant limit.
 * @summary A clean pass: on the label, under every limit.
 */
export const CleanPass: Story = {};

/**
 * Lead over its limit: purity fails, and the mark says which contaminant.
 * @summary Lead over its limit: purity fails.
 */
export const LeadOverTheLimit: Story = { args: { report: apexLabReport } };

/**
 * A multivitamin: two nutrients off the label, and two watchlist ingredients, linked.
 * @summary Off the label, with watchlist ingredients.
 */
export const OffTheLabel: Story = { args: { report: multiLabReport } };
