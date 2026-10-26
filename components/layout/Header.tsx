import Link from "next/link";
import { profile } from "@/content/profile";
import { sections } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Menu } from "@/components/ui/Icons";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

// The mobile menu is a <details> element so it works without JavaScript.
export function Header() {
  return (
    <header
      data-site-header
      className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md print:hidden"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex w-full max-w-7xl items-center gap-6 px-4 py-3 md:px-8 xl:px-20 [[data-scrolled]_&]:py-1.5"
      >
        <Link
          href="/"
          className="mr-auto inline-flex min-h-11 items-center caption font-medium text-fg"
        >
          {profile.shortName}
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`/#${s.id}`}
                data-nav-link={s.id}
                className="inline-flex min-h-11 items-center border-b border-transparent caption text-muted hover:text-fg aria-[current=true]:border-accent aria-[current=true]:text-fg"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ButtonLink
            href="/resume"
            variant="secondary"
            className="hidden sm:inline-flex"
          >
            Resume
          </ButtonLink>
          <details className="group relative lg:hidden">
            <summary
              aria-label="Menu"
              className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-line-strong text-fg hover:border-fg [&::-webkit-details-marker]:hidden"
            >
              <Menu width={18} height={18} />
            </summary>
            <ul className="absolute top-full right-0 mt-2 flex w-56 flex-col rounded-lg border border-line bg-surface p-2 shadow-2xl shadow-black/30">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`/#${s.id}`}
                    className="flex min-h-11 items-center rounded-md px-3 caption text-fg hover:bg-surface-2"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/resume"
                  className="flex min-h-11 items-center rounded-md px-3 caption text-fg hover:bg-surface-2"
                >
                  Resume
                </Link>
              </li>
            </ul>
          </details>
        </div>
      </nav>
    </header>
  );
}
