import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";
import { inNarrowColumn, inWell } from "@/kit/testing/stories";

import { TestingTelemetryBadge } from "./testing-telemetry-badge";

const meta = {
  title: "Kit/Blocks/Testing telemetry badge",
  component: TestingTelemetryBadge,
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof TestingTelemetryBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>, inWell()],
  args: { telemetry: watchesGuide.telemetry },
};

/** Under 20rem the figures stack: the card queries its own width, not the viewport. */
export const NarrowContainer: Story = {
  name: "Assay, narrow container",
  parameters: { theme: "assay" },
  decorators: [(Story) => <div className="max-w-[18rem]"><Story /></div>, inNarrowColumn("supplements")],
  args: { telemetry: creatineGuide.telemetry },
};
