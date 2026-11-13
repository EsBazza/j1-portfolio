"use client";

import { useSyncExternalStore } from "react";
import { OPEN_PALETTE_EVENT } from "./CommandPalette";

const noop = () => () => {};
const isMac = () => /Mac|iPhone|iPad/.test(navigator.platform);

/** Header button that opens the command palette. Hidden without JavaScript. */
export function PaletteButton() {
  const mac = useSyncExternalStore(noop, isMac, () => false);
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-keyshortcuts="Control+K Meta+K"
      className="hidden h-11 items-center gap-2 rounded-full border border-line-strong px-3.5 text-fg hover:border-fg [.js_&]:inline-flex"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path d="m20 20-4.2-4.2" />
      </svg>
      <span className="sr-only">Search projects and actions</span>
      <kbd aria-hidden="true" className="caption text-faint max-md:hidden">
        {mac ? "⌘K" : "Ctrl K"}
      </kbd>
    </button>
  );
}
