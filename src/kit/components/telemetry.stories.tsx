import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { runningGuide } from "@/fixtures/kit/running";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { BenchRows, ChronometerStrip, MetalRows, Telemetry } from "./telemetry";

const meta = {
  title: "Kit/Components/Telemetry",
  component: Telemetry,
  subcomponents: { ChronometerStrip, MetalRows, BenchRows },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "narrow" },
  play: assertKitPage,
  args: { measurements: watchesGuide.picks[0]!.measurements },
} satisfies Meta<typeof Telemetry>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A watch’s timing: six positions as ticks over the chronometer band, the
 * mean beside the label, and a line that says whether all six are inside.
 * @summary Watch timing in six positions against the chronometer band.
 */
export const Timing: Story = {};

/**
 * A supplement’s heavy metals, each as a share of its limit, with the ppb
 * and the limit printed beside the bar.
 * @summary Heavy metals as shares of their limits (Assay, supplements).
 */
export const HeavyMetals: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { measurements: creatineGuide.picks[0]!.measurements },
};

/**
 * A running shoe’s bench results against the test average, then its stack
 * and drop.
 * @summary Running-shoe bench results against the test average (Assay, running).
 */
export const BenchResults: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { measurements: runningGuide.picks[0]!.measurements },
};

/**
 * A watch with positions outside the band: those ticks turn to the warning
 * tone and the line counts them.
 * @summary Timing with positions outside the band.
 */
export const OutsideTheBand: Story = {
  args: {
    measurements: {
      kind: "timing",
      positions: [
        { label: "Dial up", rate: 2.1 },
        { label: "Dial down", rate: 3.4 },
        { label: "Crown up", rate: 7.2 },
        { label: "Crown down", rate: 1.8 },
        { label: "Crown left", rate: 8.1 },
        { label: "Crown right", rate: 4.0 },
      ],
      tolerance: [-4, 6],
      reference: "Bench test on a timegrapher after 30 days of wear.",
    },
  },
};
