import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { accountMenuItems, member } from "@/fixtures/account";
import { publication } from "@/fixtures/navigation";

import { AccountMenuPopover } from "./account-menu-popover";

const meta = {
  title: "Tier 15 · Account & Personalization/AccountMenuPopover",
  component: AccountMenuPopover,
  parameters: { layout: "fullscreen" },
  args: { member, items: accountMenuItems, signOutAction: "#auth/sign-out", defaultOpen: false, align: "end" },
  argTypes: { member: { control: false }, items: { control: false }, align: { control: "inline-radio", options: ["start", "center", "end"] } },
} satisfies Meta<typeof AccountMenuPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

function Masthead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[28rem] flex-col bg-canvas">
      <div className="border-b border-hairline bg-surface">
        <div className="page-well grid h-masthead grid-cols-[minmax(0,1fr)_auto] items-center">
          <span className="type-title text-ink">{publication.name}</span>
          {children}
        </div>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <Masthead>
      <AccountMenuPopover {...args} />
    </Masthead>
  ),
};

export const Open: Story = {
  name: "Open — three zones",
  args: { defaultOpen: true },
  render: (args) => (
    <Masthead>
      <AccountMenuPopover {...args} />
    </Masthead>
  ),
};

export const Unverified: Story = {
  name: "Open — unverified member",
  args: { defaultOpen: true, member: { ...member, verified: false, memberSince: undefined } },
  render: (args) => (
    <Masthead>
      <AccountMenuPopover {...args} />
    </Masthead>
  ),
};
