import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";

import { Disclosure, DisclosureIcon, DisclosureSummary } from "./disclosure";

const meta = {
  title: "Kit/Primitives/Disclosure",
  component: Disclosure,
  subcomponents: { DisclosureSummary, DisclosureIcon },
  tags: ["autodocs"],
  parameters: { layout: "fullscreen", kit: true, frame: "card" },
  play: assertKitPage,
  args: { children: null },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A row in a list that opens on demand: the label, a plain plus that turns
 * into a minus, and the content under it. Closed content stays in the page
 * for search engines.
 * @summary A closed row with a plain icon, for lists of steps or questions.
 */
export const InAList: Story = {
  render: () => (
    <Disclosure className="border-y border-line">
      <DisclosureSummary className="t-ui font-semibold text-fg">
        Timing on the bench
        <DisclosureIcon />
      </DisclosureSummary>
      <p className="m-0 max-w-measure pb-5 t-body text-fg-body">Six positions on a timegrapher after 30 days of wear, against the chronometer band.</p>
    </Disclosure>
  ),
};

/**
 * The first step of a method opens on load (`open`), so the reader sees
 * what the list holds without a click.
 * @summary A disclosure that is open on load.
 */
export const OpenOnLoad: Story = {
  render: () => (
    <Disclosure open className="border-y border-line">
      <DisclosureSummary className="t-ui font-semibold text-fg">
        Bought at retail
        <DisclosureIcon />
      </DisclosureSummary>
      <p className="m-0 max-w-measure pb-5 t-body text-fg-body">Every watch was bought anonymously at full price, from the retailers linked on this page.</p>
    </Disclosure>
  ),
};

/**
 * Disclosures that share a `name` are an accordion: opening one closes the
 * others, with no script.
 * @summary An accordion: disclosures sharing a name, one open at a time.
 */
export const Accordion: Story = {
  render: () => (
    <div className="border-b border-line">
      <Disclosure name="method" open className="border-t border-line">
        <DisclosureSummary className="t-ui font-semibold text-fg">
          Bought at retail
          <DisclosureIcon />
        </DisclosureSummary>
        <p className="m-0 max-w-measure pb-5 t-body text-fg-body">Every watch was bought anonymously at full price.</p>
      </Disclosure>
      <Disclosure name="method" className="border-t border-line">
        <DisclosureSummary className="t-ui font-semibold text-fg">
          Worn for thirty days
          <DisclosureIcon />
        </DisclosureSummary>
        <p className="m-0 max-w-measure pb-5 t-body text-fg-body">Three reviewers wore each watch for a month, at work, in water and overnight on a nightstand.</p>
      </Disclosure>
    </div>
  ),
};

/**
 * A card’s footer drawer: the framed icon reads as a control at the foot of
 * the card. `SpecSheet` uses exactly this for full specifications.
 * @summary A card-footer drawer with the framed icon.
 */
export const CardFooter: Story = {
  render: () => (
    <Disclosure className="border-t border-line">
      <DisclosureSummary className="min-h-14 t-micro text-fg">
        Care and servicing
        <DisclosureIcon framed />
      </DisclosureSummary>
      <p className="m-0 max-w-measure pb-5 t-body text-fg-body">A full service every five to seven years; the bracelet can be cleaned at home with warm water.</p>
    </Disclosure>
  ),
};
