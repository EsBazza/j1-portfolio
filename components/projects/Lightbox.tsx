"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ProjectImage } from "@/content/schema";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";

/**
 * Full-screen photo viewer on a native <dialog> (focus trap, Esc and inert
 * page for free). Opens from any `a[data-lightbox-index]` inside `rootId`;
 * arrow keys and swipes move between photos.
 */
export function Lightbox({
  rootId,
  photos,
}: {
  rootId: string;
  photos: ProjectImage[];
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const swipeStart = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const step = useCallback(
    (delta: number) =>
      setIndex((i) => (i + delta + photos.length) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    const root = document.getElementById(rootId);
    const dialog = dialogRef.current;
    if (!root || !dialog) return;

    const onClick = (event: MouseEvent) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.button !== 0
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        "a[data-lightbox-index]",
      );
      if (!link || !root.contains(link)) return;
      event.preventDefault();
      setIndex(Number(link.dataset.lightboxIndex) || 0);
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };

    root.addEventListener("click", onClick);
    dialog.addEventListener("close", onClose);
    return () => {
      root.removeEventListener("click", onClick);
      dialog.removeEventListener("close", onClose);
      onClose();
    };
  }, [rootId]);

  const photo = photos[index];
  if (!photo) return null;
  const many = photos.length > 1;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      data-lenis-prevent
      className="lightbox fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none bg-bg/95 p-0 text-fg backdrop-blur-md backdrop:bg-transparent"
      onClick={(event) => {
        // Clicking the empty area around the photo closes the viewer.
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (!many) return;
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
      onPointerDown={(event) => {
        swipeStart.current = event.clientX;
      }}
      onPointerUp={(event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (!many || start === null || event.pointerType === "mouse") return;
        const dx = event.clientX - start;
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
      }}
    >
      <div className="pointer-events-none grid h-full grid-rows-[auto_1fr_auto] gap-4 p-4 md:p-8">
        <div className="pointer-events-auto flex items-center justify-between">
          <p className="caption text-faint" aria-live="polite">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(photos.length).padStart(2, "0")}
          </p>
          <button
            type="button"
            autoFocus
            onClick={() => dialogRef.current?.close()}
            className="grid size-11 place-items-center rounded-full border border-line-strong bg-surface hover:border-fg"
          >
            <Close />
            <span className="sr-only">Close photo viewer</span>
          </button>
        </div>

        <div className="relative grid min-h-0 place-items-center">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="100vw"
            className="lightbox-photo pointer-events-auto h-auto max-h-full w-auto max-w-full rounded-lg object-contain"
          />
        </div>

        <div className="pointer-events-auto flex items-center gap-4">
          {many ? (
            <NavButton label="Previous photo" onClick={() => step(-1)}>
              <ArrowLeft />
            </NavButton>
          ) : null}
          <p className="mx-auto max-w-[70ch] text-center text-sm text-muted md:text-base">
            {photo.alt}
          </p>
          {many ? (
            <NavButton label="Next photo" onClick={() => step(1)}>
              <ArrowRight />
            </NavButton>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

function NavButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong bg-surface hover:border-fg"
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}
