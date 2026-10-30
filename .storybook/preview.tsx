import type { Decorator, Preview } from "@storybook/nextjs-vite";
import React from "react";

import "./fonts";
import "../src/styles/globals.css";

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
 * Stories render only after the three faces are resolved, so the workshop
 * never paints fallback text first (the app gets the same guarantee from
 * next/font's preload + metric-adjusted fallbacks).
 */
const FACES = [
  '400 1em "Playfair Display Variable"',
  '600 1em "Plus Jakarta Sans Variable"',
  '400 1em "Inter Variable"',
  '400 1em "JetBrains Mono Variable"',
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
    vertical: "luxury-editorial",
    shape: "architectural",
    elevation: "flat",
    stage: "white",
    viewport: { value: "desktop1280", isRotated: false },
  },
  parameters: {
    layout: "fullscreen",
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
