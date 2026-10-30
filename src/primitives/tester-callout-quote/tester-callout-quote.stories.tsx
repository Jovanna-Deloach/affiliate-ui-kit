import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { authorClinical } from "@/fixtures/authors";
import { testerQuotes } from "@/fixtures/gallery";
import { Specimen } from "@/stories/specimen";
import { VerticalCompare, ViewportFrames } from "@/stories/vertical-compare";

import { TesterCalloutQuote } from "./tester-callout-quote";

const [marchetti, whitfield] = testerQuotes as [(typeof testerQuotes)[number], (typeof testerQuotes)[number]];

const meta = {
  title: "Tier 6 · Editorial & Visual Proof/TesterCalloutQuote",
  component: TesterCalloutQuote,
  parameters: { layout: "fullscreen" },
  args: { quote: marchetti.quote, tester: marchetti.tester, metric: marchetti.metric, tone: "recessed", size: "md" },
  argTypes: {
    tone: { control: "inline-radio", options: ["recessed", "rule"] },
    size: { control: "inline-radio", options: ["md", "lg"] },
    tester: { control: false },
  },
} satisfies Meta<typeof TesterCalloutQuote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="max-w-2xl">
      <TesterCalloutQuote {...args} />
    </div>
  ),
};

export const Tones: Story = {
  name: "Tone and size",
  render: () => (
    <div className="flex max-w-2xl flex-col gap-section">
      <Specimen caption="Recessed well (default)">
        <TesterCalloutQuote quote={marchetti.quote} tester={marchetti.tester} metric={marchetti.metric} />
      </Specimen>
      <Specimen caption="Rule only — inside an already-recessed context">
        <TesterCalloutQuote quote={whitfield.quote} tester={whitfield.tester} metric={whitfield.metric} tone="rule" />
      </Specimen>
      <Specimen caption="Large — pull quote at the display size">
        <TesterCalloutQuote quote={whitfield.quote} tester={whitfield.tester} metric={whitfield.metric} size="lg" />
      </Specimen>
      <Specimen caption="Monogram fallback, no metric">
        <TesterCalloutQuote quote="Grittier mouthfeel than micronised rivals, but it dissolved fully at 20 °C in every run." tester={{ name: "Jonah Whitfield", role: "Contributing tester" }} />
      </Specimen>
    </div>
  ),
};

export const InProse: Story = {
  name: "Inside an article",
  render: () => (
    <div className="flex max-w-prose flex-col gap-stack text-body leading-body text-ink-secondary">
      <p className="m-0">
        The medial post is moulded rather than glued, and that single change is where the Aerolite 3 earns its score. The
        2 started to peel at the seam around mile 300; this one shows nothing at 400.
      </p>
      <TesterCalloutQuote quote={marchetti.quote} tester={marchetti.tester} metric={marchetti.metric} />
      <p className="m-0">Where it loses a point is the lacing, and two of four testers flagged it independently.</p>
      <TesterCalloutQuote quote={whitfield.quote} tester={whitfield.tester} metric={whitfield.metric} tone="rule" />
    </div>
  ),
};

export const SideBySideVerticals: Story = {
  name: "★ Multi-vertical side-by-side",
  render: () => (
    <VerticalCompare>
      <div className="flex flex-col gap-stack">
        <TesterCalloutQuote quote={marchetti.quote} tester={marchetti.tester} metric={marchetti.metric} />
        <TesterCalloutQuote
          quote="Label accuracy was 99.6% across both runs — the tightest spread we have measured for a non-micronised powder."
          tester={authorClinical}
          metric="Batch 2214 · dual-run HPLC"
        />
      </div>
    </VerticalCompare>
  ),
};

export const Viewports: Story = {
  name: "Responsive · 375 vs 1280",
  render: () => <ViewportFrames render={() => <TesterCalloutQuote quote={marchetti.quote} tester={marchetti.tester} metric={marchetti.metric} />} />,
};
