import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { GradeBadge } from "./grade-badge";

const meta = {
  title: "Primitives/Grade badge",
  component: GradeBadge,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { grade: "A+" },
} satisfies Meta<typeof GradeBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The top grade, filled green: a product that passed every test.
 * @summary A+, filled green.
 */
export const TopGrade: Story = {};

/**
 * A product that failed: filled red. The letter says it; the color backs it up.
 * @summary F, filled red.
 */
export const Failed: Story = { args: { grade: "F" } };

/**
 * A B− in a ranking row or a card, at 28px; screen readers hear “Lab grade B minus”.
 * @summary B− at 28px, for rows and cards.
 */
export const InARow: Story = { args: { grade: "B-", size: "sm", label: "Lab grade" } };

/**
 * At 56px beside a product’s name in its header.
 * @summary A at 56px, for a product’s header.
 */
export const InAHeader: Story = { args: { grade: "A", size: "lg" } };

/**
 * The five bands side by side: A filled, B tinted, C outlined in amber, D tinted red, F filled red.
 * @summary The five bands, A to F.
 */
export const EveryBand: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <GradeBadge {...args} grade="A" />
      <GradeBadge {...args} grade="B+" />
      <GradeBadge {...args} grade="C" />
      <GradeBadge {...args} grade="D-" />
      <GradeBadge {...args} grade="F" />
    </div>
  ),
};
