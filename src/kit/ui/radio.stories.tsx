import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { ChoiceGroup, Radio } from "./choice";

const meta = {
  title: "Primitives/Radio",
  component: Radio,
  subcomponents: { ChoiceGroup },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { label: "All reviews", name: "date" },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * When the reviews were posted: one choice of four, all in view.
 * @summary A date-posted filter: one choice of four.
 */
export const DatePosted: Story = {
  render: () => (
    <ChoiceGroup legend="Date posted">
      <Radio name="date" value="all" label="All reviews" count={1284} defaultChecked />
      <Radio name="date" value="30" label="Last 30 days" count={62} />
      <Radio name="date" value="90" label="Last 3 months" count={203} />
      <Radio name="date" value="365" label="Last 12 months" count={711} />
    </ChoiceGroup>
  ),
};

/**
 * A form question with a hint on each option.
 * @summary Options with hints, in a form.
 */
export const WithHints: Story = {
  render: () => (
    <ChoiceGroup legend="How did you get it?">
      <Radio name="source" value="bought" label="I bought it" hint="Upload your receipt to get the Verified label." defaultChecked />
      <Radio name="source" value="free" label="The brand sent it free" hint="Your review is labeled Incentivized." />
    </ChoiceGroup>
  ),
};
