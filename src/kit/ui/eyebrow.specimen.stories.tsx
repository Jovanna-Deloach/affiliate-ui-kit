import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BadgeCheck, FlaskConical } from "lucide-react";

import { assertKitPage } from "@/kit/testing/page-checks";
import { Specimen, State } from "@/kit/testing/specimen";

import { Breadcrumb, Eyebrow } from "./eyebrow";

/**
 * Every state on one sheet, in both themes, for people reviewing the
 * system. Not in the agent manifest: agents read the use-case stories.
 */
const meta = {
  title: "Kit/Specimen sheets/Primitives/Eyebrow and breadcrumb",
  tags: ["!manifest"],
  parameters: { layout: "fullscreen", kit: true, frame: "none" },
  play: assertKitPage,
} satisfies Meta;

export default meta;
/** Specimen pages render every state themselves, so stories take no args. */
type Story = StoryObj;

const DESCRIPTION = "The micro-caps voice as a component: labels, descriptors, stamps and data headings, written in sentence case with the capitals set by CSS.";

export const Atelier: Story = {
  parameters: { theme: "atelier" },
  render: () => (
    <Specimen kind="Primitive" title="Eyebrow and breadcrumb" description={DESCRIPTION}>
      <State label="Breadcrumb">
        <Breadcrumb
          items={[
            { label: "Watches", href: "#watches" },
            { label: "Buying guides", href: "#guides" },
          ]}
        />
      </State>
      <State label="Descriptor">
        <Eyebrow>Automatic GMT, 40 mm steel</Eyebrow>
      </State>
      <State label="Verification stamp">
        <Eyebrow tone="default" icon={<BadgeCheck size={14} strokeWidth={2} className="text-pass" />}>
          Updated <time dateTime="2026-10-28">October 28, 2026</time>
        </Eyebrow>
      </State>
      <State label="Parts joined by a dot">
        <Eyebrow items={["Chronometer", "6 positions"]} />
      </State>
      <State label="Tones">
        <div className="flex flex-col gap-2">
          <Eyebrow>Muted, the default</Eyebrow>
          <Eyebrow tone="default">Ink</Eyebrow>
          <Eyebrow tone="category">Category accent</Eyebrow>
        </div>
      </State>
      <State label="Sizes">
        <div className="flex flex-col gap-2">
          <Eyebrow>Medium, 11 px</Eyebrow>
          <Eyebrow size="sm">Small, 10 px</Eyebrow>
        </div>
      </State>
    </Specimen>
  ),
};

export const Assay: Story = {
  name: "Assay, running",
  parameters: { theme: "assay" },
  render: () => (
    <Specimen kind="Primitive" title="Eyebrow and breadcrumb" description={DESCRIPTION} category="running">
      <State label="Breadcrumb">
        <Breadcrumb
          items={[
            { label: "Running", href: "#running" },
            { label: "Shoe reviews", href: "#shoes" },
            { label: "Daily trainers", href: "#daily" },
          ]}
        />
      </State>
      <State label="Stamp with a category icon">
        <Eyebrow tone="default" icon={<FlaskConical size={14} strokeWidth={2} className="text-accent-category-ink" />}>
          Bench tested <time dateTime="2026-10-30">October 30, 2026</time>
        </Eyebrow>
      </State>
      <State label="Category tone">
        <Eyebrow tone="category">Best for fast days</Eyebrow>
      </State>
      <State label="Long breadcrumb in a narrow column">
        <div className="max-w-56">
          <Breadcrumb
            items={[
              { label: "Running", href: "#running-2" },
              { label: "Shoe reviews", href: "#shoes-2" },
              { label: "Recovery and long runs", href: "#recovery" },
            ]}
          />
        </div>
      </State>
    </Specimen>
  ),
};
