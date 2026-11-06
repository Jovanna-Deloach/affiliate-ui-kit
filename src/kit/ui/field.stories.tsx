import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";
import { cn } from "@/lib/cn";

import { describedBy, Field, inputStyles } from "./field";

const meta = {
  title: "Primitives/Field",
  component: Field,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { id: "experienced", label: "Date of experience", children: null },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A control the kit does not wrap for you, here the browser’s date input,
 * given a label and a hint. The control carries the `id` and points at the
 * hint with `describedBy`.
 * @summary A native date input given a label and hint by Field.
 */
export const DateOfExperience: Story = {
  render: () => (
    <Field id="experienced" label="Date of experience" hint="When you used it, not when you bought it.">
      <input id="experienced" type="date" aria-describedby={describedBy("experienced", true)} defaultValue="2026-10-12" className={cn(inputStyles, "h-11 px-3")} />
    </Field>
  ),
};

/**
 * The same control with an error under it, in the fail tone with an icon,
 * saying how to fix it.
 * @summary A field with an error that says how to fix it.
 */
export const WithError: Story = {
  render: () => (
    <Field id="experienced-error" label="Date of experience" error="Pick a date on or before today.">
      <input
        id="experienced-error"
        type="date"
        aria-invalid
        aria-describedby={describedBy("experienced-error", undefined, true)}
        defaultValue="2027-01-04"
        className={cn(inputStyles, "h-11 px-3")}
      />
    </Field>
  ),
};
