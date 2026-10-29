#!/usr/bin/env node
/**
 * STORYBOOK VERIFICATION HARNESS
 * ---------------------------------------------------------------------------
 * Builds Storybook (optional), serves `storybook-static`, then loads EVERY
 * story in headless Chromium at 375 px and 1280 px, under every vertical
 * token profile, and records:
 *
 *   • console errors / uncaught page errors
 *   • failed network requests (missing fixtures, fonts, broken imports)
 *   • Cumulative Layout Shift after mount (PerformanceObserver), measured
 *     after `document.fonts.ready` and every <img> has decoded
 *   • horizontal document overflow (the #1 375 px regression)
 *   • a full-page screenshot per story × vertical × width → .verify/screens/
 *
 * Usage:
 *   bun run verify:stories                  # verify existing storybook-static
 *   bun run verify:stories -- --build       # build first
 *   bun run verify:stories -- --filter awardbadge
 *   bun run verify:stories -- --widths 375,1280 --verticals luxury-editorial
 *   bun run verify:stories -- --interact    # hover sweep for hover-induced CLS
 *   bun run verify:stories -- --no-screens  # skip screenshots (CI speed)
 *   bun run verify:stories -- --concurrency 4
 *
 * Playwright resolution: project-local `playwright` if installed, otherwise
 * $PLAYWRIGHT_MODULE (defaults to the preinstalled /opt/npm-tools copy).
 */
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);

function loadPlaywright() {
  try {
    return require("playwright");
  } catch {
    const fallback =
      process.env.PLAYWRIGHT_MODULE ?? "/opt/npm-tools/node_modules/playwright";
    return require(fallback);
  }
}

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};

const ROOT = process.cwd();
const STATIC_DIR = path.join(ROOT, "storybook-static");
const OUT_DIR = path.join(ROOT, opt("out", ".verify"));
const WIDTHS = opt("widths", "375,1280").split(",").map(Number);
const VERTICALS = opt("verticals", "luxury-editorial,clinical-performance").split(",");
const FILTER = opt("filter", "").toLowerCase();
const INTERACT = flag("interact");
const SCREENS = !flag("no-screens");
const SETTLE_MS = Number(opt("settle", "250"));
const CLS_BUDGET = Number(opt("cls-budget", "0.02"));
const CONCURRENCY = Number(opt("concurrency", "4"));

if (flag("build") || !existsSync(STATIC_DIR)) {
  console.log("▶ building storybook…");
  const r = spawnSync("bun", ["run", "build-storybook", "--quiet"], {
    stdio: "inherit",
    cwd: ROOT,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".map": "application/json",
};

async function serve(dir) {
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let filePath = path.join(dir, decodeURIComponent(url.pathname));
      if ((await stat(filePath).catch(() => null))?.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }
      const data = await readFile(filePath);
      res.writeHead(200, {
        "content-type": MIME[path.extname(filePath)] ?? "application/octet-stream",
        "cache-control": "no-store",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, port: server.address().port };
}

const { chromium } = loadPlaywright();
const { server, port } = await serve(STATIC_DIR);
const base = `http://127.0.0.1:${port}`;

const index = JSON.parse(await readFile(path.join(STATIC_DIR, "index.json"), "utf8"));
const stories = Object.values(index.entries).filter(
  (e) =>
    e.type === "story" &&
    (!FILTER || e.id.includes(FILTER) || e.title.toLowerCase().includes(FILTER)),
);

if (SCREENS) await mkdir(path.join(OUT_DIR, "screens"), { recursive: true });
else await mkdir(OUT_DIR, { recursive: true });

const browser = await chromium.launch();

// Build the job list: side-by-side stories render their own wrappers, so the
// global vertical is irrelevant for them.
const jobs = [];
for (const story of stories) {
  const verticalsForStory = /side-?by-?side|multi-?vertical|compare|token-driven/i.test(story.id)
    ? [VERTICALS[0]]
    : VERTICALS;
  for (const vertical of verticalsForStory) {
    for (const width of WIDTHS) jobs.push({ story, vertical, width });
  }
}

console.log(`▶ ${stories.length} stories → ${jobs.length} checks (concurrency ${CONCURRENCY})`);

async function runJob({ story, vertical, width }) {
  const context = await browser.newContext({
    viewport: { width, height: width < 768 ? 812 : 900 },
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => pageErrors.push(String(err?.message ?? err)));
  page.on("requestfailed", (req) =>
    failedRequests.push(`${req.failure()?.errorText} ${req.url()}`),
  );
  page.on("response", (res) => {
    if (res.status() >= 400) failedRequests.push(`${res.status()} ${res.url()}`);
  });

  await page.addInitScript(() => {
    window.__cls = 0;
    window.__clsEntries = [];
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value;
            window.__clsEntries.push({
              value: Number(entry.value.toFixed(4)),
              t: Math.round(entry.startTime),
              nodes: (entry.sources ?? [])
                .map(
                  (s) =>
                    s.node &&
                    s.node.tagName +
                      (s.node.className
                        ? "." + String(s.node.className).split(" ").slice(0, 3).join(".")
                        : ""),
                )
                .filter(Boolean)
                .slice(0, 3),
            });
          }
        }
      }).observe({ type: "layout-shift", buffered: true });
    } catch {}
  });

  const url = `${base}/iframe.html?id=${story.id}&viewMode=story&globals=vertical:${vertical}`;
  const record = {
    id: story.id,
    title: story.title,
    name: story.name,
    vertical,
    width,
    url,
    consoleErrors,
    pageErrors,
    failedRequests,
    cls: 0,
    clsEntries: [],
    horizontalOverflow: false,
    screenshot: null,
    status: "pass",
  };

  try {
    await page.goto(url, { waitUntil: "load", timeout: 45_000 });
    await page.waitForSelector("#storybook-root > *", { timeout: 20_000 });
    // Fonts + above-the-fold images settle before CLS is read, so late paints
    // are attributed. Lazy images below the fold never load in a headless
    // viewport, so only eager / in-viewport images are awaited, with a cap.
    await page.evaluate(async () => {
      await document.fonts?.ready;
      const vh = window.innerHeight;
      const pending = Array.from(document.images).filter((img) => {
        if (img.complete) return false;
        if (img.loading === "lazy") {
          const r = img.getBoundingClientRect();
          return r.top < vh * 1.5;
        }
        return true;
      });
      const timeout = new Promise((r) => setTimeout(r, 8000));
      await Promise.race([
        Promise.all(
          pending.map(
            (img) =>
              new Promise((r) => {
                img.addEventListener("load", r, { once: true });
                img.addEventListener("error", r, { once: true });
              }),
          ),
        ),
        timeout,
      ]);
    });
    await page.waitForTimeout(SETTLE_MS);

    const sbError = await page.$("#error-message, .sb-errordisplay:not([hidden]) #error-message");
    if (sbError) {
      const text = (await sbError.textContent())?.trim();
      if (text) pageErrors.push(`storybook: ${text.slice(0, 400)}`);
    }

    if (INTERACT) {
      const handles = await page.$$(
        "#storybook-root button, #storybook-root a, #storybook-root [role=button], #storybook-root [tabindex]",
      );
      for (const h of handles.slice(0, 40)) {
        try {
          await h.hover({ timeout: 800 });
          await page.waitForTimeout(60);
        } catch {}
      }
      await page.mouse.move(0, 0);
      await page.waitForTimeout(SETTLE_MS);
    }

    const metrics = await page.evaluate(() => ({
      cls: window.__cls ?? 0,
      entries: window.__clsEntries ?? [],
      overflow:
        document.documentElement.scrollWidth > window.innerWidth + 1 ||
        document.body.scrollWidth > window.innerWidth + 1,
    }));
    record.cls = Number(metrics.cls.toFixed(4));
    record.clsEntries = metrics.entries;
    record.horizontalOverflow = metrics.overflow;

    if (SCREENS) {
      const shot = path.join(OUT_DIR, "screens", `${story.id}__${vertical}__${width}.png`);
      await page.screenshot({ path: shot, fullPage: true });
      record.screenshot = path.relative(ROOT, shot);
    }
  } catch (err) {
    pageErrors.push(`harness: ${err?.message ?? err}`);
  }

  const problems = [];
  if (consoleErrors.length) problems.push(`${consoleErrors.length} console error(s)`);
  if (pageErrors.length) problems.push(`${pageErrors.length} page error(s)`);
  if (failedRequests.length) problems.push(`${failedRequests.length} failed request(s)`);
  if (record.cls > CLS_BUDGET) problems.push(`CLS ${record.cls}`);
  if (record.horizontalOverflow) problems.push("horizontal overflow");
  if (problems.length) record.status = "fail";

  const tag = record.status === "pass" ? "✓" : "✗";
  console.log(
    `${tag} ${story.id.padEnd(62)} ${vertical.padEnd(22)} ${String(width).padStart(4)}px  cls=${record.cls}` +
      (problems.length ? `  ← ${problems.join(", ")}` : ""),
  );
  for (const e of [...consoleErrors, ...pageErrors, ...failedRequests].slice(0, 4)) {
    console.log(`    · ${e.slice(0, 220)}`);
  }
  await context.close();
  return record;
}

const results = [];
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      results.push(await runJob(job));
    }
  }),
);

await browser.close();
server.close();

results.sort((a, b) => a.id.localeCompare(b.id) || a.vertical.localeCompare(b.vertical) || a.width - b.width);
const failures = results.filter((r) => r.status === "fail").length;
const summary = {
  generatedAt: new Date().toISOString(),
  stories: stories.length,
  checks: results.length,
  failures,
  clsBudget: CLS_BUDGET,
  results,
};
await writeFile(path.join(OUT_DIR, "report.json"), JSON.stringify(summary, null, 2));
console.log(
  `\n${failures === 0 ? "✓" : "✗"} ${results.length - failures}/${results.length} checks passed → ${path.relative(ROOT, path.join(OUT_DIR, "report.json"))}`,
);
process.exit(failures === 0 ? 0 : 1);
