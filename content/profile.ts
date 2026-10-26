import { profileSchema } from "./schema";

// Source: the resume (Amaro_Alonzo_Resume_Classic.pdf). The phone number is
// left out on purpose until Juno decides whether it belongs on the site.
export const profile = profileSchema.parse({
  name: "Amaro Juno D. Alonzo",
  shortName: "Juno Alonzo",
  role: "Full-Stack & AI Developer",
  pitch:
    "I build and ship full-stack web apps with Next.js, TypeScript, PostgreSQL and the Gemini API.",
  location: "Candaba, Pampanga, Philippines",
  email: "alonzoamarojuno@gmail.com",
  links: {
    github: { label: "GitHub", href: "https://github.com/EsBazza" },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/amaro-juno-alonzo-b7b867330",
    },
  },
  about: [
    "I'm a BSIT student at the University of the Assumption and a President's Lister. I build and ship full-stack web apps with Next.js, TypeScript, PostgreSQL and the Gemini API.",
    "2026 so far: winner of the RAITE 2026 Hackathon, Top 3 in Can You HackIT: The IBPAP Challenge, a Top 8 finalist at EduTech Asia in Singapore, and Top 20 in the Philippine Startup Challenge XI Central Luzon regional round.",
  ],
  education: {
    school: "University of the Assumption",
    location: "San Fernando, Pampanga",
    degree: "BS Information Technology",
    years: "2023 – Present",
    capstone:
      "UACAP (Unified Access to Clinic Administration Portal), a PhilHealth-integrated clinic EMR",
  },
  honors: [
    {
      title: "President's Lister",
      terms: "1st Sem 2023–24 · 1st & 2nd Sem 2025–26",
    },
    { title: "Dean's Lister", terms: "1st & 2nd Sem 2024–25" },
  ],
  languages: ["English", "Filipino", "Kapampangan"],
  seeking: "Web developer, full-stack or AI developer roles",
});
