import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Badge } from "./badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { children: "64 days on the wrist", size: "md" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A proof beside a tester’s name: what they did to earn the right to the
 * quote. The outline keeps it quieter than the name it qualifies.
 * @summary A proof beside a name, outlined (“64 days on the wrist”).
 */
export const Proof: Story = {};

/**
 * A stamp set on a photograph: translucent paper with a blur, so it reads
 * over any part of the studio well.
 * @summary A frosted stamp for a photograph.
 */
export const OnPhotograph: Story = {
  args: { variant: "frosted", size: "sm", children: "Tested in the lab" },
};

/**
 * A result that passed, in the pass tone. Pair the color with the word:
 * tone is never the only signal.
 * @summary A soft status pill in the pass tone.
 */
export const Passed: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { variant: "soft", tone: "pass", size: "sm", children: "Within limits" },
};

/**
 * A result near a limit, in the warning tone.
 * @summary A soft status pill in the warning tone.
 */
export const NearLimit: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { variant: "soft", tone: "warn", size: "sm", children: "Near the limit" },
};

/**
 * A result that failed, in the fail tone.
 * @summary A soft status pill in the fail tone.
 */
export const Failed: Story = {
  parameters: { theme: "assay", category: "supplements" },
  args: { variant: "soft", tone: "fail", size: "sm", children: "Over the limit" },
};

/**
 * The solid surface is the award’s. Reach for `Award`, which sets it; use
 * the variant directly only for a custom award-like mark.
 * @summary The solid surface (prefer Award for awards).
 */
export const Solid: Story = {
  args: { variant: "solid", size: "sm", children: "Editor’s choice" },
};
