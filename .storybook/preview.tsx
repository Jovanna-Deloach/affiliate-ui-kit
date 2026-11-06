import { Controls, Description, DocsContext, Primary, Stories, Subtitle, Title } from "@storybook/addon-docs/blocks";
import type { Decorator, Preview } from "@storybook/nextjs-vite";
import React, { useContext } from "react";

import "./fonts";
import "../src/styles/globals.css";

import { KitFrame, type KitStoryParameters } from "../src/kit/testing/stories";
import { VERTICALS, type Vertical } from "../src/lib/verticals";
import { VerticalCompare } from "../src/stories/vertical-compare";

type VerticalGlobal = Vertical | "side-by-side";
type Shape = "architectural" | "soft" | "pill";
type Elevation = "flat" | "soft" | "tactile";
type Stage = "white" | "canvas";

/**
 * Every story renders inside a `[data-vertical]` wrapper. The toolbar globals
 * swap the tone, the system shape preset, the elevation preset and the stage
 * plane; the component code never changes.
 *
 *   luxury-editorial | clinical-performance → single wrapper
 *   side-by-side                            → the SAME story rendered once per
 *                                             vertical, in adjacent columns
 */
const withVertical: Decorator = (Story, context) => {
  // Kit stories (src/kit, docs/STORYBOOK.md) render full-bleed inside a theme,
  // framed by parameters (theme, category, frame), never by wrapper markup in
  // the story: a page template is a page, and a story's code is only the part.
  if (context.parameters.kit) {
    const { theme, category, frame } = context.parameters as Partial<KitStoryParameters>;
    return (
      <div data-theme={theme ?? (context.globals.theme as string) ?? "atelier"} className={context.viewMode === "docs" ? "flow-root" : "flow-root min-h-dvh"}>
        <KitFrame frame={frame} category={category}>
          <Story />
        </KitFrame>
      </div>
    );
  }
  const vertical = (context.globals.vertical as VerticalGlobal) ?? "luxury-editorial";
  const shape = (context.globals.shape as Shape) ?? "architectural";
  const elevation = (context.globals.elevation as Elevation) ?? "flat";
  const stage = (context.globals.stage as Stage) ?? "white";
  const presets = {
    "data-shape": shape === "architectural" ? undefined : shape,
    "data-elevation": elevation === "flat" ? undefined : elevation,
    "data-stage": stage,
  };

  if (vertical === "side-by-side") {
    return (
      <div {...presets} className="min-h-dvh">
        <VerticalCompare render={() => <Story />} />
      </div>
    );
  }

  return (
    <div data-vertical={vertical} {...presets} className="min-h-dvh p-card">
      <Story />
    </div>
  );
};

/**
 * The autodocs page, as Storybook’s default (title, description, primary
 * story, props, every story), except that a story’s description stops at its
 * first JSDoc tag. Kit stories end their JSDoc with `@summary` for the agent
 * manifest (docs/STORYBOOK.md); people read only the prose above it.
 */
function DocsPage() {
  const context = useContext(DocsContext);
  for (const story of context.componentStories()) {
    const description = (story.parameters.docs as { description?: { story?: unknown } } | undefined)?.description;
    if (typeof description?.story === "string") description.story = description.story.split(/\n\s*@\w/)[0]!.trim();
  }
  return (
    <>
      <Title />
      <Subtitle />
      <Description />
      <Primary />
      <Controls />
      <Stories />
    </>
  );
}

/**
 * Stories render only after the three faces are resolved, so the workshop
 * never paints fallback text first (the app gets the same guarantee from
 * next/font's preload + metric-adjusted fallbacks).
 */
const FACES = [
  '400 1em "Playfair Display Variable"',
  'italic 400 1em "Playfair Display Variable"',
  '400 1em "Plus Jakarta Sans Variable"',
  '600 1em "Plus Jakarta Sans Variable"',
  '400 1em "Inter Variable"',
  '600 1em "Inter Variable"',
  '600 1em "JetBrains Mono Variable"',
  '300 1em "Newsreader Variable"',
  '400 1em "Newsreader Variable"',
  'italic 400 1em "Newsreader Variable"',
];
const withFontsReady = async () => {
  if (typeof document === "undefined" || !document.fonts) return {};
  await Promise.all(FACES.map((f) => document.fonts.load(f).catch(() => null)));
  return {};
};

const preview: Preview = {
  loaders: [withFontsReady],
  decorators: [withVertical],
  globalTypes: {
    theme: {
      description: "Kit theme (docs/DESIGN.md) — applies to kit stories",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "atelier", title: "Atelier · luxury goods" },
          { value: "assay", title: "Assay · lab-tested" },
        ],
        dynamicTitle: true,
      },
    },
    vertical: {
      description: "Vertical tone profile",
      toolbar: {
        title: "Vertical",
        icon: "paintbrush",
        items: [
          ...VERTICALS.map((v) => ({ value: v.id, title: v.label })),
          { value: "side-by-side", title: "Side by side (all verticals)" },
        ],
        dynamicTitle: true,
      },
    },
    shape: {
      description: "System shape preset (data-shape)",
      toolbar: {
        title: "Shape",
        icon: "component",
        items: [
          { value: "architectural", title: "Architectural · 6 / 4 / 3" },
          { value: "soft", title: "Soft · 10 / 8 / 6" },
          { value: "pill", title: "Pill · capsule controls & tags" },
        ],
        dynamicTitle: true,
      },
    },
    elevation: {
      description: "System elevation preset (data-elevation)",
      toolbar: {
        title: "Elevation",
        icon: "contrast",
        items: [
          { value: "flat", title: "Flat · hairlines only" },
          { value: "soft", title: "Soft · resting lift" },
          { value: "tactile", title: "Tactile · key + ambient" },
        ],
        dynamicTitle: true,
      },
    },
    stage: {
      description: "Stage plane behind the story",
      toolbar: {
        title: "Stage",
        icon: "photo",
        items: [
          { value: "white", title: "White" },
          { value: "canvas", title: "Vertical canvas" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "atelier",
    vertical: "luxury-editorial",
    shape: "architectural",
    elevation: "flat",
    stage: "white",
    viewport: { value: "desktop1280", isRotated: false },
  },
  parameters: {
    layout: "fullscreen",
    docs: { page: DocsPage },
    options: {
      // The kit first: its guides, then the smallest pieces first (primitives →
      // components → blocks → templates), then the specimen sheets for review.
      storySort: {
        order: [
          "Kit",
          ["Guides", ["Start here", "Foundations", "Data model", "Composing pages", "Making pages distinct", "Writing stories"], "Primitives", "Components", "Blocks", "Templates", "Specimen sheets", ["Primitives", "Components"]],
          "*",
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    viewport: {
      options: {
        mobile375: {
          name: "Mobile 375",
          styles: { width: "375px", height: "812px" },
          type: "mobile",
        },
        tablet768: {
          name: "Tablet 768",
          styles: { width: "768px", height: "1024px" },
          type: "tablet",
        },
        desktop1280: {
          name: "Desktop 1280",
          styles: { width: "1280px", height: "900px" },
          type: "desktop",
        },
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
