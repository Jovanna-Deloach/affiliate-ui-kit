import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { aeroliteLoupeFrames } from "@/fixtures/gallery";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { MediaLoupeCarousel } from "./media-loupe-carousel";

const meta = {
  title: "Tier 6 · Editorial & Visual Proof/MediaLoupeCarousel",
  component: MediaLoupeCarousel,
  parameters: { layout: "fullscreen" },
  args: {
    frames: aeroliteLoupeFrames,
    label: "Meridian Aerolite 3 — hands-on gallery",
    defaultIndex: 0,
    strip: "bottom",
    priority: true,
  },
  argTypes: {
    strip: { control: "inline-radio", options: ["bottom", "hidden"] },
    frames: { control: false },
  },
} satisfies Meta<typeof MediaLoupeCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <MediaLoupeCarousel {...args} />
    </div>
  ),
};

export const Frames: Story = {
  name: "Each angle with its tester note",
  render: () => (
    <div className="grid items-start gap-grid md:grid-cols-2">
      {aeroliteLoupeFrames.map((frame, i) => (
        <Specimen key={frame.id} caption={`${String(i + 1).padStart(2, "0")} · ${frame.angle}`}>
          <MediaLoupeCarousel frames={aeroliteLoupeFrames} label={`Gallery opened on ${frame.angle}`} defaultIndex={i} strip="hidden" />
        </Specimen>
      ))}
    </div>
  ),
};

export const InsideScorecard: Story = {
  name: "Inside a scorecard",
  render: () => (
    <SurfaceCard as="section" className="max-w-2xl">
      <div className="flex flex-col gap-hairline">
        <p className="type-eyebrow m-0 text-ink-tertiary">Hands-on</p>
        <h3 className="type-title m-0">Four angles, 412 miles</h3>
      </div>
      <MediaLoupeCarousel frames={aeroliteLoupeFrames} label="Meridian Aerolite 3 — hands-on gallery" />
    </SurfaceCard>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare render={() => <MediaLoupeCarousel frames={aeroliteLoupeFrames} label="Meridian Aerolite 3 — hands-on gallery" defaultIndex={1} />} />
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames render={() => <MediaLoupeCarousel frames={aeroliteLoupeFrames} label="Meridian Aerolite 3 — hands-on gallery" defaultIndex={2} />} />
  ),
};
