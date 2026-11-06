import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { Eyebrow } from "./eyebrow";
import { Price } from "./price";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Kit/Specimen sheets/Primitives/Price",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "Every price in the kit: tabular figures in the text voice, at four sizes, with an optional list price, a note and a sold-out state.";

function Sized({ size, use, children }: { size: string; use: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Eyebrow size="sm" items={[size, use]} />
      {children}
    </div>
  );
}

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Primitive" title="Price" description={DESCRIPTION}>
      <State label="Sizes">
        <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
          <Sized size="lg" use="offer card">
            <Price amount={3950} size="lg" />
          </Sized>
          <Sized size="md" use="compact card">
            <Price amount={4850} size="md" />
          </Sized>
          <Sized size="sm" use="table">
            <Price amount={1650} size="sm" />
          </Sized>
          <Sized size="xs" use="retailer row">
            <Price amount={890} size="xs" />
          </Sized>
        </div>
      </State>
      <State label="List price struck through">
        <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
          <Price amount={3950} was={4400} size="lg" />
          <Price amount={420} was={495} size="md" />
          <Price amount={1695} was={1695} size="md" note="Same list price: not struck" />
        </div>
      </State>
      <State label="With a note">
        <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
          <Price amount={1650} size="sm" note="at Verra" />
          <Price amount={3990} size="xs" note="+$40 vs. best" />
        </div>
      </State>
      <State label="Right-aligned, as in a table column">
        <div className="max-w-xs border-y border-line py-3 text-right">
          <Price amount={12450} size="sm" note="at Haus & Field" />
        </div>
      </State>
      <State label="Sold out">
        <div className="flex items-center gap-3 text-fg-muted">
          <Price amount={4100} size="xs" soldOut />
          <Eyebrow as="span" size="sm">
            Sold out
          </Eyebrow>
        </div>
      </State>
    </Specimen>
  ),
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Primitive" title="Price" description={DESCRIPTION} category="supplements">
      <State label="Sizes">
        <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
          <Price amount={21} size="lg" />
          <Price amount={29} size="md" />
          <Price amount={32} size="sm" />
          <Price amount={27} size="xs" />
        </div>
      </State>
      <State label="List price struck through">
        <Price amount={189} was={220} size="lg" />
      </State>
      <State label="Per-serving note">
        <Price amount={21} size="lg" note="$0.21 a serving" />
      </State>
      <State label="Cents and other currencies">
        <div className="flex flex-wrap items-start gap-x-10 gap-y-6">
          <Price amount={24.99} size="md" />
          <Price amount={189} currency="EUR" size="md" />
          <Price amount={149} currency="GBP" size="md" />
        </div>
      </State>
    </Specimen>
  ),
};
