import type { Decorator, Preview } from "@storybook/nextjs-vite";
import React from "react";

import "./fonts";
import "../src/styles/globals.css";

import { KitFrame, type KitStoryParameters } from "../src/kit/testing/stories";
import { VERTICALS, type Vertical } from "../src/lib/verticals";
import { DocsCode } from "../src/storybook/docs/blocks";
import { DocsPage } from "../src/storybook/docs/docs-page";
import { VerticalCompare } from "../src/stories/vertical-compare";
import { kitTheme } from "./theme";

/** Vitest (story tests, the MCP server's test-run) builds the preview in its `test` mode. */
const IS_TEST = (import.meta as { env?: { MODE?: string } }).env?.MODE === "test";

type VerticalGlobal = Vertical | "side-by-side";
type Shape = "architectural" | "soft" | "pill";
type Elevation = "flat" | "soft" | "tactile";
type Stage = "white" | "canvas";

/**
 * Every story renders inside a `[data-vertical]` wrapper. The toolbar globals
 * swap the tone, the system shape preset, the elevation preset and the stage
 * plane; the component code never changes.
 *
 *   editorial | clinical-performance → single wrapper
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
  const vertical = (context.globals.vertical as VerticalGlobal) ?? "editorial";
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
  // The switches behind the toolbar. Storybook's own globals toolbar is hidden
  // (.storybook/manager.tsx): the theme shows on kit pages, the other four on
  // the legacy library only (.storybook/addons/toolbar.tsx).
  globalTypes: {
    theme: {
      description: "The kit theme for this page's examples (Foundations / Themes)",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "atelier", title: "Atelier · museum catalog" },
          { value: "assay", title: "Assay · lab report" },
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
    vertical: "editorial",
    shape: "architectural",
    elevation: "flat",
    stage: "white",
    // Story tests render at 1280px: the Vitest add-on sizes its page from this
    // global. People get the whole canvas, with the toolbar's viewport menu
    // for phone, tablet and desktop widths.
    ...(IS_TEST ? { viewport: { value: "desktop1280", isRotated: false } } : {}),
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      // Component pages (src/storybook/docs/docs-page.tsx) and the guides share
      // the workshop's theme, an "On this page" contents list, and a swatch
      // beside every hex value written in a guide.
      page: DocsPage,
      theme: kitTheme,
      toc: { title: "On this page", headingSelector: "h2, h3" },
      components: { code: DocsCode },
    },
    options: {
      // Sections in reading order: how to start, the foundations and the
      // guidelines, then the kit from its smallest parts to whole pages, the
      // specimen sheets for review, how to contribute, and the legacy library.
      storySort: {
        order: [
          "Getting started",
          ["Start here", "Playground", "AI agents"],
          "Foundations",
          ["Themes", "Color", "Typography", "Layout", "Surfaces"],
          "Guidelines",
          ["Data model", "Composing pages", "Making pages distinct"],
          "Primitives",
          "Components",
          "Blocks",
          "Templates",
          // The guide archetypes, then the supplement pages, in the order of Guidelines / Composing pages.
          [
            "Roundup page",
            "Versus page",
            "Lab assay page",
            "Collector’s guide page",
            "Product page",
            "Brand page",
            "Category page",
            "Ingredient page",
            "Search page",
            "Account page",
          ],
          "Specimen sheets",
          ["Primitives", "Components"],
          "Contributing",
          "Legacy",
          [
            "Foundations",
            "Tier 0 · Shared Controls",
            "Tier 1 · Monetization",
            "Tier 2 · Evaluation & E-E-A-T",
            "Tier 3 · Surface & Media",
            "Tier 4 · Comparison & Discovery",
            "Tier 5 · Conversion & Tools",
            "Tier 6 · Editorial & Visual Proof",
            "Tier 11 · Navigation & Site Chrome",
            "Tier 12 · Category Hubs",
            "Tier 15 · Account & Personalization",
          ],
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
        wide1440: {
          name: "Wide 1440",
          styles: { width: "1440px", height: "900px" },
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
