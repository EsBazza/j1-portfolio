import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { Section, SectionHeading } from "@/components/ui/Section";

export function About() {
  const { education } = profile;

  return (
    <Section id="about" aria-labelledby="about-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-6">
          <SectionHeading id="about-title" eyebrow="About">
            Student, builder, hackathon regular.
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
        </dl>
      </div>
    </Section>
  );
}
