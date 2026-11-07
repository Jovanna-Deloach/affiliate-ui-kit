import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { EffectMarker } from "./effect-marker";

const meta = {
  title: "Primitives/Effect marker",
  component: EffectMarker,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { effect: "increase", size: "moderate" },
} satisfies Meta<typeof EffectMarker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine and strength: a moderate increase.
 * @summary A moderate increase.
 */
export const ModerateIncrease: Story = {};

/**
 * Depression symptoms alongside an antidepressant: a small decrease.
 * @summary A small decrease.
 */
export const SmallDecrease: Story = { args: { effect: "decrease", size: "small" } };

/**
 * Endurance: the studies found no effect.
 * @summary No effect.
 */
export const NoEffect: Story = { args: { effect: "none", size: undefined } };

/**
 * Memory: some studies found a benefit, others none.
 * @summary Mixed results across studies.
 */
export const Mixed: Story = { args: { effect: "mixed", size: undefined } };
