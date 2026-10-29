import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VerticalCompare } from "../vertical-compare";

const PLANES = [
  ["--surface-canvas", "Plane 0 · canvas"],
  ["--surface-primary", "Plane 1 · elevated card"],
  ["--surface-recessed", "Plane 2 · recessed well"],
  ["--surface-inverse", "Plane 3 · inverse CTA"],
] as const;

const INKS = [
  ["--ink-primary", "Ink"],
  ["--ink-secondary", "Secondary"],
  ["--ink-tertiary", "Tertiary"],
  ["--border-hairline", "Hairline"],
  ["--border-strong", "Strong rule"],
] as const;

const SPINE = [
  "--radius-container",
  "--radius-inner",
  "--radius-tag",
  "--inset-card",
  "--inset-well",
  "--row-y",
  "--keyline-monogram",
  "--keyline-price",
  "--keyline-cta",
  "--keyline-label",
  "--keyline-status",
  "--size-control",
  "--text-eyebrow",
  "--text-body",
  "--text-display",
  "--duration-interactive",
] as const;

const TONE = ["--font-display", "--weight-display", "--tracking-display", "--leading-display"] as const;

function Swatch({ token, label }: { token: string; label: string }) {
  return (
    <li className="flex min-w-0 flex-col gap-hairline">
      <span className="block h-10 w-full rounded-inner border border-hairline" style={{ background: `var(${token})` }} />
      <span className="truncate text-caption text-ink">{label}</span>
      <span className="type-mono truncate text-ink-tertiary">{token}</span>
    </li>
  );
}

function ValueRow({ token }: { token: string }) {
  return (
    <div className="grid grid-cols-[var(--keyline-label)_minmax(0,1fr)] items-baseline gap-x-stack border-b border-hairline py-row-compact">
      <dt className="type-mono truncate text-ink-tertiary">{token}</dt>
      <dd
        className="type-metric m-0 truncate text-body-sm text-ink"
        ref={(el) => {
          if (!el) return;
          el.textContent = getComputedStyle(el).getPropertyValue(token).trim() || "—";
        }}
      />
    </div>
  );
}

function TokenSheet() {
  return (
    <div className="flex flex-col gap-section">
      <section className="flex flex-col gap-cluster">
        <p className="type-eyebrow m-0 text-ink-tertiary">Luminance planes</p>
        <ul className="m-0 grid list-none grid-cols-2 gap-cluster p-0 sm:grid-cols-4">
          {PLANES.map(([token, label]) => (
            <Swatch key={token} token={token} label={label} />
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-cluster">
        <p className="type-eyebrow m-0 text-ink-tertiary">Ink and rules</p>
        <ul className="m-0 grid list-none grid-cols-3 gap-cluster p-0 sm:grid-cols-5">
          {INKS.map(([token, label]) => (
            <Swatch key={token} token={token} label={label} />
          ))}
        </ul>
      </section>
      <section className="flex flex-col gap-cluster">
        <p className="type-eyebrow m-0 text-ink-tertiary">Type voices</p>
        <div className="flex flex-col gap-cluster rounded-container border border-hairline bg-surface p-card">
          <p className="type-display m-0">Display voice — the vertical&apos;s tone</p>
          <p className="type-title m-0">Title voice for cards and sections</p>
          <p className="m-0 max-w-prose text-body leading-body text-ink-secondary">
            Body prose at 15px on a 1.6 leading, held to a 62-character measure so wide viewports never stretch a paragraph across the page.
          </p>
          <p className="m-0 text-body-sm text-ink-secondary">Body small — dense cells, spec values, merchant rows.</p>
          <p className="type-eyebrow m-0 text-ink-tertiary">Eyebrow voice</p>
          <p className="type-mono m-0 text-ink-tertiary">Mono metadata · batch 2214</p>
          <p className="m-0 flex items-baseline gap-cluster">
            <span className="type-hero-metric">9.2</span>
            <span className="type-metric text-body text-ink">$1,249</span>
            <span className="type-metric text-body-sm text-ink-secondary">38 / 30 mm</span>
          </p>
        </div>
      </section>
      <section className="grid gap-grid md:grid-cols-2">
        <div className="flex flex-col gap-cluster">
          <p className="type-eyebrow m-0 text-ink-tertiary">Structural spine — identical in every vertical</p>
          <dl className="m-0 border-t border-hairline">
            {SPINE.map((t) => (
              <ValueRow key={t} token={t} />
            ))}
          </dl>
        </div>
        <div className="flex flex-col gap-cluster">
          <p className="type-eyebrow m-0 text-ink-tertiary">Tone — the only thing a vertical changes</p>
          <dl className="m-0 border-t border-hairline">
            {TONE.map((t) => (
              <ValueRow key={t} token={t} />
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}

const meta = {
  title: "Foundations/Tokens",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ActiveVertical: Story = {
  render: () => <TokenSheet />,
};

export const SideBySide: Story = {
  render: () => (
    <VerticalCompare>
      <TokenSheet />
    </VerticalCompare>
  ),
};
