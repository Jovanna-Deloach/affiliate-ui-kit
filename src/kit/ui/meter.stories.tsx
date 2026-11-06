import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Meter } from "./meter";

const meta = {
  title: "Kit/Primitives/Meter",
  component: Meter,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "narrow" },
  play: assertKitPage,
  args: { value: 9.1, max: 10 },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A sub-score out of ten, in ink: the bar lets a column of scores be read at
 * a glance, the printed figure beside it says the number.
 * @summary A sub-score bar (ink), beside its printed figure.
 */
export const SubScore: Story = {};

/**
 * The composite score as ten segments: the part-filled segment is clipped,
 * so 8.7 reads as eight and most of a ninth.
 * @summary The composite score as ten segments.
 */
export const Segmented: Story = {
  args: { value: 8.7, segments: 10 },
};

/**
 * A result against the test average: the tick marks the average, the fill
 * is this product. Muted when worse than average.
 * @summary A result against the test average (the tick), in the category accent.
 */
export const AgainstTheAverage: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { value: 74, max: 100, mark: 66, tone: "telemetry" },
};

/**
 * A measurement as a share of its limit, with room to spare: even a tiny
 * share shows a sliver, so “16 of 1,000 ppb” never reads as zero.
 * @summary A small share of a limit, still visible as a sliver.
 */
export const ShareOfALimit: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { value: 16, max: 1000, tone: "telemetry" },
};

/**
 * From half the limit up, the bar turns to the warning tone.
 * @summary A share of a limit past half, in the warning tone.
 */
export const NearTheLimit: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { value: 310, max: 500, tone: "warn" },
};

/**
 * Over the limit the bar is full and in the fail tone; the figure beside it
 * goes red too.
 * @summary Over the limit, in the fail tone.
 */
export const OverTheLimit: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { value: 640, max: 500, tone: "fail" },
};
