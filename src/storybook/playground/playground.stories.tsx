import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LivePlayground } from "./live-playground";

// The Playground: write kit code in the panel below the canvas and see it
// render, in either theme, at any viewport width. For people; agents read the
// stories and guides instead (`!manifest`), and the story is not a test.
const meta = {
  title: "Getting started/Playground",
  tags: ["!manifest", "!test", "new"],
  parameters: {
    layout: "fullscreen",
    kit: true,
    frame: "none",
    // Shows the Playground panel (.storybook/addons/playground.tsx) and only it.
    playground: true,
    controls: { disable: true },
    actions: { disable: true },
    interactions: { disable: true },
    a11y: { disable: true },
  },
} satisfies Meta;

export default meta;

export const Playground: StoryObj<typeof meta> = {
  render: () => <LivePlayground />,
};
