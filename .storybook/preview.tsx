import type { Decorator, Preview } from "@storybook/nextjs-vite";
import React from "react";

import "./fonts";
import "../src/styles/globals.css";

import { VERTICALS, type Vertical } from "../src/lib/verticals";
import { VerticalCompare } from "../src/stories/vertical-compare";

type VerticalGlobal = Vertical | "side-by-side";

/**
 * Every story renders inside a `[data-vertical]` wrapper. The toolbar global
 * swaps the profile; the component code never changes.
 *
 *   luxury-editorial | clinical-performance → single wrapper
 *   side-by-side                            → the SAME story rendered once per
 *                                             vertical, in adjacent columns
 */
const withVertical: Decorator = (Story, context) => {
  const vertical = (context.globals.vertical as VerticalGlobal) ?? "luxury-editorial";

  if (vertical === "side-by-side") {
    return <VerticalCompare render={() => <Story />} />;
  }

  return (
    <div data-vertical={vertical} className="min-h-dvh p-card-pad">
      <Story />
    </div>
  );
};

/**
 * Stories render only after the three faces are resolved, so the workshop
 * never paints fallback text first (the app gets the same guarantee from
 * next/font's preload + metric-adjusted fallbacks).
 */
const FACES = ['400 1em "Instrument Serif"', '400 1em "Inter Variable"', '400 1em "JetBrains Mono Variable"'];
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
      description: "Vertical token profile",
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
  },
  initialGlobals: {
    vertical: "luxury-editorial",
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
