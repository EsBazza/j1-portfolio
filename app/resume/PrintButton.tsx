"use client";

/** Hidden until JS runs, since printing from a button needs it. */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="hidden min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-medium hover:border-fg [.js_&]:inline-flex"
    >
      Print or save as PDF
    </button>
  );
}
