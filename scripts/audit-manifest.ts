#!/usr/bin/env bun
/**
 * MANIFEST AUDIT — checks what AI agents read through the Storybook MCP server
 * (the components and docs manifests), as docs/STORYBOOK.md describes.
 *
 *   bun run audit:manifest                         read storybook-static/manifests (run `bun run build-storybook` first)
 *   bun run audit:manifest --url http://127.0.0.1:6006   read a running Storybook
 *
 * Every component in the manifest must:
 *   • be a kit component, from src/kit (the legacy library, the specimen
 *     sheets and the Playground are tagged !manifest)
 *   • have an @summary, and a description that says when not to use it
 *   • import from a kit entry point (@/kit/ui, components, blocks, templates),
 *     with no package-name or relative import in the line agents copy: every
 *     source resolves (a kit entry point, a fixture, or an installed package
 *     that is not this project) and no name is imported twice
 *   • print story code an agent can paste: no JSX children wrapped in
 *     parentheses, which would render a literal “(” and “)”
 *   • document every prop, and have no docgen error
 *   • have at least one story; every story has an @summary, a snippet and no warning
 * Every docs entry must be a kit guide (src/kit/docs) with a summary.
 */
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

interface Story {
  id: string;
  name: string;
  snippet?: string;
  summary?: string;
  description?: string;
  warning?: string;
  error?: { name: string; message: string };
}
interface Prop {
  description?: string;
}
interface Component {
  id: string;
  name: string;
  path: string;
  summary?: string;
  description?: string;
  import?: string;
  error?: { name: string; message: string };
  stories?: Story[];
  reactComponentMeta?: { props?: Record<string, Prop> };
  reactDocgenTypescript?: { props?: Record<string, Prop> };
  subcomponents?: Record<string, Omit<Component, "stories" | "subcomponents" | "id" | "path"> & { path?: string }>;
}
interface Doc {
  id: string;
  name: string;
  path: string;
  title?: string;
  summary?: string;
  content?: string;
  error?: { name: string; message: string };
}

const urlFlag = process.argv.indexOf("--url");
const base = urlFlag > 0 ? process.argv[urlFlag + 1] : undefined;

async function load<T>(file: string): Promise<T> {
  if (base) {
    const res = await fetch(new URL(`/manifests/${file}`, base));
    if (!res.ok) throw new Error(`${res.status} for ${res.url}`);
    return (await res.json()) as T;
  }
  const p = path.join(process.cwd(), "storybook-static", "manifests", file);
  try {
    return JSON.parse(await readFile(p, "utf8")) as T;
  } catch {
    throw new Error(`No ${path.relative(process.cwd(), p)}: run \`bun run build-storybook\` first, or pass --url.`);
  }
}

const components = (await load<{ components: Record<string, Component> }>("components.json")).components;
const docs = (await load<{ docs: Record<string, Doc> }>("docs.json")).docs;

let problems = 0;
const fail = (where: string, why: string) => {
  problems++;
  console.log(`  ✗ ${where}  ${why}`);
};

/** A named import from a kit entry point or a fixture, or from an installed package. */
const ENTRY = /^import \{ [^}]+ \} from '(@\/(?:kit\/(?:ui|components|blocks|templates|lib\/[\w-]+|types)|fixtures\/kit\/[\w-]+)|[a-z@][\w./-]*)';$/;
const PROJECT = (JSON.parse(await readFile(path.join(process.cwd(), "package.json"), "utf8")) as { name?: string }).name;
const requireFromRoot = createRequire(path.join(process.cwd(), "package.json"));

/** Why a source in an import line would not resolve in this project, or undefined when it does. */
function unresolved(source: string): string | undefined {
  if (source.startsWith(".")) return "a relative path";
  if (source.startsWith("@/")) {
    const target = path.join(process.cwd(), "src", source.slice(2));
    return [".ts", ".tsx", "/index.ts", "/index.tsx"].some((ext) => existsSync(target + ext)) ? undefined : "no such module in src";
  }
  if (source === PROJECT || source.startsWith(`${PROJECT}/`)) return `this project’s own package name (${PROJECT}), which nothing installs`;
  try {
    requireFromRoot.resolve(source);
    return undefined;
  } catch {
    return "not an installed package";
  }
}

/** The import lines an agent copies: every source resolves, and no name comes in twice. */
function checkImports(where: string, code: string | undefined) {
  const lines = (code ?? "").split("\n").filter(Boolean);
  const seen = new Map<string, string>();
  for (const line of lines) {
    const match = ENTRY.exec(line);
    if (!match) {
      fail(where, `import agents would copy: ${line}`);
      continue;
    }
    const why = unresolved(match[1]!);
    if (why) fail(where, `import from '${match[1]}' does not resolve (${why}): ${line}`);
    for (const spec of line.slice(line.indexOf("{") + 1, line.indexOf("}")).split(",")) {
      const local = spec.trim().split(/\s+as\s+/).at(-1)!;
      if (!local) continue;
      if (seen.has(local)) fail(where, `imports ${local} twice: from '${seen.get(local)}' and '${match[1]}'`);
      else seen.set(local, match[1]!);
    }
  }
  return lines;
}

/** JSX children wrapped in parentheses: `<A>(<p>…</p>)</A>` renders a literal “(” and “)”. */
const PAREN_CHILDREN = /(?<!=)>\s*\(\s*<(?!\/)/;

const props = (c: { reactComponentMeta?: { props?: Record<string, Prop> }; reactDocgenTypescript?: { props?: Record<string, Prop> } }) =>
  c.reactComponentMeta?.props ?? c.reactDocgenTypescript?.props ?? {};

for (const c of Object.values(components)) {
  const where = c.id;
  if (!c.path.startsWith("./src/kit/")) fail(where, "not a kit component: tag its stories file `!manifest`");
  if (c.error) fail(where, `${c.error.name}: ${c.error.message.split("\n")[0]}`);
  if (!c.summary) fail(where, "no @summary on the component");
  else if (c.summary.length > 120) fail(where, `@summary is ${c.summary.length} characters (keep it to one line)`);
  if (!c.description) fail(where, "no description");
  else if (!/\*\*Use it for\*\*/.test(c.description)) fail(where, "the description does not say what it is for (JSDoc on the stories file’s meta replaces the component’s)");
  else if (!/\*\*Not for\*\*/.test(c.description)) fail(where, "the description does not say what it is not for");
  const lines = checkImports(where, c.import);
  if (lines.length === 0) fail(where, "no import line");
  if (!lines.some((l) => l.includes(`{ ${c.name} }`) || new RegExp(`[{,] ${c.name}[,} ]`).test(l))) fail(where, `the import line does not import ${c.name}`);
  for (const [name, prop] of Object.entries(props(c))) if (!prop.description?.trim()) fail(where, `prop \`${name}\` has no description`);
  for (const [name, sub] of Object.entries(c.subcomponents ?? {})) {
    if (sub.error) fail(`${where} › ${name}`, `${sub.error.name}: ${sub.error.message.split("\n")[0]}`);
    checkImports(`${where} › ${name}`, sub.import);
    if (!sub.summary) fail(`${where} › ${name}`, "no @summary on the subcomponent");
    for (const [prop, p] of Object.entries(props(sub))) if (!p.description?.trim()) fail(`${where} › ${name}`, `prop \`${prop}\` has no description`);
  }
  const stories = c.stories ?? [];
  if (stories.length === 0) fail(where, "no stories in the manifest");
  for (const s of stories) {
    if (s.error) fail(s.id, `${s.error.name}: ${s.error.message.split("\n")[0]}`);
    if (s.warning) fail(s.id, s.warning);
    if (!s.snippet) fail(s.id, "no code snippet");
    if (!s.summary) fail(s.id, "no @summary on the story");
    if (s.snippet && /\b(Specimen|State|OnCard)\b/.test(s.snippet)) fail(s.id, "a specimen sheet is in the manifest: move it to *.specimen.stories.tsx");
    if (s.snippet && PAREN_CHILDREN.test(s.snippet)) fail(s.id, "JSX children wrapped in parentheses would print a literal “(” and “)”: write the child element without them in the story’s args");
  }
}

for (const d of Object.values(docs)) {
  if (d.error) fail(d.id, `${d.error.name}: ${d.error.message.split("\n")[0]}`);
  if (!d.path.startsWith("./src/kit/docs/")) fail(d.id, "a docs page outside the kit guides (src/kit/docs) is in the manifest: tag its <Meta> `!manifest`");
  if (!d.summary) fail(d.id, "no summary on <Meta>");
}

const storyCount = Object.values(components).reduce((n, c) => n + (c.stories?.length ?? 0), 0);
console.log(`\n${Object.keys(components).length} components, ${storyCount} stories, ${Object.keys(docs).length} guides in the manifest.`);
if (problems) {
  console.log(`✗ ${problems} problem${problems === 1 ? "" : "s"} in what agents read`);
  process.exit(1);
}
console.log("✓ The manifest agents read is complete");
