import { CodeOrSourceMdx } from "@storybook/addon-docs/blocks";
import { type ComponentProps, useEffect, useRef, useState } from "react";

import { watchesGuide } from "@/fixtures/kit/watches";
import { Button } from "@/kit/ui";

/**
 * Live specimens for the Foundations pages. Each renders the real theme CSS
 * in both themes, so what people see is what the kit ships. The values agents
 * need stay written out in the guides' tables: an agent reads the MDX source,
 * where these appear only as one-line tags.
 */

const THEMES = [
  { theme: "atelier", name: "Atelier" },
  { theme: "assay", name: "Assay" },
] as const;

/* ---- inline code: a chip beside every hex colour ------------------------- */

const HEX = /^#[0-9a-f]{6}$/i;

/** The MDX `code` element: inline hex values get a swatch; everything else renders as Storybook's own. */
export function DocsCode(props: ComponentProps<typeof CodeOrSourceMdx>) {
  const { className, children } = props;
  if (typeof className !== "string" && typeof children === "string" && HEX.test(children)) {
    return (
      <span style={{ whiteSpace: "nowrap" }}>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "0.9em",
            height: "0.9em",
            marginRight: 5,
            borderRadius: 3,
            verticalAlign: "-0.12em",
            background: children,
            boxShadow: "inset 0 0 0 1px rgb(24 22 20 / 0.14)",
          }}
        />
        <CodeOrSourceMdx {...props} />
      </span>
    );
  }
  return <CodeOrSourceMdx {...props} />;
}

/* ---- Themes: the two publications side by side ---------------------------- */

const PUBLICATIONS = {
  atelier: {
    publication: "Caliber · luxury goods",
    title: "The best everyday watches",
    body: "Five watches worn for thirty days and timed every morning against an atomic reference.",
    category: undefined,
  },
  assay: {
    publication: "Proving Ground · lab-tested",
    title: "The best creatine, tested by a lab",
    body: "Twelve tubs bought at retail, blinded, and assayed twice for purity and heavy metals.",
    category: "supplements",
  },
} as const;

const SWATCHES = ["ground", "paper", "well", "fg", "accent", "accent-category"] as const;

export function ThemeCards() {
  return (
    <div className="sb-unstyled @container my-8">
      <div className="grid gap-4 @2xl:grid-cols-2">
        {THEMES.map(({ theme, name }) => {
          const p = PUBLICATIONS[theme];
          return (
            <section key={theme} data-theme={theme} data-category={p.category} aria-label={`${name} theme`} className="rounded-box border border-line p-6">
              <p className="t-micro text-fg-muted">{p.publication}</p>
              <p className="mt-3 t-title text-fg">{p.title}</p>
              <p className="mt-2 t-body text-fg-body">{p.body}</p>
              <ul className="mt-5 flex list-none flex-wrap gap-x-4 gap-y-2 p-0">
                {SWATCHES.map((role) => (
                  <li key={role} className="flex items-center gap-2 t-caption text-fg-muted">
                    <span aria-hidden="true" className="size-4 rounded-full border border-line-strong" style={{ background: `var(--${role})` }} />
                    {role}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button emphasis="primary">See the verdict</Button>
                <Button>How we test</Button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Typography: every style, measured at this width ---------------------- */

const STYLES = [
  ["t-display", "Everyday watches"],
  ["t-headline", "How we tested 14 watches"],
  ["t-title", "Sato Marine 38"],
  ["t-name", "Brennan Field 36"],
  ["t-name-sm", "Halden Chronograph 40"],
  ["t-quote", "“It lost four seconds in a month.”"],
  ["t-score", "8.7"],
  ["t-stat", "14"],
  ["t-lead", "The one to buy if you only buy one watch."],
  ["t-body", "We wore each watch for thirty days and timed it every morning against an atomic reference."],
  ["t-ui", "Haus & Field"],
  ["t-small", "Free returns within 30 days"],
  ["t-caption", "Photographed in our studio"],
  ["t-button", "Buy at Verra"],
  ["t-price", "$3,950"],
  ["t-figure", "+4.2 s/day"],
  ["t-figure-table", "1,240 mg"],
  ["t-figure-xl", "99.4%"],
  ["t-micro", "Our pick"],
  ["t-micro-sm", "Lab verified"],
] as const;

function measure(el: HTMLElement) {
  const style = getComputedStyle(el);
  const size = parseFloat(style.fontSize);
  const lineHeight = style.lineHeight === "normal" ? "normal" : (parseFloat(style.lineHeight) / size).toFixed(2);
  const family = style.fontFamily.split(",")[0]!.replace(/["']/g, "").replace(/ Variable$/, "");
  return `${family} ${style.fontWeight} · ${Math.round(size * 10) / 10}px / ${lineHeight}`;
}

function Sample({ style, text }: { style: string; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [metrics, setMetrics] = useState("");
  useEffect(() => {
    const update = () => ref.current && setMetrics(measure(ref.current));
    update();
    void document.fonts?.ready.then(update);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return (
    <div className="min-w-0">
      <p ref={ref} className={`${style} text-fg`}>
        {text}
      </p>
      <p className="mt-1.5 t-caption text-fg-muted" data-numeric>
        {metrics}
      </p>
    </div>
  );
}

export function TypeScale() {
  return (
    <div data-theme="atelier" className="sb-unstyled @container my-8 overflow-hidden rounded-box border border-line">
      {STYLES.map(([style, text]) => (
        <div key={style} className="grid border-b border-line last:border-b-0 @3xl:grid-cols-[9rem_1fr_1fr]">
          <div className="px-5 pt-4 @3xl:py-5">
            <code className="t-caption text-fg">{style}</code>
          </div>
          {THEMES.map(({ theme, name }) => (
            <div key={theme} data-theme={theme} aria-label={name} className="px-5 py-4 @3xl:py-5">
              <Sample style={style} text={text} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---- Layout: the spacing steps --------------------------------------------- */

const STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32] as const;

export function SpacingScale() {
  return (
    <div data-theme="atelier" className="sb-unstyled my-8 rounded-box border border-line bg-paper px-6 py-5">
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {STEPS.map((step) => (
          <li key={step} className="grid grid-cols-[3rem_4rem_1fr] items-center gap-4 t-caption text-fg-muted">
            <code className="text-fg">{step}</code>
            <span data-numeric className="tabular-nums">
              {step * 4}px
            </span>
            <span aria-hidden="true" className="h-3 rounded-ctl bg-telemetry" style={{ width: step * 4 }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---- Surfaces: ground, paper, well, the studio ----------------------------- */

const RADII = ["rounded-box", "rounded-ctl", "rounded-media"] as const;

export function Surfaces() {
  const image = watchesGuide.picks[0]!.product.image;
  return (
    <div className="sb-unstyled @container my-8">
      <div className="grid gap-4 @2xl:grid-cols-2">
        {THEMES.map(({ theme, name }) => (
          <section key={theme} data-theme={theme} aria-label={`${name} surfaces`} className="rounded-box border border-line p-5">
            <code className="t-caption text-fg-muted">ground · {name}</code>
            <div className="mt-3 kit-card p-5">
              <code className="t-caption text-fg-muted">kit-card</code>
              <div className="mt-3 kit-recess px-4 py-3">
                <code className="t-caption text-fg-muted">kit-recess</code>
              </div>
            </div>
            <div className="mt-4 kit-card-feature p-5">
              <code className="t-caption text-fg-muted">kit-card-feature</code>
              <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-media kit-studio">
                {/* A plain <img>: a docs specimen, not a page (pages use ProductImage, on next/image). */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt="" className="absolute inset-0 size-full object-contain p-8 kit-object" />
              </div>
              <code className="mt-2 block t-caption text-fg-muted">kit-studio · kit-object</code>
            </div>
            <div className="mt-5 flex flex-wrap gap-5">
              {RADII.map((radius) => (
                <div key={radius} className="flex flex-col items-start gap-2">
                  <span aria-hidden="true" className={`block size-12 border border-line-strong bg-paper ${radius}`} />
                  <code className="t-caption text-fg-muted">{radius}</code>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
