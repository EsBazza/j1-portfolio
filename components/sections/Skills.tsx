import { skills } from "@/content/skills";
import { Section, SectionHeading } from "@/components/ui/Section";

export function Skills() {
  return (
    <Section
      id="skills"
      aria-labelledby="skills-title"
      className="border-y border-line"
    >
      <div className="flex flex-col gap-12">
        <SectionHeading id="skills-title" eyebrow="Skills">
          What I build with.
        </SectionHeading>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <div key={group.name} className="flex flex-col gap-4">
              <h3 className="border-b border-line pb-3 caption text-faint">
                {group.name}
              </h3>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item} translate="no" className="text-fg">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
