import { certifications } from "@/content/certifications";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ArrowUpRight } from "@/components/ui/Icons";

export function Certifications() {
  const issuers = [...new Set(certifications.map((c) => c.issuer))];

  return (
    <Section
      id="certifications"
      aria-labelledby="certifications-title"
      className="border-t border-line"
    >
      <div className="flex flex-col gap-12">
        <SectionHeading id="certifications-title" eyebrow="Certifications">
          {issuers.slice(0, -1).join(", ")} and {issuers.at(-1)}.
        </SectionHeading>
        <ul
          data-reveal-group
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certifications.map((cert) => (
            <li
              key={`${cert.issuer}-${cert.title}`}
              className="relative flex flex-col gap-2 rounded-lg border border-line bg-surface p-5"
            >
              <p className="caption text-faint">
                {cert.issuer}
                {cert.year ? ` · ${cert.year}` : ""}
              </p>
              <h3 className="font-semibold">
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 after:absolute after:inset-0 hover:underline"
                  >
                    {cert.title}
                    <ArrowUpRight className="mt-1 shrink-0" />
                  </a>
                ) : (
                  cert.title
                )}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
