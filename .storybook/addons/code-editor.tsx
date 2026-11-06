import { Highlight, type PrismTheme } from "prism-react-renderer";
import React from "react";
import { styled } from "storybook/theming";
import { useEditable } from "use-editable";

/**
 * A small code editor for the Playground panel: a highlighted, editable
 * <pre> (use-editable keeps the caret through re-highlighting; Tab indents)
 * beside a line-number gutter. The same pieces react-live's own editor uses,
 * so nothing here pulls a React 19 runtime into the manager (React 18).
 */

const ink = "#181614";

/** The kit's palette as syntax colours: oxblood components, brass props, green strings. */
export const kitCodeTheme: PrismTheme = {
  plain: { color: ink, backgroundColor: "transparent" },
  styles: [
    { types: ["comment", "prolog", "doctype", "cdata"], style: { color: "#8a8178", fontStyle: "italic" } },
    { types: ["punctuation", "operator"], style: { color: "#6a6157" } },
    { types: ["tag", "class-name", "maybe-class-name"], style: { color: "#5e1914" } },
    { types: ["attr-name", "property"], style: { color: "#8c6d46" } },
    { types: ["string", "attr-value", "char", "template-string"], style: { color: "#2f6b45" } },
    { types: ["number", "boolean", "constant"], style: { color: "#9a5b00" } },
    { types: ["keyword", "selector"], style: { color: "#1b4d3e" } },
    { types: ["function"], style: { color: "#47120e" } },
  ],
};

const Frame = styled.div({
  display: "flex",
  alignItems: "flex-start",
  minHeight: "100%",
  fontSize: 13,
  lineHeight: "20px",
});

const Gutter = styled.div(({ theme }) => ({
  flex: "none",
  padding: "12px 12px 12px 16px",
  minWidth: "3.5em",
  textAlign: "right",
  color: theme.textMutedColor,
  opacity: 0.55,
  fontFamily: theme.typography.fonts.mono,
  userSelect: "none",
  "& span": { display: "block" },
}));

const Pre = styled.pre(({ theme }) => ({
  flex: 1,
  margin: 0,
  padding: "12px 16px 24px 0",
  minHeight: "100%",
  outline: "none",
  whiteSpace: "pre",
  fontFamily: theme.typography.fonts.mono,
  fontSize: "inherit",
  lineHeight: "inherit",
  tabSize: 2,
  caretColor: theme.color.secondary,
  "&:focus-visible": { boxShadow: "none" },
}));

export function CodeEditor({ code, onChange, ariaLabel }: { code: string; onChange: (code: string) => void; ariaLabel: string }) {
  const ref = React.useRef<HTMLPreElement>(null);
  // The editor keeps its own text while typing, and takes the prop's when the
  // panel replaces the code (an example, Reset).
  const [text, setText] = React.useState(code);
  const [given, setGiven] = React.useState(code);
  if (code !== given) {
    setGiven(code);
    setText(code);
  }

  useEditable(
    ref,
    (next) => {
      const value = next.slice(0, -1);
      setText(value);
      onChange(value);
    },
    { indentation: 2 },
  );

  const lines = text.split("\n").length;
  return (
    <Frame>
      <Gutter aria-hidden="true">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </Gutter>
      <Highlight code={text} language="tsx" theme={kitCodeTheme}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Pre ref={ref} className={className} style={style} spellCheck={false} role="textbox" aria-multiline="true" aria-label={ariaLabel}>
            {tokens.map((line, i) => (
              <span key={i} {...getLineProps({ line })}>
                {line
                  .filter((token) => !token.empty)
                  .map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                {"\n"}
              </span>
            ))}
          </Pre>
        )}
      </Highlight>
    </Frame>
  );
}
