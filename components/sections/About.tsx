import Image from "next/image";
import { certifications } from "@/content/certifications";
import { experience } from "@/content/experience";
import { photos } from "@/content/photos";
import { profile } from "@/content/profile";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Section, SectionHeading } from "@/components/ui/Section";

export function About() {
  const { education } = profile;

  return (
    <Section id="about" aria-labelledby="about-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 self-start lg:sticky lg:top-24 lg:col-span-6">
          <div className="w-48 overflow-hidden rounded-lg border border-line bg-surface-2 pt-4 sm:w-72">
            <Image
              src={photos.portrait.src}
              alt={photos.portrait.alt}
              width={photos.portrait.width}
              height={photos.portrait.height}
              sizes="(min-width: 640px) 288px, 192px"
              className="h-auto w-full"
            />
          </div>
          <SectionHeading id="about-title" eyebrow="About">
            Student, builder, hackathon regular
          </SectionHeading>
          {profile.about.map((paragraph) => (
            <p key={paragraph} className="max-w-[62ch] text-lg text-muted">
              {paragraph}
            </p>
          ))}
          <p className="caption text-faint">
            {profile.location} · Speaks {profile.languages.join(", ")}
          </p>
        </div>

        <dl
          data-reveal
          className="grid gap-px self-start overflow-hidden rounded-lg border border-line bg-line lg:col-span-6"
        >
          <div className="flex flex-col gap-1.5 bg-surface p-6">
            <dt className="caption text-faint">Education</dt>
            <dd className="font-display text-xl font-semibold">
              {education.school}
            </dd>
            <dd className="text-muted">
              {education.degree} · {education.years} · {education.location}
            </dd>
          </div>
          <div className="flex flex-col gap-1.5 bg-surface p-6">
            <dt className="caption text-faint">Honors</dt>
            {profile.honors.map((h) => (
              <dd key={h.title}>
                <span className="font-semibold text-accent">{h.title}</span>
                <span className="text-muted"> · {h.terms}</span>
              </dd>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 bg-surface p-6">
            <dt className="caption text-faint">Capstone</dt>
            <dd className="text-muted">{education.capstone}</dd>
          </div>
          {experience.map((job) => (
            <div
              key={job.role}
              className="flex flex-col gap-1.5 bg-surface p-6"
            >
              <dt className="caption text-faint">Experience</dt>
              <dd className="font-semibold">
                {job.role} · {job.org}
                <span className="font-normal text-muted">
                  {" "}
                  · {job.duration}
                </span>
              </dd>
              {job.points.map((point) => (
                <dd key={point} className="text-[0.9375rem] text-muted">
                  {point}
                </dd>
              ))}
            </div>
          ))}
          <div className="flex flex-col gap-1.5 bg-surface p-6">
            <dt className="caption text-faint">Certifications</dt>
            {certifications.map((cert) => (
              <dd
                key={`${cert.issuer}-${cert.title}`}
                className="text-[0.9375rem] text-muted"
              >
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
                  >
                    {cert.title}
                    <ArrowUpRight className="shrink-0" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="text-fg">{cert.title}</span>
                )}
                <span className="text-faint"> · {cert.issuer}</span>
              </dd>
            ))}
          </div>
        </dl>
      </div>
    </Section>
  );
}
