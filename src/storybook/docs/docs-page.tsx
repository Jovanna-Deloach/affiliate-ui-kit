import { ArgTypes, DocsContext, Markdown, Stories, useOf } from "@storybook/addon-docs/blocks";
import { ArrowUpRight, Check, Copy, X } from "lucide-react";
import { type ReactNode, useContext, useEffect, useState } from "react";
import { styled } from "storybook/theming";

/**
 * Every component's page (autodocs), laid out like a design-system site
 * rather than Storybook's default: what layer it is, its name and one-line
 * summary, the import line to copy, a link to its source and a "Copy for AI"
 * button; then "Use it for" and "Not for" as a pair of cards; the examples
 * (one per use case, each with why you would use it); the props.
 *
 * Everything comes from what agents read too (the component's JSDoc and its
 * stories), so the page and the manifest cannot drift apart.
 */

const REPOSITORY = "https://github.com/Jovanna-Deloach/affiliate-ui-kit/blob/main/";
const LAYERS: Record<string, string> = {
  Primitives: "Primitive",
  Components: "Component",
  Blocks: "Block",
  Templates: "Template",
  Legacy: "Legacy library",
};

interface Docgen {
  description?: string;
  displayName?: string;
  filePath?: string;
  tags?: Record<string, string>;
}

/** Splits a kit description at its "**Use it for**" and "**Not for**" sentences. */
export function splitDescription(description: string) {
  const paragraphs = description.trim().split(/\n\s*\n/);
  const at = paragraphs.findIndex((p) => p.includes("**Use it for**"));
  if (at < 0) return { intro: description.trim(), use: undefined, notFor: undefined, rest: "" };
  const [before = "", after = ""] = paragraphs[at]!.split("**Use it for**");
  const [use = "", notFor] = after.split("**Not for**");
  const sentence = (text: string) => text.trim().replace(/^[a-z]/, (c) => c.toUpperCase());
  return {
    intro: [...paragraphs.slice(0, at), before.trim()].filter(Boolean).join("\n\n"),
    use: sentence(use),
    notFor: notFor === undefined ? undefined : sentence(notFor),
    rest: paragraphs.slice(at + 1).join("\n\n"),
  };
}

/** A compound part's import line names its parts too, as the manifest's does (`Disclosure, DisclosureSummary, DisclosureIcon`). */
function withSubcomponents(importLine: string | undefined, parts: string[]) {
  const match = importLine?.match(/^import \{ ([^}]+) \} from (.+)$/);
  if (!match || parts.length === 0) return importLine;
  const names = [...new Set([...match[1]!.split(",").map((n) => n.trim()), ...parts])];
  return `import { ${names.join(", ")} } from ${match[2]}`;
}

/** Story descriptions end with `@summary …` for agents; people read the prose above it. */
function stripStoryTags(context: { componentStories: () => { parameters: Record<string, unknown> }[] }) {
  for (const story of context.componentStories()) {
    const docs = story.parameters.docs as { description?: { story?: unknown } } | undefined;
    if (typeof docs?.description?.story === "string") docs.description.story = docs.description.story.split(/\n\s*@\w/)[0]!.trim();
  }
}

/* ---- Copy for AI: the component as an agent reads it, as Markdown --------- */

interface ManifestProp {
  required?: boolean;
  type?: { name?: string; raw?: string };
  description?: string;
  defaultValue?: { value?: string } | null;
}
interface ManifestComponent {
  name: string;
  description?: string;
  import?: string;
  stories?: { name: string; description?: string; snippet?: string }[];
  reactComponentMeta?: { props?: Record<string, ManifestProp> };
  reactDocgenTypescript?: { props?: Record<string, ManifestProp> };
}

let manifest: Promise<Record<string, ManifestComponent>> | undefined;
/** The components manifest, fetched once (the dev server builds it on first request, which can take seconds). */
const loadManifest = () =>
  (manifest ??= fetch("./manifests/components.json")
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`${res.status}`))))
    .then((json: { components: Record<string, ManifestComponent> }) => json.components)
    .catch((error: unknown) => {
      manifest = undefined;
      throw error;
    }));

export function toMarkdown(component: ManifestComponent): string {
  const props = component.reactComponentMeta?.props ?? component.reactDocgenTypescript?.props ?? {};
  const out = [`# ${component.name}`, "", component.description ?? "", ""];
  if (component.import) out.push("```tsx", component.import, "```", "");
  if (component.stories?.length) {
    out.push("## Examples", "");
    for (const story of component.stories) {
      out.push(`### ${story.name}`, "");
      if (story.description) out.push(story.description, "");
      if (story.snippet) out.push("```tsx", story.snippet, "```", "");
    }
  }
  const rows = Object.entries(props);
  if (rows.length) {
    out.push("## Props", "", "| Prop | Type | Default | Description |", "| --- | --- | --- | --- |");
    const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\s*\n\s*/g, " ");
    for (const [name, prop] of rows) {
      const type = prop.type?.raw ?? prop.type?.name ?? "";
      out.push(`| \`${name}\`${prop.required ? " (required)" : ""} | \`${cell(type)}\` | ${prop.defaultValue?.value ? `\`${cell(prop.defaultValue.value)}\`` : ""} | ${cell(prop.description ?? "")} |`);
    }
  }
  return out.join("\n").trim() + "\n";
}

/* ---- layout --------------------------------------------------------------- */

/** The page's header band: pale blue-gray, as on the Wix Design System's pages. */
const Header = styled.header(({ theme }) => ({
  padding: "32px 36px 28px",
  marginBottom: 36,
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 12,
  background: theme.background.app,
}));

const Eyebrow = styled.p(({ theme }) => ({
  margin: "0 0 10px",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: theme.textMutedColor,
}));

const Title = styled.h1(({ theme }) => ({
  margin: 0,
  fontSize: 36,
  lineHeight: 1.15,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: theme.color.defaultText,
}));

const Lead = styled.p(({ theme }) => ({
  margin: "12px 0 0",
  maxWidth: "62ch",
  fontSize: 17,
  lineHeight: 1.55,
  color: theme.color.defaultText,
  opacity: 0.82,
}));

const Actions = styled.div({ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginTop: 20 });

const ImportLine = styled.div(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  maxWidth: "100%",
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 6,
  background: theme.background.content,
  "& code": {
    padding: "0 4px 0 12px",
    overflowX: "auto",
    whiteSpace: "nowrap",
    fontFamily: theme.typography.fonts.mono,
    fontSize: 12.5,
    color: theme.color.defaultText,
  },
}));

const IconButton = styled.button(({ theme }) => ({
  display: "inline-grid",
  placeItems: "center",
  flex: "none",
  width: 34,
  height: 34,
  border: 0,
  borderRadius: 6,
  background: "transparent",
  color: theme.textMutedColor,
  cursor: "pointer",
  "&:hover": { color: theme.color.secondary },
  "&:focus-visible": { outline: `2px solid ${theme.color.secondary}`, outlineOffset: -2 },
}));

const action = ({ theme }: { theme: import("storybook/theming").Theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 34,
  padding: "0 12px",
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: 6,
  background: theme.background.content,
  color: theme.color.defaultText,
  fontSize: 13,
  fontWeight: 500,
  textDecoration: "none",
  cursor: "pointer",
  "&:hover": { borderColor: theme.color.secondary, color: theme.color.secondary },
  "&:focus-visible": { outline: `2px solid ${theme.color.secondary}`, outlineOffset: 2 },
  "& svg": { flex: "none" },
});
const Action = styled.a(action);
const ActionButton = styled.button(action);

const Pair = styled.div({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))",
  gap: 16,
  margin: "8px 0 24px",
});

const Card = styled.section<{ tone: "do" | "dont" }>(({ theme, tone }) => ({
  padding: "16px 20px 18px",
  border: `1px solid ${theme.appBorderColor}`,
  borderTop: `3px solid ${tone === "do" ? "#2f6b45" : "#9b2c2c"}`,
  borderRadius: 8,
  background: theme.background.content,
  "& p": { margin: 0, fontSize: 14.5, lineHeight: 1.6 },
  "& code": { fontSize: 12.5 },
}));

const CardTitle = styled.div<{ tone: "do" | "dont" }>(({ tone }) => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  margin: "0 0 8px",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: tone === "do" ? "#2f6b45" : "#9b2c2c",
}));

const Section = styled.h2(({ theme }) => ({
  margin: "48px 0 8px",
  padding: 0,
  border: 0,
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: "-0.01em",
  color: theme.color.defaultText,
}));

const SectionNote = styled.p(({ theme }) => ({ margin: "0 0 16px", fontSize: 14, color: theme.textMutedColor }));

function CopyButton({ text, label }: { text: () => Promise<string> | string; label: string }) {
  const [done, setDone] = useState<"ok" | "failed" | null>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(await text());
      setDone("ok");
    } catch {
      setDone("failed");
    }
    window.setTimeout(() => setDone(null), 1600);
  };
  return (
    <IconButton type="button" onClick={copy} aria-label={done === "ok" ? "Copied" : label} title={label}>
      {done === "ok" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
    </IconButton>
  );
}

function CopyForAI({ id }: { id: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  // Fetch ahead of the click: a clipboard write must follow the click closely.
  useEffect(() => void loadManifest().catch(() => undefined), []);
  const copy = async () => {
    try {
      const component = (await loadManifest())[id];
      if (!component) throw new Error(`${id} is not in the manifest`);
      await navigator.clipboard.writeText(toMarkdown(component));
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1800);
  };
  return (
    <ActionButton type="button" onClick={copy} title="Copy this component as an AI agent reads it (Markdown)">
      {state === "copied" ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      {state === "copied" ? "Copied for AI" : state === "failed" ? "Not available here" : "Copy for AI"}
    </ActionButton>
  );
}

function UsePair({ use, notFor }: { use?: string; notFor?: string }): ReactNode {
  if (!use && !notFor) return null;
  return (
    <Pair>
      {use ? (
        <Card tone="do" aria-label="Use it for">
          <CardTitle tone="do">
            <Check size={14} strokeWidth={2.5} aria-hidden /> Use it for
          </CardTitle>
          <Markdown>{use}</Markdown>
        </Card>
      ) : null}
      {notFor ? (
        <Card tone="dont" aria-label="Not for">
          <CardTitle tone="dont">
            <X size={14} strokeWidth={2.5} aria-hidden /> Not for
          </CardTitle>
          <Markdown>{notFor}</Markdown>
        </Card>
      ) : null}
    </Pair>
  );
}

export function DocsPage() {
  const context = useContext(DocsContext);
  stripStoryTags(context as unknown as Parameters<typeof stripStoryTags>[0]);

  const { preparedMeta } = useOf("meta", ["meta"]);
  const component = preparedMeta.component as { __docgenInfo?: Docgen } | undefined;
  const docgen = component?.__docgenInfo ?? {};
  const docsParameter = preparedMeta.parameters.docs as { description?: { component?: string } } | undefined;
  const description = docsParameter?.description?.component ?? docgen.description ?? "";
  const { intro, use, notFor, rest } = splitDescription(description);

  const path = preparedMeta.title.split("/");
  const layer = LAYERS[path[0]!] ?? path[0];
  const name = path[path.length - 1];
  const source = docgen.filePath?.includes("/src/") ? `src/${docgen.filePath.split("/src/").pop()}` : undefined;
  const importLine = withSubcomponents(docgen.tags?.import, Object.keys(preparedMeta.subcomponents ?? {}));
  // Copy for AI only where there is something for agents: the kit's parts (the legacy library is not in the manifest).
  const fileName = preparedMeta.parameters.fileName as string | undefined;
  const inManifest = Boolean(fileName?.startsWith("./src/kit/") && !fileName.includes(".specimen."));

  return (
    <>
      <Header>
        <Eyebrow>{layer}</Eyebrow>
        <Title>{name}</Title>
        {docgen.tags?.summary ? <Lead>{docgen.tags.summary}</Lead> : null}
        <Actions>
          {importLine ? (
            <ImportLine>
              <code>{importLine}</code>
              <CopyButton text={() => importLine} label="Copy the import line" />
            </ImportLine>
          ) : null}
          {inManifest ? <CopyForAI id={preparedMeta.id} /> : null}
          {source ? (
            <Action href={REPOSITORY + source} target="_blank" rel="noreferrer" title={source}>
              Source <ArrowUpRight size={15} aria-hidden />
            </Action>
          ) : null}
        </Actions>
      </Header>
      {intro ? <Markdown>{intro}</Markdown> : null}
      <UsePair use={use} notFor={notFor} />
      {rest ? <Markdown>{rest}</Markdown> : null}
      <Stories title={<Section id="examples">Examples</Section>} />
      <Section id="props">Props</Section>
      <SectionNote>Every prop, with its type and default. Try any combination in Getting started / Playground.</SectionNote>
      <ArgTypes />
    </>
  );
}
