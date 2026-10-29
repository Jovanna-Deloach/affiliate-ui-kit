"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "copied" | "error";

/**
 * Clipboard status machine (source physics: ddoemonn/copy-button, sanitized).
 * navigator.clipboard with an execCommand fallback; status auto-resets after
 * `timeout`. The only timer is the reset — no animation controller.
 */
export function useCopyToClipboard({
  timeout = 2000,
  onCopy,
  onError,
}: {
  timeout?: number;
  onCopy?: (value: string) => void;
  onError?: (reason: unknown) => void;
} = {}) {
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [tick, setTick] = useState(0);
  const mounted = useRef(true);
  const onCopyRef = useRef(onCopy);
  const onErrorRef = useRef(onError);

  // Latest-callback refs are written in an effect (never during render).
  useEffect(() => {
    onCopyRef.current = onCopy;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const copy = useCallback(async (value: string) => {
    if (!value) return false;
    let ok = false;
    let reason: unknown = null;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        ok = true;
      } else {
        ok = fallbackCopy(value);
      }
    } catch (err) {
      reason = err;
      try {
        ok = fallbackCopy(value);
      } catch {
        ok = false;
      }
    }
    if (!mounted.current) return ok;
    setStatus(ok ? "copied" : "error");
    setTick((t) => t + 1);
    if (ok) onCopyRef.current?.(value);
    else onErrorRef.current?.(reason);
    return ok;
  }, []);

  useEffect(() => {
    if (tick === 0 || status === "idle") return;
    const id = setTimeout(() => setStatus("idle"), timeout);
    return () => clearTimeout(id);
  }, [tick, status, timeout]);

  return { copy, status, copied: status === "copied" };
}

function fallbackCopy(text: string): boolean {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}
