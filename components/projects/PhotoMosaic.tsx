import Image from "next/image";
import type { ProjectImage } from "@/content/schema";
import { Expand } from "@/components/ui/Icons";
import { Lightbox } from "@/components/projects/Lightbox";
import { cn } from "@/lib/utils";

/**
 * Event photos as an editorial mosaic: the first photo large with its
 * caption, the rest in uncropped masonry columns. Each photo links to the
 * full image, so it works without JavaScript; with it, the Lightbox opens.
 */
export function PhotoMosaic({
  id,
  photos,
}: {
  id: string;
  photos: ProjectImage[];
}) {
  const [lead, ...rest] = photos;
  if (!lead) return null;

  return (
    <div id={id} className="flex flex-col gap-6 md:gap-8">
      <figure className="grid items-end gap-4 lg:grid-cols-3 lg:gap-8">
        <a
          href={lead.src}
          data-lightbox-index={0}
          className="group relative block w-fit overflow-hidden rounded-lg border border-line lg:col-span-2"
        >
          <Image
            src={lead.src}
            alt={lead.alt}
            width={lead.width}
            height={lead.height}
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="h-auto max-h-[36rem] w-auto max-w-full transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
          />
          <ExpandHint />
        </a>
        <figcaption className="flex flex-col gap-3 text-muted lg:pb-2">
          <span aria-hidden="true" className="caption text-faint">
            01 / {String(photos.length).padStart(2, "0")}
          </span>
          {lead.alt}
        </figcaption>
      </figure>

      {rest.length > 0 ? (
        <ul
          data-reveal-group
          className={cn(
            "columns-2 gap-4 md:gap-6 [&>li]:mb-4 md:[&>li]:mb-6",
            // Three columns only when there are enough photos to fill them.
            rest.length >= 6 && "md:columns-3",
          )}
        >
          {rest.map((photo, i) => (
            <li key={photo.src} className="break-inside-avoid">
              <a
                href={photo.src}
                data-lightbox-index={i + 1}
                className="group relative block overflow-hidden rounded-lg border border-line"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes={
                    rest.length >= 6 ? "(min-width: 768px) 33vw, 50vw" : "50vw"
                  }
                  className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <ExpandHint />
              </a>
            </li>
          ))}
        </ul>
      ) : null}

      <Lightbox rootId={id} photos={photos} />
    </div>
  );
}

function ExpandHint() {
  return (
    <span
      aria-hidden="true"
      className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-bg/80 text-fg opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
    >
      <Expand />
    </span>
  );
}
