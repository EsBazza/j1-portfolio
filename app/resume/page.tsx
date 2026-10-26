import { existsSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { certifications } from "@/content/certifications";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { Container } from "@/components/ui/Container";
import { Download } from "@/components/ui/Icons";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}, ${profile.role}.`,
  alternates: { canonical: "/resume" },
};

// Juno's own resume PDFs; a button appears for each file that exists.
const pdfs = [
  { label: "Classic PDF", file: "Amaro_Alonzo_Resume_Classic.pdf" },
  { label: "Modern PDF", file: "Amaro_Alonzo_Resume_Modern.pdf" },
].filter(({ file }) =>
  existsSync(path.join(process.cwd(), "public", "resume", file)),
);

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="grid gap-4 border-t border-line py-8 md:grid-cols-[12rem_1fr] md:gap-8 print:break-inside-avoid print:py-4">
      <h2 className="pt-1 caption text-faint">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

export default function ResumePage() {
  return (
    <Container className="max-w-5xl py-16 md:py-24 print:py-0">
      <header className="flex flex-col gap-6 pb-10 print:pb-4">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-display font-bold">
            {profile.name}
          </h1>
          <p className="font-display text-xl font-semibold">{profile.role}</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 caption text-muted">
          <li>{profile.location}</li>
          <li>
            <a href={`mailto:${profile.email}`} className="hover:text-fg">
              {profile.email}
            </a>
          </li>
          <li>
            <a href={profile.links.linkedin.href} className="hover:text-fg">
              {profile.links.linkedin.href.replace("https://www.", "")}
            </a>
          </li>
          <li>
            <a href={profile.links.github.href} className="hover:text-fg">
              {profile.links.github.href.replace("https://", "")}
            </a>
          </li>
        </ul>
        <div className="flex flex-wrap gap-3 print:hidden">
          {pdfs.map(({ label, file }) => (
            <a
              key={file}
              href={`/resume/${file}`}
              download
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 font-medium hover:border-fg"
            >
              <Download /> {label}
            </a>
          ))}
          <PrintButton />
        </div>
      </header>

      <ResumeSection title="Summary">
        {profile.about.map((p) => (
          <p key={p} className="text-muted">
            {p}
          </p>
        ))}
        <p className="text-muted">Seeking {profile.seeking.toLowerCase()}.</p>
      </ResumeSection>

      <ResumeSection title="Technical skills">
        <dl className="grid gap-3">
          {skills.map((group) => (
            <div
              key={group.name}
              className="grid gap-1 sm:grid-cols-[9rem_1fr]"
            >
              <dt className="font-semibold">{group.name}</dt>
              <dd className="text-muted">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </ResumeSection>

      <ResumeSection title="Projects & hackathons">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="flex flex-col gap-1 print:break-inside-avoid"
          >
            <h3 className="font-semibold">
              <a href={`/projects/${p.slug}`} className="hover:underline">
                {p.title}
              </a>
              <span className="font-normal text-muted"> — {p.tagline}</span>
            </h3>
            {p.awards.length > 0 ? (
              <p className="text-sm text-accent">
                {p.awards.map((a) => `${a.title}, ${a.event}`).join(" · ")}
              </p>
            ) : null}
            {p.context ? (
              <p className="text-sm text-muted">{p.context}</p>
            ) : null}
            <p className="text-sm text-muted">{p.summary}</p>
            {p.stack.length > 0 ? (
              <p className="caption text-faint">{p.stack.join(" · ")}</p>
            ) : null}
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Experience">
        {experience.map((job) => (
          <div key={job.role} className="flex flex-col gap-1">
            <h3 className="font-semibold">
              {job.role} · {job.org}
              <span className="font-normal text-muted"> · {job.duration}</span>
            </h3>
            <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted">
              {job.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
      </ResumeSection>

      <ResumeSection title="Education">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">
            {profile.education.school}
            <span className="font-normal text-muted">
              {" "}
              · {profile.education.location}
            </span>
          </h3>
          <p className="text-muted">
            {profile.education.degree} · {profile.education.years}
          </p>
          {profile.honors.map((h) => (
            <p key={h.title} className="text-sm text-muted">
              {h.title}: {h.terms}
            </p>
          ))}
          <p className="text-sm text-muted">
            Capstone: {profile.education.capstone}
          </p>
        </div>
      </ResumeSection>

      <ResumeSection title="Certifications & languages">
        <ul className="flex flex-col gap-1 text-muted">
          {certifications.map((c) => (
            <li key={`${c.issuer}-${c.title}`}>
              <span className="text-fg">{c.issuer}:</span> {c.title}
              {c.year ? ` (${c.year})` : ""}
            </li>
          ))}
        </ul>
        <p className="text-muted">
          <span className="text-fg">Languages:</span>{" "}
          {profile.languages.join(", ")}
        </p>
      </ResumeSection>
    </Container>
  );
}
