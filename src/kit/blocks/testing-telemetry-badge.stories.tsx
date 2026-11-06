import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { TestingTelemetryBadge } from "./testing-telemetry-badge";

const meta = {
  title: "Kit/Blocks/Testing telemetry badge",
  component: TestingTelemetryBadge,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "narrow" },
  play: assertKitPage,
  args: { telemetry: watchesGuide.telemetry },
} satisfies Meta<typeof TestingTelemetryBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The proof of work, up front: how many products, how long, against what
 * reference, with a jump to the method at the end of the page.
 * @summary The testing summary: three figures, the reference, a jump to the method.
 */
export const Summary: Story = {};

/**
 * The lab publication’s card, with its own heading and figures.
 * @summary The testing summary in the Assay theme, with a custom heading.
 */
export const LabSummary: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { telemetry: creatineGuide.telemetry, heading: "What the lab did" },
};

/**
 * Under 20rem the figures stack: the card queries its own width, not the
 * viewport.
 * @summary The figures stacked in a very narrow container.
 */
export const VeryNarrow: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-72">
        <Story />
      </div>
    ),
  ],
};
