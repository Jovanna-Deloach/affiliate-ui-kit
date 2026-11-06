import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { assertKitPage } from "@/kit/testing/page-checks";
import { OnCard, Specimen, State } from "@/kit/testing/specimen";

import { Disclosure, DisclosureIcon, DisclosureSummary } from "./disclosure";
import { Eyebrow } from "./eyebrow";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Specimen sheets/Primitives/Disclosure",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "Show and hide with a native details element: no script, closed content stays in the page, and a shared name makes an accordion.";

const STEPS = [
  { title: "Bought at retail", body: "Every product came from the retailers we link to, at full price, so we went through the same purchase you will." },
  { title: "Worn for thirty days", body: "Each watch spent a month on the wrist of a reviewer who had not chosen it, through office days, travel and sleep." },
  { title: "Opened at the bench", body: "Our watchmaker removed every caseback and timed each movement in six positions on a timegrapher." },
];

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Primitive" title="Disclosure" description={DESCRIPTION}>
      <State label="Rows, one open at a time (shared name)">
        <OnCard>
          <ul className="m-0 list-none p-0">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-b border-line last:border-0">
                <Disclosure name="atelier-steps" open={i === 0}>
                  <DisclosureSummary className="min-h-14 rounded-ctl py-3 t-ui font-semibold text-fg">
                    {step.title}
                    <DisclosureIcon />
                  </DisclosureSummary>
                  <p className="m-0 max-w-measure pb-5 t-body text-fg-body">{step.body}</p>
                </Disclosure>
              </li>
            ))}
          </ul>
        </OnCard>
      </State>
      <State label="Card footer, framed icon">
        <div className="@container kit-card">
          <p className="m-0 p-5 t-body text-fg-body">The review sits above; the footer folds away the detail.</p>
          <Disclosure className="border-t border-line">
            <DisclosureSummary className="min-h-14 rounded-b-box px-5">
              <Eyebrow as="span" tone="default" items={["Full specifications", <span key="n" className="text-fg-muted">5 details</span>]} />
              <DisclosureIcon framed />
            </DisclosureSummary>
            <p className="m-0 px-5 pb-5 t-small text-fg-body">Case 40 mm steel, lug to lug 47 mm, 100 m water resistance.</p>
          </Disclosure>
        </div>
      </State>
      <State label="Open on load">
        <OnCard>
          <Disclosure open>
            <DisclosureSummary className="t-ui font-semibold text-fg">
              Why we test in six positions
              <DisclosureIcon />
            </DisclosureSummary>
            <p className="m-0 pt-2 t-small text-fg-body">A watch keeps different time dial up, crown down and every way between; one figure would hide that.</p>
          </Disclosure>
        </OnCard>
      </State>
      <State label="A summary that wraps">
        <OnCard className="max-w-xs">
          <Disclosure>
            <DisclosureSummary className="t-ui font-semibold text-fg">
              How we choose which retailers appear in the buy box
              <DisclosureIcon />
            </DisclosureSummary>
            <p className="m-0 pt-2 t-small text-fg-body">By price, lowest first. Partners never move up.</p>
          </Disclosure>
        </OnCard>
      </State>
    </Specimen>
  ),
};

export const Assay: Story = {
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Primitive" title="Disclosure" description={DESCRIPTION} category="supplements">
      <State label="Rows, one open at a time (shared name)">
        <OnCard>
          <ul className="m-0 list-none p-0">
            {[
              { title: "Blinded at intake", body: "Labels were removed and each tub given a code before it left our office for the lab." },
              { title: "Assayed twice", body: "Two HPLC runs on different days; we report the mean and flag any pair more than 2% apart." },
              { title: "Screened for metals", body: "Lead, arsenic, cadmium and mercury by ICP-MS, reported in parts per billion against each limit." },
            ].map((step, i) => (
              <li key={step.title} className="border-b border-line last:border-0">
                <Disclosure name="assay-steps" open={i === 0}>
                  <DisclosureSummary className="min-h-14 rounded-ctl py-3 t-ui font-semibold text-fg">
                    {step.title}
                    <DisclosureIcon />
                  </DisclosureSummary>
                  <p className="m-0 max-w-measure pb-5 t-body text-fg-body">{step.body}</p>
                </Disclosure>
              </li>
            ))}
          </ul>
        </OnCard>
      </State>
      <State label="Card footer, framed icon">
        <div className="@container kit-card">
          <p className="m-0 p-5 t-body text-fg-body">Lab detail folds into the footer of the review.</p>
          <Disclosure className="border-t border-line">
            <DisclosureSummary className="min-h-14 rounded-b-box px-5">
              <Eyebrow as="span" tone="default" items={["Full certificate", <span key="n" className="text-fg-muted">12 results</span>]} />
              <DisclosureIcon framed />
            </DisclosureSummary>
            <p className="m-0 px-5 pb-5 t-small text-fg-body">Batch PS-2209, assayed October 14, 2026.</p>
          </Disclosure>
        </div>
      </State>
    </Specimen>
  ),
};
