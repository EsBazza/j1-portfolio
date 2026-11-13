import { profileSchema } from "./schema";

// Source: the resume (Amaro_Juno_Alonzo_Main_Resume.pdf). The phone number is
// left out on purpose until Juno decides whether it belongs on the site.
export const profile = profileSchema.parse({
  name: "Amaro Juno D. Alonzo",
  shortName: "Juno Alonzo",
  brand: "J1 Dev",
  role: "BSIT Student",
  pitch:
    "I build and ship full-stack web apps with Next.js, TypeScript, PostgreSQL and the Gemini API.",
  intro:
    "I'm Juno, an IT student from Pampanga. I can't leave a good idea alone until it's real and running. So I build it, put it online, and keep fixing it until it's something people actually want to use.",
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
    "I'm a BSIT student at the University of the Assumption and a President's Lister. I build full-stack web apps, from an AI exam platform to a public-works transparency map. This year I won the RAITE 2026 Hackathon, placed 1st Runner-Up at EDUtech Asia 2026 in Singapore, and finished Top 3 at Can You HackIT.",
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
  seeking: "an internship, freelance work and developer roles",
});
