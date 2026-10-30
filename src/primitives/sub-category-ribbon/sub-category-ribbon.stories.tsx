import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { publication, runningRibbon } from "@/fixtures/navigation";
import { directoryProducts } from "@/fixtures/products";
import { ProductMediaFrame } from "@/primitives/product-media-frame";
import { SurfaceCard } from "@/primitives/surface-card";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { SubCategoryRibbon } from "./sub-category-ribbon";

const meta = {
  title: "Tier 11 · Navigation & Site Chrome/SubCategoryRibbon",
  component: SubCategoryRibbon,
  parameters: { layout: "fullscreen" },
  args: {
    items: runningRibbon,
    activeId: "daily-trainers",
    label: "Running categories",
    sticky: false,
  },
  argTypes: { items: { control: false }, onSelect: { control: false } },
} satisfies Meta<typeof SubCategoryRibbon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** Client-routed: clicks move the rule instead of navigating. */
function RoutedRibbon({ width }: { width?: string }) {
  const [active, setActive] = useState("daily-trainers");
  return (
    <div className={width} style={{ containerType: "inline-size" }}>
      <SubCategoryRibbon
        items={runningRibbon}
        activeId={active}
        label="Running categories"
        sticky={false}
        onSelect={(item, e) => {
          e.preventDefault();
          setActive(item.id);
        }}
      />
    </div>
  );
}

export const OverflowAndGlide: Story = {
  name: "Overflow fades + the gliding rule",
  render: () => (
    <div className="flex flex-col gap-section">
      <Specimen caption="375 px frame — the end fades, the start does not; click a silo and the rule glides">
        <RoutedRibbon width="w-[375px] max-w-full border border-hairline" />
      </Specimen>
      <Specimen caption="640 px frame — both edges fade once scrolled into the middle">
        <RoutedRibbon width="w-[640px] max-w-full border border-hairline" />
      </Specimen>
      <Specimen caption="Full width — nothing overflows, no fade">
        <RoutedRibbon width="border border-hairline" />
      </Specimen>
    </div>
  ),
};

export const StickyUnderMasthead: Story = {
  name: "Sticky under a masthead, over a long directory",
  render: () => (
    <div className="bg-canvas">
      <div className="sticky top-0 z-40 border-b border-hairline bg-surface">
        <div className="page-well flex h-masthead items-center">
          <span className="type-title text-ink">{publication.name}</span>
        </div>
      </div>
      <SubCategoryRibbon items={runningRibbon} activeId="trail" label="Running categories" top="var(--size-masthead)" />
      <div className="page-well grid grid-cols-2 gap-grid py-section md:grid-cols-4">
        {directoryProducts.slice(0, 12).map((product) => (
          <SurfaceCard key={product.id} as="article" density="compact">
            <ProductMediaFrame media={product.media} treatment="contain" sizes="25vw" />
            <p className="type-eyebrow m-0 text-ink-tertiary">{product.eyebrow}</p>
            <p className="m-0 text-body-sm font-medium text-ink">
              {product.brand} {product.name}
            </p>
          </SurfaceCard>
        ))}
      </div>
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare render={() => <RoutedRibbon width="border border-hairline" />} />
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => (
    <ViewportFrames
      render={() => <SubCategoryRibbon items={runningRibbon} activeId="carbon-plated" label="Running categories" sticky={false} className="border border-hairline" />}
    />
  ),
};
