import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Checkbox, ChoiceGroup } from "./choice";

const meta = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  subcomponents: { ChoiceGroup },
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "narrow-card" },
  play: assertKitPage,
  args: { label: "Verified purchases only", name: "verified" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The star filter of a review list: one checkbox per rating with how many
 * reviews it holds, so a reader can take in 1 and 2 stars together.
 * @summary A star-rating filter: one checkbox per rating, with counts.
 */
export const StarFilter: Story = {
  render: () => (
    <ChoiceGroup legend="Rating">
      <Checkbox name="stars" value="5" label="5 stars" count={706} />
      <Checkbox name="stars" value="4" label="4 stars" count={321} defaultChecked />
      <Checkbox name="stars" value="3" label="3 stars" count={128} />
      <Checkbox name="stars" value="2" label="2 stars" count={51} />
      <Checkbox name="stars" value="1" label="1 star" count={78} />
    </ChoiceGroup>
  ),
};

/**
 * One option on its own, with a hint that says what it means.
 * @summary A single checkbox with a hint.
 */
export const WithHint: Story = {
  args: { hint: "Reviews we matched to an order from a retailer.", defaultChecked: true },
};

/**
 * An option that does not apply right now keeps its label at half opacity.
 * @summary A disabled checkbox.
 */
export const Disabled: Story = {
  args: { label: "With photos", count: 0, disabled: true },
};
