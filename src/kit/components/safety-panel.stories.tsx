import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineSafety, creatineSafetySummary } from "@/fixtures/kit/safety";
import { assertKitPage } from "@/kit/testing/page-checks";

import { SafetyPanel } from "./safety-panel";

const meta = {
  title: "Components/Safety panel",
  component: SafetyPanel,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "well" },
  play: assertKitPage,
  args: { notes: creatineSafety, summary: creatineSafetySummary, heading: "Is creatine safe?" },
} satisfies Meta<typeof SafetyPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine: who should avoid it, what it interacts with and its side effects, serious first.
 * @summary Creatine’s safety: avoid, interactions, side effects.
 */
export const Creatine: Story = {};
