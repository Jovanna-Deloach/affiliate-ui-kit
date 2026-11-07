import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { creatineDosage } from "@/fixtures/kit/evidence";
import { assertKitPage } from "@/kit/testing/page-checks";

import { DosageCard } from "./dosage-card";

const meta = {
  title: "Components/Dosage card",
  component: DosageCard,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "column" },
  play: assertKitPage,
  args: { dosage: creatineDosage, name: "creatine" },
} satisfies Meta<typeof DosageCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Creatine: the dose, when, the form and the loading phase, then a worked example for 180 lb.
 * @summary Creatine’s dose, with a worked example for 180 lb.
 */
export const Creatine: Story = {};

/**
 * The same, for a reader who thinks in kilograms: 82 kg to start.
 * @summary The worked example in kilograms.
 */
export const InKilograms: Story = { args: { defaultUnit: "kg" } };

/**
 * A weight outside the range the doses were studied for: the field says what it takes.
 * @summary A weight out of range, with the reason.
 */
export const WeightOutOfRange: Story = {
  play: async (context) => {
    const canvas = within(context.canvasElement);
    const field = canvas.getByLabelText(/Body weight/);
    await userEvent.clear(field);
    await userEvent.type(field, "30");
    await assertKitPage(context);
  },
};
