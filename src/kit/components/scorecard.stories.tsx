import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
// Parts used inside args come from the layer’s entry point: the import agents copy.
import { Telemetry } from "@/kit/components";
import { assertKitPage } from "@/kit/testing/page-checks";

import { Scorecard } from "./scorecard";

const meta = {
  title: "Kit/Components/Scorecard",
  component: Scorecard,
  subcomponents: { Telemetry },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "narrow" },
  play: assertKitPage,
  args: {
    rating: { score: 9.1, tier: "Exceptional", standing: "1st of 14 tested" },
    scores: [
      { label: "Timekeeping", score: 9.4 },
      { label: "Finishing", score: 9.0 },
      { label: "Comfort", score: 9.2 },
      { label: "Legibility", score: 8.8 },
      { label: "Value", score: 8.9 },
    ],
    id: "meridian-score",
  },
} satisfies Meta<typeof Scorecard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The verdict in numbers: the composite out of ten with its tier and an
 * honest standing, then five sub-scores, each a printed figure with a bar.
 * @summary The composite score with five sub-scores.
 */
export const ScoreAndSubScores: Story = {};

/**
 * In a review, the category’s measurements follow the sub-scores: for a
 * watch, the six timing positions against the chronometer band.
 * @summary The scorecard with the category’s telemetry under the sub-scores.
 */
export const WithTelemetry: Story = {
  args: { children: <Telemetry measurements={watchesGuide.picks[0]!.measurements} /> },
};

/**
 * A supplement’s scorecard ends with its heavy metals, each as a share of
 * its limit.
 * @summary A supplement’s scorecard with its heavy-metal rows (Assay).
 */
export const LabResults: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: {
    rating: creatineGuide.picks[0]!.rating,
    scores: creatineGuide.picks[0]!.scores,
    id: "peak-score",
    children: <Telemetry measurements={creatineGuide.picks[0]!.measurements} />,
  },
};
