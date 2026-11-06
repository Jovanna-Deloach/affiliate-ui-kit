import { CheckIcon, CopyIcon, LinkIcon, PlayHollowIcon, UndoIcon } from "@storybook/icons";
import React from "react";
import { CURRENT_STORY_WAS_SET } from "storybook/internal/core-events";
import { Button, Select, Separator } from "storybook/internal/components";
import { addons, types, useAddonState, useChannel, useGlobals, useStorybookApi, type API } from "storybook/manager-api";
import { styled } from "storybook/theming";

import {
  CATEGORIES,
  decodeCode,
  encodeCode,
  EXAMPLES,
  FRAMES,
  PLAYGROUND,
  SAMPLE_DATA,
  type PlaygroundCategory,
  type PlaygroundFrame,
  type PlaygroundState,
  type PlaygroundStatus,
} from "../../src/storybook/playground/shared";
import { CodeEditor } from "./code-editor";

/**
 * The Playground panel: an editor below the canvas whose code renders live in
 * the Playground story, with every kit part and the sample data in scope.
 * Copy copies the code; Share copies a link that opens the Playground with
 * it; Reset goes back to the example. Code in a link is shown but not run
 * until the reader presses Run: a link must never execute code unasked.
 */

interface PanelState extends PlaygroundState {
  example: string;
  /** False for code that arrived in a link and has not been run yet. */
  trusted: boolean;
}

const STORAGE_KEY = "kit-playground";
const first = EXAMPLES[0]!;

let initial: PanelState | undefined;
/** Read once per page load: a shared link's code, else the last session's, else the first example. */
const initialState = (api: API): PanelState => (initial ??= readInitialState(api));

function readInitialState(api: API): PanelState {
  const shared = api.getQueryParam("code");
  if (shared) {
    const code = decodeCode(shared);
    const frame = FRAMES.find((f) => f.value === api.getQueryParam("frame"))?.value ?? "well";
    const category = CATEGORIES.find((c) => c.value === api.getQueryParam("category"))?.value;
    if (code) return { code, frame, category, example: "", trusted: false };
  }
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null") as PanelState | null;
    if (saved && typeof saved.code === "string") return { ...saved, trusted: true };
  } catch {
    // Storage can be unavailable (private windows); start from the first example.
  }
  return { code: first.code, frame: first.frame, category: first.category, example: first.id, trusted: true };
}

const Wrapper = styled.div({ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 });

const Bar = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 4,
  flexWrap: "wrap",
  minHeight: 40,
  padding: "4px 8px",
  borderBottom: `1px solid ${theme.appBorderColor}`,
  background: theme.background.content,
}));

const Spacer = styled.div({ flex: 1 });

const Field = styled.div(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 2,
  paddingLeft: 8,
  fontSize: 12,
  color: theme.textMutedColor,
}));

const Status = styled.div<{ tone: "ok" | "error" | "waiting" }>(({ theme, tone }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  maxWidth: 420,
  padding: "0 8px",
  fontSize: 12,
  color: tone === "error" ? "#9b2c2c" : theme.textMutedColor,
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  "&::before": {
    content: '""',
    flex: "none",
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: tone === "error" ? "#c2362b" : tone === "ok" ? "#1a7f37" : "#c3cfdb",
  },
}));

const Notice = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "8px 16px",
  fontSize: 13,
  color: theme.color.defaultText,
  background: "#e7f0ff",
  borderBottom: `1px solid ${theme.appBorderColor}`,
}));

const Scroll = styled.div({ flex: 1, minHeight: 0, overflow: "auto" });

const Footer = styled.div(({ theme }) => ({
  display: "grid",
  gap: 2,
  padding: "6px 16px 8px",
  fontSize: 12,
  lineHeight: "18px",
  color: theme.textMutedColor,
  borderTop: `1px solid ${theme.appBorderColor}`,
  background: theme.background.app,
  "& code": { fontFamily: theme.typography.fonts.mono, fontSize: 11, color: theme.color.defaultText },
}));

function PlaygroundPanel() {
  const api = useStorybookApi();
  const [, updateGlobals] = useGlobals();
  const [state, setState] = useAddonState<PanelState>(PLAYGROUND.panelId, initialState(api));
  const [status, setStatus] = React.useState<PlaygroundStatus | null>(null);
  const [copied, setCopied] = React.useState<"code" | "link" | null>(null);

  const toStory = (s: PanelState): PlaygroundState => ({ code: s.code, frame: s.frame, category: s.category });

  // A shared link's code is in the editor now: take it out of the address bar,
  // so it does not follow the reader to every other page.
  React.useEffect(() => {
    if (api.getQueryParam("code")) api.applyQueryParams({ code: null, frame: null, category: null }, { replace: true });
  }, [api]);

  const emit = useChannel(
    {
      [PLAYGROUND.ready]: () => {
        if (state.trusted) emit(PLAYGROUND.update, toStory(state));
      },
      [PLAYGROUND.status]: (next: PlaygroundStatus) => setStatus(next),
    },
    [state],
  );

  // Render after a pause in typing, and keep the code for the next visit.
  React.useEffect(() => {
    if (!state.trusted) return;
    const timer = window.setTimeout(() => emit(PLAYGROUND.update, toStory(state)), 250);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Not saved; the code still renders.
    }
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `emit` changes identity with `state`.
  }, [state]);

  const update = (patch: Partial<PanelState>) => setState({ ...state, ...patch });

  const chooseExample = (id: string) => {
    const example = EXAMPLES.find((e) => e.id === id);
    if (!example) return;
    updateGlobals({ theme: example.theme });
    setState({ code: example.code, frame: example.frame, category: example.category, example: example.id, trusted: true });
  };

  const flash = (what: "code" | "link") => {
    setCopied(what);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(state.code);
    flash("code");
  };

  const copyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("path", `/story/${PLAYGROUND.storyId}`);
    url.searchParams.set("code", encodeCode(state.code));
    url.searchParams.set("frame", state.frame);
    if (state.category) url.searchParams.set("category", state.category);
    else url.searchParams.delete("category");
    await navigator.clipboard.writeText(url.toString());
    flash("link");
  };

  const reset = () => chooseExample(state.example || first.id);

  const tone = !state.trusted || !status ? "waiting" : status.error ? "error" : "ok";
  const statusText = !state.trusted ? "Not run" : !status ? "Rendering…" : status.error ? status.error.split("\n")[0] : "Rendered";

  return (
    <Wrapper>
      <Bar>
        <Field>
          Example
          <Select
            key={`example:${state.example}`}
            ariaLabel="Example"
            tooltip="Start from an example"
            size="small"
            padding="small"
            options={EXAMPLES.map((e) => ({ value: e.id, title: e.title }))}
            defaultOptions={state.example ? [state.example] : []}
            onSelect={(id) => chooseExample(String(id))}
          >
            Your code
          </Select>
        </Field>
        <Field>
          Frame
          <Select
            key={`frame:${state.frame}`}
            ariaLabel="Frame"
            tooltip="What the code renders in"
            size="small"
            padding="small"
            options={FRAMES}
            defaultOptions={[state.frame]}
            onSelect={(frame) => update({ frame: frame as PlaygroundFrame })}
          >
            Frame
          </Select>
        </Field>
        <Field>
          Category
          <Select
            key={`category:${state.category ?? "none"}`}
            ariaLabel="Category"
            tooltip="The section's accent (data-category)"
            size="small"
            padding="small"
            options={CATEGORIES}
            defaultOptions={state.category ? [state.category] : []}
            onSelect={(category) => update({ category: category as PlaygroundCategory })}
            onReset={() => update({ category: undefined })}
            resetLabel="None"
          >
            None
          </Select>
        </Field>
        <Status tone={tone} role="status" title={status?.error}>
          {statusText}
        </Status>
        <Spacer />
        <Button variant="ghost" size="small" padding="small" onClick={copyCode} ariaLabel="Copy the code">
          {copied === "code" ? <CheckIcon /> : <CopyIcon />}
          {copied === "code" ? "Copied" : "Copy"}
        </Button>
        <Button variant="ghost" size="small" padding="small" onClick={copyLink} ariaLabel="Copy a link to this code">
          {copied === "link" ? <CheckIcon /> : <LinkIcon />}
          {copied === "link" ? "Link copied" : "Share"}
        </Button>
        <Separator />
        <Button variant="ghost" size="small" padding="small" onClick={reset} ariaLabel="Back to the example">
          <UndoIcon />
          Reset
        </Button>
      </Bar>
      {!state.trusted ? (
        <Notice>
          <span>This link brought code with it. Read it below, then run it.</span>
          <Button variant="solid" size="small" onClick={() => update({ trusted: true })} ariaLabel="Run the shared code">
            <PlayHollowIcon />
            Run
          </Button>
        </Notice>
      ) : null}
      <Scroll>
        <CodeEditor code={state.code} onChange={(code) => update({ code })} ariaLabel="Playground code" />
      </Scroll>
      <Footer>
        <span>
          Write one element, a function that returns one, or call <code>render(…)</code>. React and every part of the kit are in
          scope; import lines are ignored.
        </span>
        <span>
          Sample data: <code>{SAMPLE_DATA.join(" · ")}</code>
        </span>
      </Footer>
    </Wrapper>
  );
}

/**
 * Marks a panel the Playground opened. Storybook keeps the panel's state
 * across reloads, so without the mark a reload on another story would find the
 * panel the Playground left open.
 */
const OPENED_KEY = "kit-playground-opened-panel";
const openedMark = {
  get: () => {
    try {
      return window.localStorage.getItem(OPENED_KEY) === "1";
    } catch {
      return false;
    }
  },
  set: (on: boolean) => {
    try {
      if (on) window.localStorage.setItem(OPENED_KEY, "1");
      else window.localStorage.removeItem(OPENED_KEY);
    } catch {
      // Storage can be unavailable; the panel then stays as Storybook left it.
    }
  },
};

/**
 * Registers the panel (only on stories with `parameters.playground`), and
 * opens it when the Playground is selected; leaving the Playground, or
 * reloading on another story, puts the panel back as it was.
 */
export function registerPlayground() {
  addons.register("kit/playground", (api) => {
    addons.add(PLAYGROUND.panelId, {
      type: types.PANEL,
      title: "Playground",
      disabled: (parameters) => !(parameters as { playground?: boolean } | undefined)?.playground,
      render: ({ active }) => (active ? <PlaygroundPanel /> : null),
    });

    let restore: boolean | undefined;
    api.on(CURRENT_STORY_WAS_SET, ({ storyId }: { storyId?: string }) => {
      if (storyId === PLAYGROUND.storyId) {
        if (restore === undefined) {
          restore = openedMark.get() ? false : api.getIsPanelShown();
          if (!restore) openedMark.set(true);
        }
        api.setSelectedPanel(PLAYGROUND.panelId);
        api.togglePanel(true);
      } else if (restore !== undefined || openedMark.get()) {
        api.togglePanel(restore ?? false);
        restore = undefined;
        openedMark.set(false);
      }
    });
  });
}
