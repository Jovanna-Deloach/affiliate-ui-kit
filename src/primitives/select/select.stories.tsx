import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Specimen } from "@/stories/specimen";
import { VerticalCompare } from "@/stories/vertical-compare";

import { Select } from "./select";

const SORTS = [
  { value: "score", label: "Highest score" },
  { value: "price-asc", label: "Price · low to high" },
  { value: "price-desc", label: "Price · high to low" },
  { value: "updated", label: "Recently updated" },
];

const meta = {
  title: "Tier 0 · Shared Controls/Select",
  component: Select,
  parameters: { layout: "fullscreen" },
  args: { options: SORTS, defaultValue: "score", label: "Sort products", prefix: "Sort", size: "md", width: "auto" },
  argTypes: { options: { control: false }, size: { control: "inline-radio", options: ["sm", "md"] }, width: { control: "inline-radio", options: ["auto", "full"] } },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Two sizes, with and without a prefix">
        <div className="flex flex-wrap items-center gap-cluster">
          <Select options={SORTS} defaultValue="score" label="Sort" prefix="Sort" />
          <Select options={SORTS} defaultValue="price-asc" label="Sort" size="sm" prefix="Sort" />
          <Select options={SORTS} label="Sort" placeholder="Sort by…" size="sm" />
          <Select options={SORTS} defaultValue="updated" label="Sort" disabled />
        </div>
      </Specimen>
      <Specimen caption="Full width in a form column">
        <div className="max-w-xs">
          <Select options={SORTS} defaultValue="score" label="Sort" width="full" />
        </div>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => <VerticalCompare render={() => <Select options={SORTS} defaultValue="score" label="Sort" prefix="Sort" />} />,
};
