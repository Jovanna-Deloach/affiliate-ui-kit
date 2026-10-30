import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Menu, Search } from "lucide-react";

import { navRunning, navSupplements, navWatches, publication, siteNavigation, siteUtilityLinks } from "@/fixtures/navigation";
import { Button } from "@/primitives/button";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { MegaMenu } from "./mega-menu";
import { MegaMenuEditorialPanel } from "./mega-menu-editorial-panel";

const attribution = { source: "kit", medium: "affiliate", campaign: "site-nav" };

const meta = {
  title: "Tier 11 · Navigation & Site Chrome/MegaMenuEditorialPanel",
  component: MegaMenuEditorialPanel,
  parameters: { layout: "fullscreen" },
  args: { vertical: navRunning, attribution, placement: "mega-menu" },
  argTypes: { vertical: { control: false }, attribution: { control: false } },
} satisfies Meta<typeof MegaMenuEditorialPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A masthead-shaped host: `relative`, one page well, the menu on the row. */
function MastheadFrame({ defaultValue }: { defaultValue?: string }) {
  return (
    <div className="relative border-b border-hairline bg-surface">
      <div className="page-well grid h-masthead grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-grid">
        <a href={publication.href} className="focus-ring type-title rounded-control text-ink">
          {publication.name}
        </a>
        <div className="hidden min-w-0 @3xl:block">
          <MegaMenu verticals={siteNavigation} utilityLinks={siteUtilityLinks} attribution={attribution} defaultValue={defaultValue} />
        </div>
        <div className="flex items-center gap-cluster">
          <Button intent="ghost" size="sm" aria-label="Search">
            <Search size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </Button>
          <Button intent="ghost" size="sm" aria-label="Menu" className="@3xl:hidden">
            <Menu size="1.1em" strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Playground: Story = {
  render: (args) => (
    <div className="border-y border-hairline">
      <MegaMenuEditorialPanel {...args} />
    </div>
  ),
};

export const Spotlights: Story = {
  name: "Three verticals — winner, tool, winner spotlights",
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Running — #1 flagship winner with a direct merchant CTA">
        <div className="border-y border-hairline">
          <MegaMenuEditorialPanel vertical={navRunning} attribution={attribution} />
        </div>
      </Specimen>
      <Specimen caption="Supplements — featured interactive tool">
        <div className="border-y border-hairline">
          <MegaMenuEditorialPanel vertical={navSupplements} attribution={attribution} />
        </div>
      </Specimen>
      <Specimen caption="Watches — five silos, two guides, one winner">
        <div className="border-y border-hairline">
          <MegaMenuEditorialPanel vertical={navWatches} attribution={attribution} />
        </div>
      </Specimen>
    </div>
  ),
};

export const InMasthead: Story = {
  name: "Open from a masthead row (Radix NavigationMenu host)",
  render: () => (
    <div className="@container min-h-[48rem] bg-canvas">
      <MastheadFrame defaultValue="running" />
      <div className="page-well py-section">
        <p className="m-0 max-w-prose text-body-sm text-ink-tertiary">
          Hover or focus another vertical on the row: the viewport keeps its width, animates its height, and the panels crossfade. Esc closes.
        </p>
      </div>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="border-y border-hairline">
        <MegaMenuEditorialPanel vertical={navRunning} attribution={attribution} />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={() => (
        <div className="border-y border-hairline">
          <MegaMenuEditorialPanel vertical={navRunning} attribution={attribution} />
        </div>
      )}
    />
  ),
};
