import type { Decorator, Preview } from "@storybook/nextjs-vite";
import React from "react";

import "../src/styles/globals.css";

import { VERTICALS, type Vertical } from "../src/lib/verticals";

/**
 * Every story renders inside a `[data-vertical]` wrapper. The toolbar global
 * swaps the profile; the component code never changes. Side-by-side stories
 * render their own nested wrappers and ignore this global.
 */
const withVertical: Decorator = (Story, context) => {
  const vertical = (context.globals.vertical as Vertical) ?? "luxury-editorial";
  return (
    <div
      data-vertical={vertical}
      className="min-h-dvh p-card-pad"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [withVertical],
  globalTypes: {
    vertical: {
      description: "Vertical token profile",
      toolbar: {
        title: "Vertical",
        icon: "paintbrush",
        items: VERTICALS.map((v) => ({ value: v.id, title: v.label })),
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
