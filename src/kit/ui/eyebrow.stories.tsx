import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BadgeCheck } from "lucide-react";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Eyebrow } from "./eyebrow";

const meta = {
  title: "Kit/Primitives/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * What a product is, over its name: the descriptor that opens a deep dive.
 * Written in sentence case; the capitals are CSS.
 * @summary A descriptor over a product name, in muted micro-caps.
 */
export const Descriptor: Story = {
  args: { children: "Automatic GMT, 40 mm steel" },
};

/**
 * A data heading with its unit, the parts joined by the decorative dot:
 * screen readers hear one phrase, “Heavy metals ppb”.
 * @summary A label in parts (“Heavy metals · ppb”), joined by the decorative dot.
 */
export const InParts: Story = {
  args: { items: ["Heavy metals", "ppb"] },
};

/**
 * A verification stamp: a leading icon and a date, in ink. It vouches for
 * the page, so it sits in the byline.
 * @summary A verification stamp with a leading icon.
 */
export const Stamp: Story = {
  args: {
    as: "span",
    tone: "default",
    icon: <BadgeCheck size={14} strokeWidth={2} className="text-pass" />,
    children: "Updated October 28, 2026",
  },
};

/**
 * A section label that is a real heading for assistive technology (`as`),
 * set in micro-caps because the section is a list, not an argument.
 * @summary A micro-caps section heading (as h3), for lists such as pros and cons.
 */
export const AsHeading: Story = {
  args: { as: "h3", children: "What we like" },
};

/**
 * The award in a table row or a catalogue card, in the section’s accent:
 * the place a category colour appears in running text.
 * @summary An award as text in the category accent (tables, catalogue cards).
 */
export const CategoryAward: Story = {
  parameters: { theme: "assay", category: "running" },
  args: { as: "span", size: "sm", tone: "category", children: "Our pick" },
};
