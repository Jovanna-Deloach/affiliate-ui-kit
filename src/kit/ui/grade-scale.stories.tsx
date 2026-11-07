import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { GradeScale } from "./grade-scale";

const meta = {
  title: "Primitives/Grade scale",
  component: GradeScale,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { grade: "A-" },
} satisfies Meta<typeof GradeScale>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * An A− product: the A band filled green and showing the full grade, the others gray.
 * @summary An A− on the five bands.
 */
export const AMinus: Story = {};

/**
 * A C+ product: the C band outlined in amber.
 * @summary A C+, in the middle of the scale.
 */
export const CPlus: Story = { args: { grade: "C+" } };

/**
 * A product that failed: the F band filled red.
 * @summary An F, at the end of the scale.
 */
export const Failing: Story = { args: { grade: "F" } };
