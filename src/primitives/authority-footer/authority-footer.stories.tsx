import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { complianceCopy, footerDirectory, publication, trustStats } from "@/fixtures/navigation";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { AuthorityFooter } from "./authority-footer";

const meta = {
  title: "Tier 11 · Navigation & Site Chrome/AuthorityFooter",
  component: AuthorityFooter,
  parameters: { layout: "fullscreen" },
  args: {
    publication,
    stats: trustStats,
    directory: footerDirectory,
    compliance: complianceCopy,
    newsletter: { action: "#newsletter" },
  },
  argTypes: { publication: { control: false }, stats: { control: false }, directory: { control: false }, compliance: { control: false } },
} satisfies Meta<typeof AuthorityFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex min-h-[24rem] flex-col justify-end bg-canvas">
      <AuthorityFooter {...args} />
    </div>
  ),
};

export const WithoutNewsletter: Story = {
  name: "Stat bar only — no capture",
  args: { newsletter: undefined },
  render: (args) => (
    <div className="bg-canvas">
      <AuthorityFooter {...args} />
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: (args) => (
    <VerticalCompare>
      <AuthorityFooter {...args} />
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: (args) => <ViewportFrames render={() => <AuthorityFooter {...args} />} />,
};
