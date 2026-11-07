import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineStudies } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { StudyCard } from "./study-card";

const meta = {
  title: "Components/Study card",
  component: StudyCard,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow" },
  play: assertKitPage,
  args: { study: creatineStudies[5]! },
} satisfies Meta<typeof StudyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A randomized trial: who took part, how many, for how long, and what it found.
 * @summary A randomized trial in older adults.
 */
export const Trial: Story = {};

/**
 * A meta-analysis pools trials: no length, thousands of people across them.
 * @summary A meta-analysis of 72 trials.
 */
export const MetaAnalysis: Story = { args: { study: creatineStudies[2]! } };

/**
 * A trial paid for by a company that sells the supplement: the card says so.
 * @summary An industry-funded trial, flagged.
 */
export const IndustryFunded: Story = { args: { study: creatineStudies[1]! } };
