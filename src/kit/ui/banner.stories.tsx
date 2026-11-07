import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Banner } from "./banner";

const meta = {
  title: "Primitives/Banner",
  component: Banner,
  tags: ["autodocs", "new"],
  parameters: { layout: "fullscreen", kit: true, theme: "assay", category: "supplements", frame: "none" },
  play: assertKitPage,
  args: {
    tone: "danger",
    title: "Fieldwork recalled two lots of its creatine capsules.",
    children: "Their shells contain milk protein the label doesn’t list.",
    action: (
      <a href="#warning-fieldwork-creatine-capsules" className="kit-focus kit-link rounded-ctl text-fg">
        What to do
      </a>
    ),
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A recall, under the masthead of the product’s page: red bar, the point in bold, a link to the full warning.
 * @summary A recall: danger, linked to the full warning.
 */
export const Recall: Story = {};

/**
 * Read before relying on the page: amber bar.
 * @summary A warning: prices on the page are out of date.
 */
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Prices on this page are three days old.",
    children: "Our price checker is down; we’ll update them as soon as it’s back.",
    action: undefined,
  },
};

/**
 * News about the site’s testing, on the cool gray well.
 * @summary News: retesting every creatine.
 */
export const News: Story = {
  args: {
    tone: "info",
    title: "We’re retesting every creatine we certify.",
    children: "New batches go to the lab this month; results by December 15.",
    action: (
      <a href="#method" className="kit-focus kit-link rounded-ctl text-fg">
        How we test
      </a>
    ),
  },
};
