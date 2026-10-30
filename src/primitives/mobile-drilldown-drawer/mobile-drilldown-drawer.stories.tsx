import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Menu } from "lucide-react";

import { publication, siteNavigation, siteUtilityLinks, trustStats } from "@/fixtures/navigation";
import { Button } from "@/primitives/button";

import { MobileDrilldownDrawer } from "./mobile-drilldown-drawer";

// The trigger is slotted (asChild), so it must be an element that forwards
// props to the DOM — a <Button /> directly, never a wrapper component.
const menuTrigger = (
  <Button intent="outline" size="sm" aria-label="Open navigation">
    <Menu size="1.1em" strokeWidth={1.5} aria-hidden="true" />
    Menu
  </Button>
);

/** A phone masthead with the menu control on the right. */
function PhoneMasthead({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[32rem] flex-col bg-canvas">
      <div className="border-b border-hairline bg-surface">
        <div className="page-well grid h-masthead grid-cols-[minmax(0,1fr)_auto] items-center">
          <span className="type-title text-ink">{publication.name}</span>
          {children}
        </div>
      </div>
      <p className="page-well m-0 max-w-prose py-section text-body-sm text-ink-tertiary">
        Resize to a phone width: the drawer is the phone navigation. Drill into a vertical, then use the back chevron.
      </p>
    </div>
  );
}

const meta = {
  title: "Tier 11 · Navigation & Site Chrome/MobileDrilldownDrawer",
  component: MobileDrilldownDrawer,
  parameters: { layout: "fullscreen" },
  args: {
    verticals: siteNavigation,
    utilityLinks: siteUtilityLinks,
    trustStats,
    searchAction: "#search",
    defaultOpen: false,
    trigger: menuTrigger,
  },
  argTypes: { verticals: { control: false }, trigger: { control: false }, trustStats: { control: false } },
} satisfies Meta<typeof MobileDrilldownDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <PhoneMasthead>
      <MobileDrilldownDrawer {...args} />
    </PhoneMasthead>
  ),
};

export const StageOne: Story = {
  name: "Stage 1 · verticals and search (open)",
  args: { defaultOpen: true },
  render: (args) => (
    <PhoneMasthead>
      <MobileDrilldownDrawer {...args} />
    </PhoneMasthead>
  ),
};

export const StageTwo: Story = {
  name: "Stage 2 · subcategories and top 3 winners (open)",
  args: { defaultOpen: true, initialVerticalId: "running" },
  render: (args) => (
    <PhoneMasthead>
      <MobileDrilldownDrawer {...args} />
    </PhoneMasthead>
  ),
};

export const StageTwoSupplements: Story = {
  name: "Stage 2 · supplements (open)",
  args: { defaultOpen: true, initialVerticalId: "supplements" },
  render: (args) => (
    <PhoneMasthead>
      <MobileDrilldownDrawer {...args} />
    </PhoneMasthead>
  ),
};
