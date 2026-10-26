import { hackathons } from "@/content/awards";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import { About } from "@/components/sections/About";
import { AwardStrip } from "@/components/sections/AwardStrip";
import { Certifications } from "@/components/sections/Certifications";
import { Contact } from "@/components/sections/Contact";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { MoreProjects } from "@/components/sections/MoreProjects";
import { Skills } from "@/components/sections/Skills";
import { StackMarquee } from "@/components/sections/StackMarquee";
import { Timeline } from "@/components/sections/Timeline";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: siteUrl,
  email: `mailto:${profile.email}`,
  sameAs: [profile.links.github.href, profile.links.linkedin.href],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: profile.education.school,
  },
  knowsLanguage: profile.languages,
  award: hackathons
    .filter((h) => h.rank)
    .map((h) => `${h.result} — ${h.event}`),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <AwardStrip />
      <StackMarquee />
      <FeaturedProjects />
      <MoreProjects />
      <Timeline />
      <Skills />
      <About />
      <Certifications />
      <Contact />
    </>
  );
}
