import { profile } from "@/content/profile";
import { builtWith } from "@/lib/site";
import { Container } from "@/components/ui/Container";
import { GitHub, LinkedIn, Mail } from "@/components/ui/Icons";

const lastUpdated = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(new Date(process.env.BUILD_DATE ?? 0));

export function Footer() {
  const socials = [
    { ...profile.links.github, Icon: GitHub },
    { ...profile.links.linkedin, Icon: LinkedIn },
    { label: "Email", href: `mailto:${profile.email}`, Icon: Mail },
  ];

  return (
    <footer className="overflow-hidden border-t border-line print:hidden">
      {/* Giant wordmark; the motion layer reveals it letter by letter. */}
      <Container aria-hidden="true" className="pt-12">
        <p
          data-split-chars
          className="font-display text-[clamp(5rem,24vw,22rem)] leading-[0.8] font-bold tracking-[-0.06em] text-line-strong select-none"
        >
          {profile.brand}
        </p>
      </Container>
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-3">
          <p className="font-display text-2xl font-bold">{profile.name}</p>
          <p className="caption text-faint">
            Built with {builtWith.join(" · ")}
          </p>
          <p className="caption text-faint">Last updated {lastUpdated}</p>
        </div>
        <ul className="flex gap-2">
          {socials.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex size-11 items-center justify-center rounded-full border border-line-strong text-fg hover:border-fg"
              >
                <Icon width={18} height={18} />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
