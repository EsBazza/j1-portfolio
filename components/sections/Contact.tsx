import Link from "next/link";
import { profile } from "@/content/profile";
import { Section, SectionHeading } from "@/components/ui/Section";
import {
  ArrowRight,
  ArrowUpRight,
  GitHub,
  LinkedIn,
  Mail,
} from "@/components/ui/Icons";
import { ContactForm } from "./ContactForm";

export function Contact() {
  const links = [
    {
      label: profile.email,
      href: `mailto:${profile.email}`,
      Icon: Mail,
      external: false,
    },
    { ...profile.links.linkedin, Icon: LinkedIn, external: true },
    { ...profile.links.github, Icon: GitHub, external: true },
  ];

  return (
    <Section
      id="contact"
      aria-labelledby="contact-title"
      grid
      className="border-t border-line"
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <SectionHeading id="contact-title" eyebrow="Contact">
            Let&apos;s talk.
          </SectionHeading>
          <p className="max-w-[46ch] text-lg text-muted">
            Open to {profile.seeking.toLowerCase()}. Send a message, or reach me
            directly.
          </p>
          <ul className="flex flex-col gap-1">
            {links.map(({ label, href, Icon, external }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex min-h-11 items-center gap-3 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
                >
                  <Icon width={18} height={18} className="text-muted" />
                  <span translate={external ? "no" : undefined}>{label}</span>
                  {external ? <ArrowUpRight className="text-faint" /> : null}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/resume"
                className="inline-flex min-h-11 items-center gap-3 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
              >
                <ArrowRight width={18} height={18} className="text-muted" />
                Resume
              </Link>
            </li>
          </ul>
        </div>
        <div
          data-reveal
          className="rounded-lg border border-line bg-surface p-6 sm:p-8 lg:col-span-7"
        >
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
