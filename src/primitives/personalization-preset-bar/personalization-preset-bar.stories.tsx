import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { profileKeto, profileRunner } from "@/fixtures/account";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { PersonalizationPresetBar } from "./personalization-preset-bar";

const meta = {
  title: "Tier 15 · Account & Personalization/PersonalizationPresetBar",
  component: PersonalizationPresetBar,
  parameters: { layout: "fullscreen" },
  args: { profile: profileKeto, defaultHighlight: true, editHref: "#account/profile" },
  argTypes: { profile: { control: false } },
} satisfies Meta<typeof PersonalizationPresetBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Profiles: Story = {
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Supplements directory — keto profile, highlight on">
        <PersonalizationPresetBar profile={profileKeto} defaultHighlight editHref="#account/profile" />
      </Specimen>
      <Specimen caption="Running directory — runner profile, highlight off">
        <PersonalizationPresetBar profile={profileRunner} label="Runner profile" editHref="#account/profile" />
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => <VerticalCompare render={() => <PersonalizationPresetBar profile={profileKeto} defaultHighlight editHref="#account/profile" />} />,
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => <ViewportFrames render={() => <PersonalizationPresetBar profile={profileRunner} label="Runner profile" editHref="#account/profile" />} />,
};
