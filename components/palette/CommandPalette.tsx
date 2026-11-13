"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PaletteItem } from "@/lib/palette";
import { currentTheme, setTheme } from "@/lib/theme";
import { petCommand } from "@/components/pets/PetLayer";
import { cn } from "@/lib/utils";

/** Fired by the header button (and anything else) to open the palette. */
export const OPEN_PALETTE_EVENT = "palette:open";

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

function matches(item: PaletteItem, words: string[]) {
  const text =
    `${item.label} ${item.hint ?? ""} ${item.keywords ?? ""}`.toLowerCase();
  return words.every((w) => text.includes(w));
}

/**
 * Ctrl/⌘+K (or "/") command palette: jump to any project or section, copy
 * the email, download the resume, switch theme. A native <dialog> gives the
 * focus trap and Esc; the list follows the ARIA combobox pattern.
 */
export function CommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("");

  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return words.length ? items.filter((i) => matches(i, words)) : items;
  }, [items, query]);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setQuery("");
    setActive(0);
    setStatus("");
    dialog.showModal();
    document.documentElement.style.overflow = "hidden";
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const combo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const slash = e.key === "/" && !isTyping(e.target);
      if (!combo && !slash) return;
      e.preventDefault();
      if (dialogRef.current?.open) close();
      else open();
    };
    const dialog = dialogRef.current;
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    dialog?.addEventListener("close", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
      dialog?.removeEventListener("close", onClose);
    };
  }, [open, close]);

  function run(item: PaletteItem) {
    const { action } = item;
    switch (action.type) {
      case "go":
        close();
        router.push(action.href);
        return;
      case "open":
        close();
        window.open(action.href, "_blank", "noopener,noreferrer");
        return;
      case "download": {
        const link = document.createElement("a");
        link.href = action.href;
        link.download = "";
        link.click();
        close();
        return;
      }
      case "copy":
        navigator.clipboard
          .writeText(action.text)
          .then(() => setStatus(action.done))
          .catch(() => setStatus(action.text));
        return;
      case "theme":
        setTheme(currentTheme() === "dark" ? "light" : "dark");
        close();
        return;
      case "pet":
        close();
        petCommand(action.command);
        return;
    }
  }

  const current = results[Math.min(active, results.length - 1)];
  const optionId = (item: PaletteItem) => `${listId}-${item.id}`;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      data-lenis-prevent
      className="palette fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-transparent p-4 text-fg backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="palette-panel mx-auto mt-[12vh] flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-line-strong bg-surface shadow-2xl shadow-black/40">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <span aria-hidden="true" className="font-mono text-faint">
            ›
          </span>
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={current ? optionId(current) : undefined}
            aria-label="Search projects and actions"
            placeholder="Search projects, pages, actions…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
              setStatus("");
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                const step = e.key === "ArrowDown" ? 1 : -1;
                setActive((i) =>
                  results.length
                    ? (i + step + results.length) % results.length
                    : 0,
                );
              } else if (e.key === "Enter" && current) {
                e.preventDefault();
                run(current);
              }
            }}
            className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-faint"
          />
          <kbd className="caption text-faint">Esc</kbd>
        </div>

        <ul
          id={listId}
          role="listbox"
          aria-label="Results"
          className="overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <li
              role="presentation"
              className="px-3 py-6 text-center text-muted"
            >
              Nothing matches “{query}”.
            </li>
          ) : null}
          {results.map((item, i) => {
            const groupStart = i === 0 || results[i - 1]?.group !== item.group;
            const selected = item === current;
            return (
              <li key={item.id} role="presentation">
                {groupStart ? (
                  <p
                    role="presentation"
                    className="px-3 pt-3 pb-1.5 caption text-faint"
                  >
                    {item.group}
                  </p>
                ) : null}
                <div
                  id={optionId(item)}
                  role="option"
                  aria-selected={selected}
                  onPointerMove={() => setActive(i)}
                  onClick={() => run(item)}
                  className={cn(
                    "flex min-h-11 cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2",
                    selected && "bg-surface-2",
                  )}
                >
                  <span className="min-w-0 truncate">{item.label}</span>
                  {item.hint ? (
                    <span className="max-w-[50%] shrink-0 truncate caption text-faint">
                      {item.hint}
                    </span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <p
          aria-live="polite"
          className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 caption text-faint"
        >
          <span>{status || "↑↓ to move · Enter to open"}</span>
          <span>
            <kbd>Ctrl</kbd>/<kbd>⌘</kbd> <kbd>K</kbd>
          </span>
        </p>
      </div>
    </dialog>
  );
}
