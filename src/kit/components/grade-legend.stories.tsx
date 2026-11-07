import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LAB_GRADES } from "@/kit/lib/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { GradeLegend } from "./grade-legend";

const meta = {
  title: "Components/Grade legend",
  component: GradeLegend,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: {},
} satisfies Meta<typeof GradeLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The evidence grades, A to F, as the evidence table grades outcomes.
 * @summary What each evidence grade means.
 */
export const EvidenceGrades: Story = {};

/**
 * The lab grades: the score band behind each letter, and what it takes.
 * @summary What each lab grade means, with its score band.
 */
export const LabGrades: Story = { args: { grades: LAB_GRADES, heading: "What lab grades mean", label: "Lab grade", scale: "lab" } };
