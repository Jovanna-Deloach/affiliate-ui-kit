import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { collectorsGuide } from "@/fixtures/kit/archetypes";
import { creatineGuide } from "@/fixtures/kit/creatine";
import { watchesGuide } from "@/fixtures/kit/watches";
import { assertKitPage } from "@/kit/testing/page-checks";

import { AlsoGreatRail, PickRow } from "./also-great-rail";

const meta = {
  title: "Blocks/Also great rail",
  component: AlsoGreatRail,
  subcomponents: { PickRow },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true },
  play: assertKitPage,
  args: { picks: collectorsGuide.picks, heading: collectorsGuide.railHeading ?? "In this guide", jumpLabel: collectorsGuide.jumpLabel },
} satisfies Meta<typeof AlsoGreatRail>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A collector’s guide opens with its catalogue: every piece a peer, on the
 * same card, three across on a wide screen.
 * @summary A catalogue of every piece in a collector’s guide.
 */
export const Catalogue: Story = {};

/**
 * A long guide can follow its verdict with the remaining picks as a rail.
 * @summary The picks after the verdict, as a rail.
 */
export const AfterTheVerdict: Story = {
  args: { picks: watchesGuide.picks.slice(3), heading: watchesGuide.railHeading ?? "Also great", jumpLabel: watchesGuide.jumpLabel },
};

/**
 * In a narrow container the catalogue is one column of cards.
 * @summary The catalogue in a phone-width container (Assay).
 */
export const NarrowContainer: Story = {
  parameters: { theme: "assay", category: "supplements", frame: "narrow" },
  args: { picks: creatineGuide.picks.slice(2), heading: creatineGuide.railHeading ?? "Also great", jumpLabel: creatineGuide.jumpLabel },
};
