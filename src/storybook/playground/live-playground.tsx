import { type ComponentType, useContext, useEffect, useState } from "react";
import { LiveContext, LiveProvider } from "react-live";
import { addons } from "storybook/preview-api";

import { KitFrame } from "@/kit/testing/stories";

import { scope } from "./scope";
import { EXAMPLES, PLAYGROUND, type PlaygroundState, type PlaygroundStatus } from "./shared";

const first = EXAMPLES[0]!;
const DEFAULT_STATE: PlaygroundState = { code: first.code, frame: first.frame, category: first.category };

/**
 * Pasted story or page code works as is: its import lines are dropped
 * (everything is already in scope) and `export default` is ignored.
 */
function stripModuleSyntax(code: string): string {
  return code
    .replace(/^\s*import\s[\s\S]*?\sfrom\s+["'][^"']+["'];?[ \t]*$/gm, "")
    .replace(/^\s*import\s+["'][^"']+["'];?[ \t]*$/gm, "")
    .replace(/^\s*export\s+default\s+/gm, "")
    .trim();
}

/** `render(<Page />)` anywhere in the code switches to react-live's no-inline mode. */
const usesRender = (code: string) => /(^|[^.\w])render\s*\(/.test(code);

function Render({ onStatus }: { onStatus: (status: PlaygroundStatus) => void }) {
  const { element, error } = useContext(LiveContext);
  // While the code does not compile (mid-edit), keep showing the last render.
  // (State adjusted during render, React's pattern for keeping a previous value.)
  // Both setters take a function: `element` is a component, which useState would call.
  const [last, setLast] = useState<ComponentType | null | undefined>(() => element);
  if (element && element !== last) setLast(() => element);
  const Shown = element ?? last;

  useEffect(() => onStatus({ error }), [error, onStatus]);

  return (
    <>
      {error ? (
        <pre
          role="alert"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            margin: 0,
            padding: "10px 16px",
            background: "#fcebe9",
            borderBottom: "1px solid #f0c7c1",
            color: "#9b2c2c",
            font: '12px/1.5 "JetBrains Mono Variable", ui-monospace, monospace',
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </pre>
      ) : null}
      {Shown ? <Shown /> : null}
    </>
  );
}

/**
 * The Playground's canvas: renders the code from the Playground panel with
 * every kit part and the sample data in scope, in the frame the panel picks
 * and the theme from the toolbar. Without the panel (a test, a direct iframe
 * link) it renders the first example.
 */
export function LivePlayground() {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE);

  useEffect(() => {
    const channel = addons.getChannel();
    const onUpdate = (next: PlaygroundState) => setState(next);
    channel.on(PLAYGROUND.update, onUpdate);
    channel.emit(PLAYGROUND.ready);
    return () => channel.off(PLAYGROUND.update, onUpdate);
  }, []);

  const [onStatus] = useState(() => (status: PlaygroundStatus) => addons.getChannel().emit(PLAYGROUND.status, status));

  return (
    <LiveProvider code={state.code} scope={scope} noInline={usesRender(state.code)} transformCode={stripModuleSyntax}>
      <KitFrame frame={state.frame} category={state.category}>
        <Render onStatus={onStatus} />
      </KitFrame>
    </LiveProvider>
  );
}
