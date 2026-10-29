import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { VerticalCompare } from "../vertical-compare";

const COLOR_TOKENS = [
  "background",
  "surface",
  "surface-sunken",
  "foreground",
  "muted",
  "accent",
  "accent-foreground",
  "accent-soft",
  "border",
  "positive",
  "negative",
  "caution",
  "award",
];

const PHYSICS_TOKENS = [
  "--radius-surface",
  "--radius-interactive",
  "--radius-badge",
  "--border-width-surface",
  "--space-card-pad",
  "--space-grid-gap",
  "--aspect-product-media",
  "--shadow-surface",
  "--ease-spring",
  "--duration-interactive",
  "--tracking-eyebrow",
  "--font-display",
];

function TokenSheet() {
  return (
    <div className="flex flex-col gap-section-gap">
      <div>
        <p className="type-eyebrow text-muted">Color</p>
        <ul className="mt-cluster-gap grid grid-cols-3 gap-cluster-gap sm:grid-cols-4">
          {COLOR_TOKENS.map((t) => (
            <li key={t} className="flex flex-col gap-1">
              <span
                className="block h-10 w-full rounded-interactive border-surface-w border-border"
                style={{ background: `var(--color-${t})` }}
              />
              <code className="font-metric text-[0.6875rem] text-muted">--color-{t}</code>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="type-eyebrow text-muted">Structural physics</p>
        <dl className="mt-cluster-gap grid grid-cols-[auto_1fr] gap-x-cluster-gap gap-y-1 font-metric text-sm">
          {PHYSICS_TOKENS.map((t) => (
            <PhysicsRow key={t} token={t} />
          ))}
        </dl>
      </div>
      <div>
        <p className="type-eyebrow text-muted">Type voices</p>
        <p className="type-display mt-cluster-gap">Display voice</p>
        <p className="type-display-sm">Display small voice</p>
        <p className="type-metric mt-cluster-gap">9.4 / 10 · $1,249</p>
        <p className="type-eyebrow mt-cluster-gap">Eyebrow voice</p>
      </div>
      <div>
        <p className="type-eyebrow text-muted">Surface</p>
        <div className="mt-cluster-gap rounded-surface border-surface-w border-border bg-surface p-card-pad shadow-surface transition-shadow duration-interactive ease-spring hover:shadow-surface-hover">
          <div className="aspect-product-media w-32 rounded-media bg-surface-sunken" />
          <p className="mt-cluster-gap text-muted">
            Surface card bound to radius, border, padding, shadow and media aspect.
          </p>
        </div>
      </div>
    </div>
  );
}

function PhysicsRow({ token }: { token: string }) {
  return (
    <>
      <dt className="text-muted">{token}</dt>
      <dd
        className="truncate"
        ref={(el) => {
          if (!el) return;
          el.textContent = getComputedStyle(el).getPropertyValue(token).trim() || "—";
        }}
      />
    </>
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
