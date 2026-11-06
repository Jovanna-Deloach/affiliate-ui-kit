import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ironhouseAssay, peakAssay } from "@/fixtures/kit/cases";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { assertKitPage } from "@/kit/testing/page-checks";
import { onPhotograph } from "@/kit/testing/stories";

import { AssayBadge } from "./telemetry";

const meta = {
  title: "Kit/Components/Assay badge",
  component: AssayBadge,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { measurements: peakAssay, className: "absolute bottom-4 left-4" },
} satisfies Meta<typeof AssayBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The lab’s verdict where the reader looks first, on the product’s
 * photograph: the accreditation, the measured share of the label claim and
 * pass or fail. Place it as an overlay of the review frame (`PickMedia`).
 * @summary The lab’s stamp on a supplement’s review photograph.
 */
export const OnThePhotograph: Story = {
  decorators: [onPhotograph(creatineGuide.picks[0]!)],
};

/**
 * In a frame under 24rem the accreditation is left to screen readers, so the
 * stamp stays on one line over the photograph.
 * @summary The stamp in a narrow frame: accreditation for screen readers only.
 */
export const NarrowFrame: Story = {
  args: { measurements: ironhouseAssay },
  decorators: [onPhotograph(creatineGuide.picks[1]!, "narrow")],
};
