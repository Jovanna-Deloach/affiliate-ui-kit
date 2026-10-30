import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { guideCreatine, guideDailyTrainers, guideDiveWatches, guides } from "@/fixtures/guides";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { GuideIndexCard } from "./guide-index-card";

const meta = {
  title: "Tier 12 · Category Hubs/GuideIndexCard",
  component: GuideIndexCard,
  parameters: { layout: "fullscreen" },
  args: { guide: guideDailyTrainers, size: "default" },
  argTypes: { guide: { control: false }, size: { control: "inline-radio", options: ["default", "hero"] } },
} satisfies Meta<typeof GuideIndexCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-sm">
      <GuideIndexCard {...args} />
    </div>
  ),
};

export const Grid: Story = {
  name: "Three-up category grid",
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="Five guides on one grid — miniature stacks and counts keep every card the same silhouette">
        <div className="grid grid-cols-1 items-start gap-grid md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideIndexCard key={guide.id} guide={guide} />
          ))}
        </div>
      </Specimen>
      <Specimen caption="Hero size for a bento lead slot">
        <div className="max-w-2xl">
          <GuideIndexCard guide={guideDiveWatches} size="hero" />
        </div>
      </Specimen>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="grid grid-cols-1 items-start gap-grid md:grid-cols-2">
        <GuideIndexCard guide={guideDailyTrainers} />
        <GuideIndexCard guide={guideCreatine} />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={(spec) => (
        <div className={spec.width === 375 ? "grid grid-cols-1 gap-grid" : "grid grid-cols-3 items-start gap-grid"}>
          {guides.slice(0, 3).map((guide) => (
            <GuideIndexCard key={guide.id} guide={guide} />
          ))}
        </div>
      )}
    />
  ),
};
